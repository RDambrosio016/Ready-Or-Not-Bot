const { RichEmbed } = require('discord.js')
const { client } = require('../../main.js')

module.exports = { 
    name:"info",
    description:"Shows general info about the bot",
    category:"help",
    adminonly:false,
    execute(message) {
        const embed = new RichEmbed() 
            .setAuthor(client.user.tag, client.user.avatarURL)
            .setDescription('A Discord bot made for the Ready or Not server by SenorDickweed#0069, [code](https://github.com/duckthecuck/Ready-Or-Not-Bot)')
            .addField('Written in', 'Node js, with the Discord.js library', true)
            .addField('Support', 'Please contact SenorDickweed#0069 or submit an issue on the github repo', true)
            .setColor('RED')
        message.channel.send(embed)
    }
}