EurostarDB = new Mongo.Collection('eurostarDB');

if (Meteor.isClient) {

  Meteor.call('get_eurostar', function (error, result) {
    if (error) {
      console.log("error", error);
    };

    //console.log(result[0]);

      Session.set("eurostar", result[5]);


    //Session.set("tweet2", result[1]);
  });

  Template.eurostar.helpers({
    get_eurostar_1: function () {
      return Session.get("eurostar");
    }
  });
  Template.eurostar.helpers({
    tableEurostar: function () {
      return EurostarDB.find().fetch();
    }
  });
    /*Template.tweets.helpers({
    tweet_RERA_2: function () {
      return Session.get("tweet2");
    }
  });*/

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var cheerio = Meteor.npmRequire('cheerio');

    Meteor.methods({
      get_eurostar: function () {
        result = Meteor.http.get("https://www.horairetrain.net/horaires-londres-paris-20160423.html");
        $ = cheerio.load(result.content);
        // var open = $('div.permalink-inner.permalink-tweet-container > div > div > p').text();
        var body = $('body > div.page.container > div:nth-child(3) > div.h-l-c > div.horaires-container > div:nth-child(n) > div > div.t-l-c > div > div:nth-child(n)').text();

        var eurostars = [];
        var eurostarsParis = [];
        EurostarDB.remove({});

            $('body > div.page.container > div:nth-child(3) > div.h-l-c > div.horaires-container > div:nth-child(n) > div > div.t-l-c > div > div:nth-child(n)').each(function(i, elem) {
              eurostars[i] = $(this).text();
              if (eurostars[i].includes("Paris")) {
                eurostarsParis.push(eurostars[i]);
                var row = {};
                row["eurostar"]= eurostars[i];
                EurostarDB.insert(row);
              };
            });

            eurostars.join(', ');

        return eurostarsParis;
      },

    })


  });
}
