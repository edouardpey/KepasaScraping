if (Meteor.isClient) {

  Meteor.call('getSoiree', function (error, result) {
    if (error) {
      console.log("error", error);
    };

    console.log(result[0]);

    Session.set("soiree1", result[0]);
    Session.set("soiree2", result[1]);
  });
    

  Template.soirees.helpers({
    soiree_1: function () {
      return Session.get("soiree1");
    }
  });
    Template.soirees.helpers({
    soiree_2: function () {
      return Session.get("soiree2");
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var cheerio = Meteor.npmRequire('cheerio');

    Meteor.methods({
      getSoiree: function () {
        result = Meteor.http.get("https://www.residentadvisor.net/");
        $ = cheerio.load(result.content);
        // var open = $('div.permalink-inner.permalink-tweet-container > div > div > p').text();
        var body = $('div > div.content > div.js-tweet-text-container > p').text();

        var soirees = [];

            $('#events > div.strip.small > ul > li > article > .copy').each(function(i, elem) {
              soirees[i] = $(this).text();
            });

            soirees.join(', ');

        return soirees;
      },
    })
  });
}