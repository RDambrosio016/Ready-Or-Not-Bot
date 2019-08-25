var Plotly = require('plotly')("cavalier.archer", process.env.PLOTLYKEY)

var fs = require('fs');
const { Attachment, RichEmbed } = require('discord.js');
let stats = {
    "Categories": [],
    "Numbers": []
};
let executed = false;
module.exports = {
    name:"stats",
    description:"Displays stats about the faq",
    params:'none',
    category:"Faq",
    adminonly:false,
    execute(message, args, faqparsed) {
        //count how many entries in each category
        if(executed == false) {
        faqparsed.forEach(i => {
            //prevents the numbers doubling on every iteration of the command
            if(stats.Numbers[i.category] === undefined) {
                stats.Numbers[i.category] = 1
            } else {
                stats.Numbers[i.category] += 1;
            }
        })
        //make a pie graph
        faqparsed.forEach((i, index) => {
            if(stats.Categories.includes(i.category)) return; else stats.Categories.push(i.category);
                                
        })
        }
        executed = true;
        var data = [
            {
              x: stats.Categories,
              y: Object.values(stats.Numbers),
              type: 'bar'
            }
        ]        
          var figure = { 'data': data };
          var imgOpts = {
              format: 'png',
              width: 1000,
              height: 500
          } 
          let sendablestats = '';
          stats.Categories.forEach((i, index) => {
              //format the categories
            sendablestats += `\n${i}: **${Object.values(stats.Numbers)[index]} Entries** (${Math.round((Object.values(stats.Numbers)[index] / faqparsed.length) * 100)}%)\n`
          })  
          //create an image stream and send the embed
          Plotly.getImage(figure, imgOpts, async function (error, imageStream) {
              if (error) return console.log (error);
                const embed = new RichEmbed()
                    .setAuthor(message.author.tag, message.author.avatarURL)
                    .setDescription(`Stats for the Ready Or Not FAQ:\n\nTotal entries: **${faqparsed.length}**\n${sendablestats}`)
                    .setFooter('NOTE: because of the inherent buggyness in fetching the FAQ, these stats have a margin of error of +- 5%')
                    .setColor('GREEN')
                    .attachFiles([{ attachment: imageStream, name: "Graph.png"}])
                    .setImage('attachment://Graph.png')
                message.channel.send(embed);
            }); 
    }
}