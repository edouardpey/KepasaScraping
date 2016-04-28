GrevesParis = new Mongo.Collection('grevesParis');


if (Meteor.isClient) {

  Meteor.call('getgreve_Paris', function (error, result) {
    if (error) {
      console.log("error", error);
    };
  });


  Template.grevesParis.helpers({
    grevesParis : function () {
      return GrevesParis.find().fetch();
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var cheerio = Meteor.npmRequire('cheerio');

    Meteor.methods({    
      getgreve_Paris: function () {
       
        result = Meteor.http.get("http://www.cestlagreve.fr/recherche-greve/?lieu=23&secteur=0");
        $ = cheerio.load(result.content);


        var greve = [];
        var date = [];
        GrevesParis.remove({});

          $('#oncoming_events > ul > li > a').each(function(i, elem) {
              greve[i] = $(this).text();
              $('#oncoming_events > ul > li > span').each(function(i, elem) {
              date[i] = $(this).text();
            });

          var row = {};
          row["greve"] = greve [i];
          row["date"] = date [i];
          GrevesParis.insert(row);
          });

        return greve;
      }
    })
  });
}