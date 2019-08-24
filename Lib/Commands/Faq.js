const stringSimilarity = require('string-similarity');
const Discord = require('discord.js');
const _ = require('lodash');
const formatting = require('../Functions/FaqFormatting.js');
let index;

module.exports = {
	name: 'faq',
	description: 'Grabs an entry from the faq with paging (PROTOTYPE)',
	category:'faq',
	adminonly:false,
	execute(message, args, faqparsed) {

		let allArgs = '';
	   for (let i = 0; i < args.length; i++) {
	     allArgs += args[i].toLowerCase() + ' ';
	   }

		for (i of faqparsed) {
	  s1 = allArgs.replace(/[^\w]/g, '').toLowerCase();
      s2 = i.title.replace(/[^\w]/g, '').toLowerCase();
        i.Similarity = stringSimilarity.compareTwoStrings(s1, s2);
		 };

		let reactions = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣"];

		//order results by relevancy
		faqparsed.sort((a, b) => (a.Similarity < b.Similarity) ? 1 : ((b.Similarity < a.Similarity) ? -1 : 0));

		if(faqparsed[0].Similarity * 100 >= 85) {
			formatting.entryformat(message, faqparsed, 0)
			return;
		}
		
		const returned = formatting.faqformat(message, faqparsed);
			message.channel.send(returned).then(async m => {
				for(i of reactions) {
					await m.react(i);
				}
				const pagesFilter = (reaction, user) => user.id == message.author.id;
	      const pages = new Discord.ReactionCollector(m, pagesFilter, {
	        time: 60000,
				});

				pages.on('collect', r => {
					if(r.emoji.name == '🗑') {
						m.delete().catch(err => { console.log(err);});
						message.delete().catch(err => { console.log(err);});
						return;
					}
					reactions.forEach((i, index) => {
						if(r.emoji.name == i) {
							formatting.entryformat(message, faqparsed, index)
							m.delete().catch()
							return;
						}
					})
				});
				pages.on('end', (collected, reason) => {
					if(reason == 'time') {
						message.delete().catch(err => {});
						m.delete().catch(err => {});
					}
				});
			});
	},

};



