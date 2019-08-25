const cheerio = require('cheerio');
const request = require('requestify');

module.exports.faqparse = async () => {
  let category = 'General information';
  let faqparsed = [];
  let res = await request.get('https://www.reddit.com/r/ReadyOrNotGame/wiki/faq')
      const $ = cheerio.load(res.getBody());
      $('#wiki_general_information').nextUntil('#wiki_previous_editions').each((index, element) => {
          if($(element).next().is('h2')) {
            category = $(element).next().text().replace(/[\[\]]/g, '');
          }
          if(!$(element).is('p') && !$(element).next().is('blockquote')) return;
          faqparsed.push({ "title":$(element).text(), "entry":$(element).next().text(), "category":category});
      });
    faqparsed = faqparsed.filter(i => i.title.replace(/\W/g, '') !== ''); //filter out any whitespace entries
    console.log('FAQ Data loaded');
    return faqparsed;
};

