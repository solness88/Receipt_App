// preload.js
// セキュリティのためのプリロードスクリプト
// 必要に応じてNode.jsの機能をレンダラープロセスに公開

const { contextBridge } = require('electron');

// 将来的に必要な機能があればここで公開
contextBridge.exposeInMainWorld('electron', {
  // 例: ファイルシステム操作など
  // saveFile: (data) => ipcRenderer.invoke('save-file', data)
});