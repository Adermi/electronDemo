const {
  app,
  BrowserWindow
} = require('electron')
const {
  autoUpdater
} = require('electron-updater')
const path = require('path')

// 自动更新
function checkUpdate() {
  autoUpdater.setFeedURL('http://127.0.0.1:9005/win32')

  //检测更新
  autoUpdater.checkForUpdates()

  //监听'error'事件
  autoUpdater.on('error', (err) => {
    console.log(err)
  })

  //监听'update-available'事件，发现有新版本时触发
  autoUpdater.on('update-available', () => {
    console.log('found new version')
  })

  //默认会自动下载新版本，如果不想自动下载，设置autoUpdater.autoDownload = false

  //监听'update-downloaded'事件，新版本下载完成时触发
  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      type: 'info',
      title: '应用更新',
      message: '发现新版本，是否更新？',
      buttons: ['是', '否']
    }).then((buttonIndex) => {
      if (buttonIndex.response == 0) { //选择是，则退出程序，安装新版本
        autoUpdater.quitAndInstall()
        app.quit()
      }
    })
  })
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, './preload.js')
    }
  })
  mainWindow.loadFile('./index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('ready', () => {
  //每次启动程序，就检查更新
  setInterval(() => {
    // 检查自动更新
    console.log("===检查自动更新===")
    checkUpdate()
  }, 1000)
})