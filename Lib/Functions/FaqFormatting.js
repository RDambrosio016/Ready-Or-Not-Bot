const Discord = require ('discord.js');

module.exports.faqformat = (message, faqparsed) => {

  const presented = new Discord.RichEmbed()
    .setTitle('5 Best matching entries')
    .setColor('RED')
    .setDescription(faqparsed[0].title + ': **1**\n\n\n' + faqparsed[1].title + ': **2**\n\n\n' + faqparsed[2].title + ': **3**\n\n\n' + faqparsed[3].title + ': **4**\n\n\n' + faqparsed[4].title + ': **5**');

    return presented;
};

module.exports.entryformat = (message, faqparsed, index) => {

  const embed = new Discord.RichEmbed()
  .setColor('RED')
  .setTitle(faqparsed[index].title)
  .setDescription('```' + faqparsed[index].entry + '```')
  .setFooter((Math.round(faqparsed[index].Similarity * 100)) + '% match  https://www.reddit.com/r/ReadyOrNotGame/wiki/faq');

  const filter = (reaction, user, member) => { 
    return ['🗑'].includes(reaction.emoji.name) && user.id === message.author.id;
  };

  message.channel.send(embed).then(m => {
    m.react('🗑');
    m.awaitReactions(filter, {
        max: 1,
        time: 15000,
        errors: ['Time'],
      })
      .then(collected => {
        const reaction = collected.first();
        if (reaction.emoji.name === '🗑') {
          m.delete().then(() => {

              message.delete(message).catch(err => {});

          });
        }
      }).catch(err => {
        m.clearReactions();
      });
  });

};
