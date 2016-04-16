if (Meteor.isClient) {

  Meteor.call('getTweet_RERC', function (error, result) {
    if (error) {
      console.log("error", error);
    };

    console.log(result[0]);

    Session.set("tweetC1", result[0]);
    Session.set("tweetC2", result[1]);
  });
    

  Template.tweets.helpers({
    tweet_RERC_1: function () {
      return Session.get("tweetC1");
    }
  });
    Template.tweets.helpers({
    tweet_RERC_2: function () {
      return Session.get("tweetC2");
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var cheerio = Meteor.npmRequire('cheerio');

    Meteor.methods({
      getTweet_RERC: function () {
        result = Meteor.http.get("https://twitter.com/RERC_SNCF?lang=fr");
        $ = cheerio.load(result.content);
        // var open = $('div.permalink-inner.permalink-tweet-container > div > div > p').text();
        var body = $('div > div.content > div.js-tweet-text-container > p').text();

        var tweets = [];

            $('div.js-tweet-text-container > p').each(function(i, elem) {
              tweets[i] = $(this).text();
            });

            tweets.join(', ');

        return tweets;
      },
    })
  });
}
