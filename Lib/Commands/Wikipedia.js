const wtf = require('wtf_wikipedia');
const fs = require('fs');
const search = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=';
const Discord = require('discord.js');
const fetch = require('node-fetch');
const w = require('../Functions/WikipediaFormatting.js');

module.exports = {
  name: 'wikipedia',
  description: 'returns a wikipedia article',
  execute(message, args, faqparsed) {
    var allArgs = '';
    for (let i = 0; i < args.length; i++) {
      allArgs += args[i].toLowerCase() + ' ';
    }
    allArgs = allArgs.trim();
    allArgs = allArgs.replace(/[\s+]/g, '_');
    const searchurl = search + allArgs;

      fetch(searchurl)
    .then(res => res.json())
    .then((data) => {
      if (data[1].length === 0) {
           let embed = new Discord.RichEmbed()
               .setAuthor('No results', 'https://imgur.com/ab2t4Kh.png')
               .setTitle('Error: There are no search results for ' + allArgs.replace(/[\_]/g, ' ') + ' :( . Try something else!')
               .setColor('WHITE');
            message.channel.send(embed);
           return;
       }
       let index = 0;
       let listNumbers = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣"];
        let usedListNumbers = [];
        let articleListText = "";
        if(data[1].length == 1) {index = 0; w.formatting(index, data, message); return; }
        if(data[1].length === 10) data[1].length = data[1].length - 1;

        for (let i = 0; i < 20; i++) {
          if(i === data[1].length) break;
            articleListText += listNumbers[i] + "  " + data[1][i];
            articleListText += "\n";
        }
        let embed = new Discord.RichEmbed()
            .setAuthor('Results', 'https://imgur.com/ab2t4Kh.png')
            .addField('Here are the search results for:' + allArgs, articleListText + "\n")
            .setFooter("Use the reactions to select an article to get the description and link.")
            .setColor('WHITE');
            const pagesFilter = (reaction, user) => user.id == message.author.id;
        message.channel.send(embed)
        .then(async msg => {
            for (const reaction of listNumbers) {
              if(index === data[1].length) break;
              await msg.react(reaction);
              index++;
            }


          const pages =  new Discord.ReactionCollector(msg, pagesFilter, {
            time: 60000,
          });

          pages.on('collect', r => {
            if(r.emoji.name === listNumbers[-1]) {index = -1; w.formatting(index, data, message); msg.delete(); return;}
            else if(r.emoji.name === listNumbers[0]) {index = 0; w.formatting(index, data, message); msg.delete(); return;}
            else if(r.emoji.name === listNumbers[1]) {index = 1; w.formatting(index, data, message); msg.delete(); return;}
            else if(r.emoji.name === listNumbers[2]) {index = 2; w.formatting(index, data, message); msg.delete(); return;}
            else if(r.emoji.name === listNumbers[3]) {index = 3; w.formatting(index, data, message); msg.delete(); return;}
            else if(r.emoji.name === listNumbers[4]) {index = 4; w.formatting(index, data, message); msg.delete(); return;}
            else if(r.emoji.name === listNumbers[5]) {index = 5; w.formatting(index, data, message); msg.delete(); return;}
            else if(r.emoji.name === listNumbers[6]) {index = 6; w.formatting(index, data, message); msg.delete(); return;}
            else if(r.emoji.name === listNumbers[7]) {index = 7; w.formatting(index, data, message); msg.delete(); return;}
            else if(r.emoji.name === listNumbers[8]) {index = 8; w.formatting(index, data, message); msg.delete(); return;}
          });
          pages.on('end', (collected, reason) => {
            if(reason == 'time') {
              msg.delete().catch(err => {
              });
            }
          });
        });
      });
  },
};
