const fetch = require('node-fetch');
const { RichEmbed } = require('discord.js');
const moment = require('moment');

    let post = {};

    class RedditEntry {
        async Generate() {
            await fetch('https://www.reddit.com/r/ReadyOrNotGame.json?limit=100').then(res => res.json()).then(json => {
                post = json.data.children.filter(m => m.data.link_flair_text === 'Joke/Meme')
                post = post[Math.floor(Math.random() * post.length)]
                this.body = post.data.selftext ? post.data.selftext : false;
                this.title = post.data.title
                this.image = post.data.url ? post.data.url : false;
                this.author = 'u/' + post.data.author
                this.createdAt = post.data.created
                this.upvotes = post.data.ups
                this.link = `https://www.reddit.com${post.data.permalink}`
            })
        }
        get Embed() {
            let embed = new RichEmbed()
                .setTitle(this.title)
                .setURL(this.link)
                .setAuthor(this.author)
                .addField('Upvotes:', this.upvotes)
                .setFooter(`Posted ${moment.unix(parseInt(this.createdAt)).format('MMMM Do YYYY [At] hh[:]mm A')}`, 'https://i.imgur.com/rgK8YTD.png')
                .setColor([255, 86, 0])
            if(this.body) embed.setDescription(this.body)
            if(this.image) embed.setImage(this.image)
            return embed;
        }
        get Raw() {
            return JSON.stringify(this);
        }
    }

    module.exports = RedditEntry;

