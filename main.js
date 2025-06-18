const { app, BrowserWindow} = require('electron')
const path = require('node:path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 600,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('site/index.html')
}

app.whenReady().then(() => {
  createWindow()
})
// если все страницы закрыты, выход из программы
app.on('window-all-closed', () => {
  app.quit()
})