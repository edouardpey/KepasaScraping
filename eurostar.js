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
          var today = new Date(); //récupérationd de la date.
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();
            if(dd<10){
                dd='0'+dd
            } 
            if(mm<10){
                mm='0'+mm
            } 
          var date = yyyy+mm+dd;

        result = Meteor.http.get("https://www.horairetrain.net/horaires-londres-paris-"+date+".html");
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
