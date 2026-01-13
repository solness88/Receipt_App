const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;
let splashWindow;
let splashTimeout;



function createSplashScreen() {
  console.log('=== Creating splash screen ===');

  splashWindow = new BrowserWindow({
    width: 400,
    height: 400,
    frame: false,
    alwaysOnTop: true,
    center: true,
    show: true,  
  });

  splashWindow.loadFile(path.join(__dirname, 'splash.html'));

  // 最大5秒後には必ず閉じる
  splashTimeout = setTimeout(() => {
    closeSplash();
  }, 3000);
}

function closeSplash() {
  if (splashTimeout) {
    clearTimeout(splashTimeout);
    splashTimeout = null;
  }
  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.close();
    splashWindow = null;
  }
}







function createWindow() {
  createSplashScreen();
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    show: false,
    icon: path.join(__dirname, '../build/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, 'preload.js'),
      // partition: 'persist:receipt-app'
    }
  });

  // ダウンロード設定を追加
  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    // 確認ダイアログなしで自動保存
    const downloadsPath = require('electron').app.getPath('downloads');
    const filePath = require('path').join(downloadsPath, item.getFilename());
    item.setSavePath(filePath);
  });

  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });


  // アプリの準備ができたら
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });





  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// アプリが起動したらウィンドウを作成
app.whenReady().then(createWindow);

// すべてのウィンドウが閉じられたら終了（macOS以外）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// アプリがアクティブになったらウィンドウを作成（macOS）
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});