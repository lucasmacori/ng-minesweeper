const { app, BrowserWindow } = require('electron');

app
  .whenReady()
  .then(() => {
    new BrowserWindow({
        width: 1280,
        height: 720
    })
      .loadFile('dist/minesweeper/index.html');
  });