

if (Meteor.isClient) {

  Meteor.call('getsoiree_lille', function (error, result) {
    if (error) {
      console.log("error", error);
    };

    console.log(result[0]);

    Session.set("soireelille1", result[0]);
    Session.set("soireelille2", result[1]);
  });

    Template.soireesLille.helpers({
    soiree_lille_1: function () {
      return Session.get("soireelille1");
    }
  });
    Template.soireesLille.helpers({
    soiree_lille_2: function () {
      return Session.get("soireelille2");
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
        // var open = $('div.permalink-inner.permalink-tweet-container > div > div > p').text();
        // var body = $('div > div.content > div.js-tweet-text-container > p').text();

        var evenementLille = [];
        var lieu =[];
        var information= [];

            $('article > div > div > h2 > a').each(function(i, elem) {
              evenementLille[i] = $(this).text();
            });
           /* $('article > div > div > div:nth-child(2)').each(function(i, elem) {
              lieu[u] = $(this).text();
            });
            var row={};
            row["evenement"] = evenementLille[i];
            row["lieu"] = lieu[i];
            information.push(evenementLille[i]+ " " + lieu[i]);                            
            });

        return information*/
            evenementLille.join(', ');

          return evenementLille;

   
      },

    })




  });
}
