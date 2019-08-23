require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const htmlparse = require('./Lib/Functions/HtmlParse.js');
let prefix = '+', faqparsed = [];
const wikipedia = require('./Lib/Commands/Wikipedia.js');

client.once('ready', async () => {
  console.log('Bot running in the index file.');
   faqparsed = await htmlparse.faqparse(); //load faq data
   client.user.setPresence({
    game: {
      name: 'Ready or noot',
      type: 'PLAYING',
    },
  });
});


client.commands = new Discord.Collection(); //load commands
const commandFiles = fs.readdirSync('./Lib/Commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./Lib/Commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('message', async message => {

  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (!client.commands.has(command)) return;

  try {
  	client.commands.get(command).execute(message, args, faqparsed);
  } catch (error) {
  	console.error(error);
  	message.reply('there was an error trying to execute that command');
  }

});

client.login(process.env.TOKEN);
