const { app, BrowserWindow, ipcRenderer, ipcMain } = require('electron');
const sqlite3 = require('sqlite3');
const { open, Database } = require('sqlite');
const fs = require('fs');

let bounds;

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

        // Getting the bounds setting from the database
        db.get('SELECT value FROM setting WHERE name = \'bounds\'')
          .then((results) => {
            if (results) {
              const array = results.value.split(':');
              bounds = { x: parseInt(array[0], 10), y: parseInt(array[1], 10), width: parseInt(array[2], 10), height: parseInt(array[3], 10) };
            }

            // Starting the app
        app
        .whenReady()
        .then(() => {
          window = new BrowserWindow({
            width: 886,
            height: 793,
            webPreferences: {
              nodeIntegration: true,
            }
          })
          window.loadFile('dist/minesweeper/index.html');
          if (bounds) {
            window.setBounds(bounds);
          } else {
            bounds = window.getBounds();
          }

          // Saving the bounds when the window is resized
          window.on('resize', () => {
            bounds = window.getBounds();
          });

          // Close event
          app.on('window-all-closed', () => {

            const boundsStr = `${bounds.x}:${bounds.y}:${bounds.width}:${bounds.height}`;

            // Saving the window size in the database
            db.run(`INSERT INTO setting (name, value)
              VALUES ('bounds', ?)
              ON CONFLICT(name)
              DO UPDATE SET value = excluded.value`, boundsStr)
              .then(() => {
                console.log('Window bounds saved to the database');
              })
              .catch((err) => {
                console.log(`Could not save the bounds to the database: ${err}`);
              });

            // Exiting the app in MacOSX
            if (process.platform != 'darwin') {
              app.quit();
            }
          });

          // IPC
          ipcMain
            .on('saveScore', (event, score) => {
              // Saving the score in the database
              db.run(
                'INSERT INTO score (score_mode, score_cols, score_rows, score_bombs, score_time, score_date) VALUES (?, ?, ?, ?, ?, ?)',
                score.mode.toString().toUpperCase(),
                score.cols,
                score.rows,
                score.bombs,
                score.time,
                score.date.toString()
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
              db.all('SELECT score_mode, score_cols, score_rows, score_bombs, score_time, score_date FROM score ORDER BY score_date DESC')
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
        })
        .catch((err) => {
          throw err;
        });
      });
  })
  .catch((err) => {
    throw err;
  })