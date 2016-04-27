GrevesLille = new Mongo.Collection('grevesLille');


if (Meteor.isClient) {

  Meteor.call('getgreve', function (error, result) {
    if (error) {
      console.log("error", error);
    };
  });


  Template.grevesLille.helpers({
    grevesLille : function () {
      return GrevesLille.find().fetch();
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var cheerio = Meteor.npmRequire('cheerio');

    Meteor.methods({    
      getgreve: function () {
       
        result = Meteor.http.get("http://www.cestlagreve.fr/recherche-greve/?lieu=106&secteur=0");
        $ = cheerio.load(result.content);


        var greve = [];
        var date = [];
        GrevesLille.remove({});

          $('#oncoming_events > ul > li > a').each(function(i, elem) {
              greve[i] = $(this).text();
              $('#oncoming_events > ul > li > span').each(function(i, elem) {
              date[i] = $(this).text();
            });

          var row = {};
          row["greve"] = greve [i];
          row["date"] = date [i];
          GrevesLille.insert(row);
          });

        return greve;
      }
    })
  });
}