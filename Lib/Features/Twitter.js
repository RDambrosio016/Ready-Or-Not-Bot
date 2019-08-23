
var Twit = require('twit');
var T = new Twit({
  consumer_key:         process.env.CONSUMER_KEY,      //not getting muh secret stuff >:)
  consumer_secret:      process.env.CONSUMER_SECRET,
  access_token:         process.env.ACCESS_TOKEN,
  access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
});

var stream = T.stream('statuses/filter', {
  follow: 3795407902,
});
  stream.on('tweet', function(tweet) {
    const url = ('https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str);
    const embed = new Discord.RichEmbed()
      .setAuthor('New tweet from ' + tweet.user.name, tweet.user.profile_image_url, url)
      .setColor('BLUE')
      .setDescription('\n' + tweet.text)
      .setFooter('Today, ' + tweet.created_at + ' Via twitter.com ', 'https://imgur.com/Xi3AydO.png');
      
    if(tweet.entities.media) {
        embed.setImage(tweet.entities.media[0].media_url);
      }

      client.channels.get('577571884644827153').send(embed);
  });