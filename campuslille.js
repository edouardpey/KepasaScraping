
if (Meteor.isClient) {

  Meteor.call('get_info_campuslille', function (error, result) {
    if (error) {
      console.log("error", error);
    };

    console.log(result[0]);

    Session.set("tweet1", result[0]);
    Session.set("tweet2", result[1]);
  });

  Template.infolille.helpers({
    info_campuslille_1: function () {
      return Session.get("tweet1");
    }
  });
    Template.infolille.helpers({
    info_campuslille_2: function () {
      return Session.get("tweet2");
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var cheerio = Meteor.npmRequire('cheerio');

    Meteor.methods({
      get_info_campuslille: function () {
        result = Meteor.http.get("http://www.campuslille.com/index.php/l-agenda/categorie/56-manifestation");
        $ = cheerio.load(result.content);
        // var open = $('div.permalink-inner.permalink-tweet-container > div > div > p').text();
        var body = $('div > div.content > div.js-tweet-text-container > p').text();

        var manifestation = [];
        var date=[];
        var information=[];

            $('div.rs_event_details > span:nth-child(1) > a').each(function(i, elem) {
              manifestation[i] = $(this).text();
            $(' div.rs_event_details > span:nth-child(2)').each(function(u,elem){
                 date[u]=$(this).text();
              });
            information.push(manifestation[i]+ " " + date[i]);                            
            });

        return information;

      },

    })


  });
}
