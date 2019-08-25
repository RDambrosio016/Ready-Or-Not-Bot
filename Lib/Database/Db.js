/*
* this database is purely used to store config choices so they are permanent
* uses SQLite 3
*/
const fs = require('fs')
const sqlite3 = require('sqlite3').verbose()

let db = new sqlite3.Database('Config', (err) => {
  if (err) {
    return console.error(err.message);
  }
});

function init() {
  db.serialize(function() {
      db.run(`
          CREATE TABLE IF NOT EXISTS config (
              Entry TEXT,
              Enabled INTEGER DEFAULT 1,
              UNIQUE(Entry)
      )`)
      /*
      * load each command name into the database table
      * each with a name prop and an enabled boolean (really an integer because sql doesnt do t/f booleans)
      * if the row already exists, ignore it, the checking for null is for debug
      */
      const files = fs.readdirSync('./Lib/Commands')
      for(i of files) {

        //ignore null files (non-command files for debug)
        if(require(`../Commands/${i}`).name == null) continue;
        db.run(`INSERT OR IGNORE INTO config (Entry) VALUES (?)`, [require(`../Commands/${i}`).name], function(err) {
          if(err) console.log(err)
        })
      }

      //delete obsolete entries, entries that arent commands
      db.all(`SELECT * FROM config`, function(err, rows) {
        if(err) console.log(err)
        let names = [];
        files.forEach(i => {
          names.push(require(`../Commands/${i}`).name)
        })
        rows.forEach((i, index) => {
          if(!names.includes(i.Entry)) {
            db.run(`DELETE FROM CONFIG WHERE Entry = ?`, [i.Entry])
          }
        })
      })
  })
}
init()
module.exports = { init }