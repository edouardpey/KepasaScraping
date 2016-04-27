//Api = new Mongo.Collection("api");


if (Meteor.isClient) {

  Meteor.call('getTweet_RATP', function (error, result) {
    if (error) {
      console.log("error", error);
    };

    console.log(result[0]);

    Session.set("tweetR1", result[1]);
    Session.set("tweetR2", result[2]);
  });

  Template.tweets.helpers({
    tweet_RATP_1: function () {
      return Session.get("tweetR1");
    }
  });
  
    Template.tweets.helpers({
    tweet_RATP_2: function () {
      return Session.get("tweetR2");
    }
  });



    

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var cheerio = Meteor.npmRequire('cheerio');

    Meteor.methods({
      getTweet_RATP: function () {
        result = Meteor.http.get("https://twitter.com/WMyWay_Mobile");
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
