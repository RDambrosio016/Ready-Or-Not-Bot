require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const htmlparse = require('./Lib/Functions/HtmlParse.js');
let prefix = '+', faqparsed = [];
const wikipedia = require('./Lib/Commands/Wikipedia.js');
const sqlite3 = require('sqlite3').verbose()
require('./Lib/Database/Db.js')
const start = require('./Lib/Features/Twitter.js')

let db = new sqlite3.Database('Config', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the DB');
});

client.once('ready', async () => {
  console.log('Bot running in the index file.');
   faqparsed = await htmlparse.faqparse(); //load faq data
   start(client);
   client.user.setPresence({
    game: {
      name: 'Ready or noot',
      type: 'PLAYING',
    },
  });
  module.exports = client
});


client.commands = new Discord.Collection(); //load commands
const commandFiles = fs.readdirSync('./Lib/Commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./Lib/Commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('message', async message => {

  if (message.author.bot || !message.content.startsWith('+')) return;

  const args = message.content.slice(1).split(/ +/);
  const command = args.shift().toLowerCase();

  if (!client.commands.has(command)) return;

  try {

    let toExecute = client.commands.get(command)

    //check if the command is admin only, if it is then check for either admin perms or the bot management role
    if(toExecute.adminonly) {
      if(!message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.has('552952275828604933')) return;
    }

    //check if the command is enabled
      db.get(`SELECT Enabled FROM config WHERE Entry=(?)`, [toExecute.name], function(err, rows) {
        if(rows.Enabled == 0) return; else toExecute.execute(message, args, faqparsed);
      })

  } catch (error) {
  	console.error(error);
  	message.reply('there was an error trying to execute that command, please ping @SenorDickweed');
  }

});

//consoles have a tendency to cut off parts of the error, this is to prevent this

client.on('error', err => {
  console.log(err)
})

client.login(process.env.TOKEN);

