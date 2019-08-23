const stringSimilarity = require('string-similarity');
const Discord = require('discord.js');
const _ = require('lodash');
const formatting = require('../Functions/FaqFormatting.js');
let index;

module.exports = {
	name: 'faq',
	description: 'Grabs an entry from the faq with paging (PROTOTYPE)',
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

		faqparsed.sort((a, b) => (a.Similarity < b.Similarity) ? 1 : ((b.Similarity < a.Similarity) ? -1 : 0));
		const returned = formatting.faqformat(message, faqparsed);
			message.channel.send(returned).then(m => {
				m.react('🗑')
					.then(() => m.react('1⃣'))
						.then(() => m.react('2⃣'))
							.then(() => m.react('3⃣'))
								.then(() => m.react('4⃣'))
									.then(() => m.react('5⃣'))
				.catch(() => console.error('One of the emojis failed to react.'));
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
					if(r.emoji.name == '1⃣') {
						index = 0;
						formatting.entryformat(message, faqparsed, index);
						m.delete().catch(err => { console.log(err);});
						return;
					}
					if(r.emoji.name == '2⃣') {
						index = 1;
						formatting.entryformat(message, faqparsed, index);
						m.delete().catch(err => { console.log(err);});
						return;
					}
					if(r.emoji.name == '3⃣') {
						index = 2;
						formatting.entryformat(message, faqparsed, index);
						m.delete().catch(err => { console.log(err);});
						return;
					}
					if(r.emoji.name == '4⃣') {
						index = 3;
						formatting.entryformat(message, faqparsed, index);
						m.delete().catch(err => { console.log(err);});
						return;
					}
					if(r.emoji.name == '5⃣') {
						index = 4;
						formatting.entryformat(message, faqparsed, index);
						m.delete().catch(err => { console.log(err);});
						return;
					}
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



