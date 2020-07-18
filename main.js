const { app, BrowserWindow, ipcRenderer, ipcMain } = require('electron');
const sqlite3 = require('sqlite3');
const { open, Database } = require('sqlite');
const fs = require('fs');

// Getting the init.sql file
const initSQL = fs.readFileSync('./init.sql', { encoding: 'utf8' });

// Init the database file (SQLite)
open({
  filename: 'minesweeper.db',
  driver: sqlite3.Database
})
  .then((db) => {
    console.log('Connected to sqlite database');

    // Creating the default tables
    db.exec(initSQL)
      .then(() => {
        console.log('Database has been initialized');

        // Starting the app
        app
        .whenReady()
        .then(() => {
          new BrowserWindow({
            width: 1280,
            height: 720,
            webPreferences: {
              nodeIntegration: true,
            }
          })
            .loadFile('dist/minesweeper/index.html');

          // IPC
          ipcMain
            .on('saveScore', (event, score) => {
              // Saving the score in the database
              db.run(
                'INSERT INTO score (score_cols, score_rows, score_bombs, score_time) VALUES (?, ?, ?, ?)',
                score.cols,
                score.rows,
                score.bombs,
                score.time
              )
                .then(() => {
                  console.log('New score saved to the database');
                })
                .catch((err) => {
                  console.log(`Could not save the score to the database: ${err}`);
                });
            })
            .on('getScores', (event) => {
              // Fetching the scores from the database
              db.all('SELECT score_cols, score_rows, score_bombs, score_time FROM score')
                .then((scores) => {
                  event.returnValue = scores;
                })
                .catch((err) => {
                  console.log(`Could not fetch the scores from the database: ${err}`);
                  event.returnValue = [];
                });
            });

          console.log('App started');
        })
        .catch((err) => {
          throw err;
        });
      });
  })
  .catch((err) => {
    throw err;
  })