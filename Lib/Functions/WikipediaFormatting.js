const wtf = require('wtf_wikipedia');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const moment = require('moment');

module.exports.formatting = (index, data, message) => {
  
  const url = data[3][index];
  data[1][index].trim();
  let input = data[1][index];
  input = input.replace(/[\s+]/g, '_');
  (async () => {;
    var doc = await wtf.fetch(input);
    let doc2 = doc.images();

    let description = '';
    let title = '**' + doc.title + '**';
    doc = doc.json();
    for(let i = 0; i < doc.sections[0].paragraphs[0].sentences.length; i++) {
      description = description + doc.sections[0].paragraphs[0].sentences[i].text;
    }
    let paragraph2 = '';
    if(doc.sections[0].paragraphs[1] !== undefined) {
    for(let i = 0; i < doc.sections[0].paragraphs[1].sentences.length; i++) {
      paragraph2 = paragraph2 + doc.sections[0].paragraphs[1].sentences[i].text;
    }
    }
    let fulldescription = (paragraph2 !== '' ? description + '\n\n' + paragraph2: description)
 
    if(fulldescription.length > 1500) fulldescription = fulldescription.substring(1500);
    fulldescription = fulldescription + '...';

    let image = '';
    if(doc2[0] !== undefined) {
      image = doc2[0].url();
    }
    const embed = new Discord.RichEmbed()
    .setAuthor('Entry for ' + input.replace(/[\_+]/g, ' '), 'https://imgur.com/ab2t4Kh.png')
    .setTitle(data[1][index])
    .setURL(url)
    .setDescription(fulldescription)
    .setThumbnail(image)
    .setColor('WHITE')
    .setFooter('Via wikipedia.com • Today at ' + moment().format('LTS'), 'https://imgur.com/yBUUNmd.png');
    const filter = (reaction, user, member) => { //make a filter of only the reaction wastebasket made by the user
      return ['🗑'].includes(reaction.emoji.name) && user.id === message.author.id;
    };
    message.channel.send(embed).then(m => {
      m.react('🗑');
      m.awaitReactions(filter, {
          max: 1,
          time: 7000,
          errors: ['Time'],
        })
        .then(collected => {
          const reaction = collected.first();
          if (reaction.emoji.name === '🗑') {
            m.delete().then(() => {
                message.delete(message).catch(err => { });
            });
          }
        }).catch(err => {
          m.clearReactions().catch(err => {});
        });
    });
    })();

};
