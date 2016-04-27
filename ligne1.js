if (Meteor.isClient) {

  Meteor.call('getTweet_ligne1', function (error, result) {
    if (error) {
      console.log("error", error);
    };

    console.log(result[0]);

    Session.set("tweetC1", result[0]);
    Session.set("tweetC2", result[1]);
    Session.set("tweetC3", result[3]);
  });
    

  Template.tweets.helpers({
    tweet_ligne1_1: function () {
      return Session.get("tweetC1");
    }
  });
    Template.tweets.helpers({
    tweet_ligne1_2: function () {
      return Session.get("tweetC2");
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var cheerio = Meteor.npmRequire('cheerio');

    Meteor.methods({
      getTweet_Ligne1: function () {
        result = Meteor.http.get("https://twitter.com/Ligne1_RATP");
        $ = cheerio.load(result.content);
        // var open = $('div.permalink-inner.permalink-tweet-container > div > div > p').text();
        var body = $('div > div.content > div.js-tweet-text-container > p').text();

        var tweets = [];

            $('div > div.content > div.js-tweet-text-container > p').each(function(i, elem) {
              tweets[i] = $(this).text();
            });

            tweets.join(', ');

        return tweets;
      },
    })
  });
}