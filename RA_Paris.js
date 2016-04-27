EvenementsRA = new Mongo.Collection('evenementsRA');


if (Meteor.isClient) {

  Meteor.call('getevent_RA', function (error, result) {
    if (error) {
      console.log("error", error);
    };
  });


  Template.residentadvisor.helpers({
    evenementsRA : function () {
      return EvenementsRA.find().fetch();
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var cheerio = Meteor.npmRequire('cheerio');

    Meteor.methods({    
      getevent_RA: function () {
        
        result = Meteor.http.get("https://www.residentadvisor.net/events.aspx?ai=44&v=day");
        $ = cheerio.load(result.content);


        var eventRA = [];
        var date = [];
        var lieu = [];
        EvenementsRA.remove({});

          $('article > div > h1 > a').each(function(i, elem) {
              eventRA[i] = $(this).text();
              $('article > div > h1 > span > a').each(function(i,elem) {
                lieu [i] = $(this).text();
              });
            
              var now = new Date();
              var annee   = now.getFullYear();
              var mois    = ('0'+ (now.getMonth() + 1)).slice(-2);
              var jour    = ('0'+ now.getDate()).slice(-2);
              var dateTotale = jour+'/'+mois+'/'+annee;

              var row = {};
              row["eventRA"]= eventRA [i];
              row["date"] = dateTotale;
              row["lieu"] = lieu [i];
              EvenementsRA.insert(row);
            });

        return eventRA;
      }
    })
  });
}
