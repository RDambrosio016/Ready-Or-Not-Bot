const fs = require('fs')
const { RichEmbed } = require('discord.js')

module.exports = {
    name:"help",
    execute(message) {
        const files = fs.readdirSync('./Lib/Commands')
        let embed = new RichEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL)
            .setColor('BLUE')
        const categories = []
        for(i of files) {
            if(require(`./${i}`).category == undefined) continue;
            if(categories.includes(require(`./${i}`).category)) {
                continue;
            } else {
                categories.push(require(`./${i}`).category)
            }
        }
        let commands = [], command, content;
        for(i of categories) {
            content = '';
            for(b of files) {
                if(require(`./${b}`).category == i) {
                     command = require(`./${b}`)
                     content += `   **+${command.name}** \`${command.params == 'none' || command.params == undefined ? '\u200b' : command.params}\` - ${command.description}\n`
                } else continue;
            }
            embed.addField(`❯ ${i}`, content)
        }
        message.channel.send(embed)
    }
}