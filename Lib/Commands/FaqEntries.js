const { RichEmbed } = require('discord.js')
let categories = [];

module.exports = {
    name:'faqentries',
    description:'Lists all the FAQ entries by category or without category (paginated)',
    category:"faq",
    adminonly:false,
    execute(message, args, faqparsed) {
        
        faqparsed.forEach((i, index) => {
            if(categories.includes(i.category)) return; else categories.push(i.category.replace(/[&\[\]]/g, '').trim().toLowerCase());
        })
        if(args[0]) {
            
        }
    }
}