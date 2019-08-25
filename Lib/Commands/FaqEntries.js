const { RichEmbed, ReactionCollector } = require('discord.js')
const stringSimilarity = require('string-similarity');
let categories = [];

Object.defineProperty(Array.prototype, 'chunk', {
    value: function(chunkSize) {
      var R = [];
      for (var i = 0; i < this.length; i += chunkSize)
        R.push(this.slice(i, i + chunkSize));
      return R;
    }
  });

module.exports = {
    name:'faqentries',
    description:'Lists all the FAQ entries by category (Paginated)',
    params:"[Category]",
    category:"Faq",
    adminonly:false,
    async execute(message, args, faqparsed) {
        faqparsed.forEach((i, index) => {
            if(categories.includes(i.category)) return; else categories.push(i.category);
        })
        if(!args[0]) return message.channel.send(`Please enter an FAQ Category (${categories.join(' ,')})`)
        query = args.join('');
        let sim = [];
        for(i of categories) {
            sim.push({"Similarity":stringSimilarity.compareTwoStrings(query.replace(/\W/g, ''), i.replace(/\W/g, '').toLowerCase()) * 100, 'Category':i})
        }
        sim.sort((a, b) => (a.Similarity < b.Similarity) ? 1 : ((b.Similarity < a.Similarity) ? -1 : 0));

        //only grab the matching entries
        const entries = faqparsed.filter(i => i.category == sim[0].Category)
        let titles = [];

        //make an array of only the matching titles
        for(i of entries) {
            titles.push(i.title)
        }

        //split the array into a 2 dimensional array of 10 or less entries each layer
        titles = titles.chunk(10)

        function getDesc(chunk) {
            let str = '';
            for(i of chunk) {
                str += `❯ ${i}\n\n`
            }
            return str;
        }

        let embed = new RichEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL)
            .setDescription(getDesc(titles[0]))
            .setFooter(`0 / ${titles.length}`)
            .setColor('GREEN')
        
        //do the pagination
        const m = await message.channel.send(embed)
            await m.react('⬅')
            await m.react('➡')
        const filter = (reaction, user) => { return user.id == message.author.id; }
        const collector = new ReactionCollector(m, filter, { time: 5 * 60 * 1000})
        let index = 0;
        collector.on('collect', (reaction, user) => {
            if(reaction.emoji.name == '⬅') {
                if(index == 0) {
                    reaction.remove(message.author.id).catch(e => {});
                    return;
                }
                index--
                embed.setDescription(getDesc(titles[index]))
                embed.setFooter(`${index + 1} / ${titles.length}`)
                reaction.remove(message.author.id).catch(e => {});
                m.edit(embed).catch(e => {})
            }
            if(reaction.emoji.name == '➡') {
                if(index == titles.length - 1) {
                    reaction.remove(message.author.id).catch(e => {});
                    return;
                }
                index++
                embed.setDescription(getDesc(titles[index]))
                embed.setFooter(`${index + 1} / ${titles.length}`)
                reaction.remove(message.author.id).catch(e => {});
                m.edit(embed).catch(e => {})
            }
        })

    }
}