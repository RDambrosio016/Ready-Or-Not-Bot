const RedditEntry = require('../Classes/RedditEntry.js');

module.exports = {
    name:"meme",
    description:"grabs a random meme from the sub",
    execute(message, args) {
        let entry = new RedditEntry()
        entry.Generate().then(() => {
            if(args[0] == '?raw')
            return message.channel.send(entry.Raw, {code:'json'})
            message.channel.send(entry.Embed);
        });
    }
}