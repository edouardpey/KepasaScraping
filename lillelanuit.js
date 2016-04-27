LilleLaNuit = new Mongo.Collection('lillelanuitsoiree');

if (Meteor.isClient) {

  Meteor.call('getsoiree_lille', function (error, result) {
    if (error) {
      console.log("error", error);
    };

    
  });

 
    Template.soireesLille.helpers({
    tablelillelanuit: function () {
      return LilleLaNuit.find().fetch();
    }
  });
}


if (Meteor.isServer) {
  Meteor.startup(function () {
    var cheerio = Meteor.npmRequire('cheerio');

    Meteor.methods({
      getsoiree_lille: function () {
        result = Meteor.http.get("http://www.lillelanuit.com/agenda/soirees/");
        $ = cheerio.load(result.content);
        
        var evenementLille= [];
        var lieu = [];
        LilleLaNuit.remove({});

        $('article > div > div > h2 > a').each(function(i, elem) {
              evenementLille[i] = $(this).text();
              $('article > div > div > div:nth-child(2) ').each(function(u, elem){
                lieu[u] = $(this).text();
              });
              

              var row = {};
              row["eventLille"] = evenementLille[i];
              row["lieu"] = lieu[i];
              
              LilleLaNuit.insert(row);
            });

        evenementLille.join(', ');

        return evenementLille;

   
      },

    })




  });
}
