EurostarDB = new Mongo.Collection('eurostarDB');

if (Meteor.isClient) {

  Meteor.call('get_eurostar', function (error, result) {
    if (error) {
      console.log("error", error);
    };

      Session.set("eurostar", result[0]);

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
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var cheerio = Meteor.npmRequire('cheerio');

    Meteor.methods({
      get_eurostar: function () {
        result = Meteor.http.get("https://www.horairetrain.net/horaires-londres-paris-20160424.html");
        $ = cheerio.load(result.content);

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

        return eurostarsParis;
      },

    })


  });
}
