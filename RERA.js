TweetRERA = new Mongo.Collection('tweetRERA');


if (Meteor.isClient) {

  Meteor.call('getTweet_RERA', function (error, result) {
    if (error) {
      console.log("error", error);
    };

    console.log(result[0]);

    Session.set("tweet1", result[0]);
    Session.set("tweet2", result[1]);
  });

  Template.tweets.helpers({
    tweet_RERA_1: function () {
      return Session.get("tweet1");
    },
    tableRERA: function () {
      return TweetRERA.find().fetch();
    }
  });
    Template.tweets.helpers({
    tweet_RERA_2: function () {
      return Session.get("tweet2");
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var cheerio = Meteor.npmRequire('cheerio');

    Meteor.methods({
      getTweet_RERA: function () {
        result = Meteor.http.get("https://twitter.com/RERA_RATP");
        $ = cheerio.load(result.content);
        // var open = $('div.permalink-inner.permalink-tweet-container > div > div > p').text();
        var body = $('div > div.content > div.js-tweet-text-container > p').text();

        var tweets = [];
        var date = [];
        TweetRERA.remove({});

            $('div.js-tweet-text-container > p').each(function(i, elem) {
              tweets[i] = $(this).text();
              $('div > div.content > div.stream-item-header > small > a > span._timestamp.js-short-timestamp.js-relative-timestamp').each(function(u, elem){
                date[u] = $(this).text();
              });
              var row = {};
              if (tweets[i].includes("trafic")) {
                row["tweets"]=tweets[i]; //Ne récupérons que les tweets parlant de trafic
                row["date"]=date[i];
                TweetRERA.insert(row);
              };
              
            });

            tweets.join(', ');

        return tweets;
      },

    })


  });
}
