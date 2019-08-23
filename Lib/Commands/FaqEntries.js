const { RichEmbed } = require('discord.js')
let categories = [];

module.exports = {
    name:'faqentries',
    execute(message, args, faqparsed) {
        
        faqparsed.forEach((i, index) => {
            if(categories.includes(i.category)) return; else categories.push(i.category.replace(/[&\[\]]/g, '').trim().toLowerCase());
        })
        if(args[0]) {
            
        }
    }
}