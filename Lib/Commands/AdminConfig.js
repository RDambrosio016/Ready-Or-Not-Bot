const Discord = require('discord.js')
const sqlite3 = require('sqlite3')

let db = new sqlite3.Database('Config', (err) => {
    if (err) {
      return console.error(err.message);
    }
  });
  
//entries (commands) to be ignored, null is for debug
let ignores = [
  "adminconfig",
  "info",
  "help",
  null
]

let listNumbers = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣"];
let index = 0;

module.exports = {
    name:'adminconfig',
    description:'Brings up a menu to disable and enable commands',
    category:'admin',
    adminonly:true,
    async execute(message) {
        db.all(`SELECT * FROM config`, async function(err, rows) {
          if(err) console.log(err)
          rows.forEach((i, index) => {
            if(ignores.includes(i.Entry)) rows.splice(index, 1)
          })

          //function to check the state of each entry to see if its enabled, and generate an embed description from that
          function getDescription(content) {
            let description = '', end = '';
            for(i of content) {
                end = i.Enabled == 0 ? '<:4366_RedTick:614658883193012225>' : '✅'
                if(ignores.includes(i.Entry)) continue;
                description += `${end} --- ${i.Entry}\n`
            }
            return description;
          }

          let embed = new Discord.RichEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL)
            .setDescription(getDescription(rows))
            .setColor('RED')
            .setFooter('Use the reactions to enable to disable commands')
          const m = await message.channel.send(embed)

          for(let i = 0; i < rows.length; i++) {
            await m.react(listNumbers[i])
          }

          const filter = (reaction, user) => { 
            return user.id == message.author.id && listNumbers.includes(reaction.emoji.name)
          }
          const collector = new Discord.ReactionCollector(m, filter, { time: 10 * 60 * 1000})

          collector.on('collect', (reaction, user) => {
            //this is a big mess because the info must be queryied every time something is changed, the old result cannot be used

            db.all(`SELECT * FROM config`, function(err, result) {
              result.forEach((i, index) => {
                if(ignores.includes(i.Entry)) result.splice(index, 1)
              })

              //find out the entry being referred to by the reaction, and invert the boolean to be set
              reaction.remove(message.author.id);
              const entryIndex = listNumbers.findIndex(i => i == reaction.emoji.name)
              toUpdate = result[entryIndex].Enabled == 1 ? 0 : 1

              //update the enabled param of the config
              db.run(`
                UPDATE config
                  SET Enabled = ?
                  WHERE Entry = ?`, [toUpdate, result[entryIndex].Entry], function(err) {
                    if(err) console.log(err)
                  })

                //requery the data, and update the embed
                db.all(`SELECT * FROM config`, function(err, descriptionParams) {
                  descriptionParams.forEach((i, index) => {
                    if(ignores.includes(i.Entry)) descriptionParams.splice(index, 1)
                  })
                  embed.setDescription(getDescription(descriptionParams))
                  m.edit(embed);
                })
          })
        })
        collector.on('end', () => {
          m.delete().catch(err);
        })
      })
  }
}