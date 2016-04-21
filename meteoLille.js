if (Meteor.isClient) {

  Meteor.call('getMeteo_Lille', function (error, result) {
    if (error) {
      console.log("error", error);
    };

    console.log(result[0]);

    Session.set("meteoL0", result[0]);
    Session.set("meteoL1", result[1]);
  });

  Template.meteoLille.helpers({
    meteo_Lille_0: function () {
      return Session.get("meteoL0");
    }
  });
    Template.meteoLille.helpers({
    meteo_Lille_1: function () {
      return Session.get("meteoL1");
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var cheerio = Meteor.npmRequire('cheerio');

    Meteor.methods({
      getMeteo_Lille: function () {
        result = Meteor.http.get("http://www.meteo-lille.net/previsions.php");
        $ = cheerio.load(result.content);
        // var open = $('div.permalink-inner.permalink-tweet-container > div > div > p').text();
        var jourj = $('#t15j_ensemble > div:nth-child(3) > div.t15j_infos.t15j_border_top_none > div.t15j_infos_txt > span > p').text();
        var jour1 = $('#t15j_ensemble > div:nth-child(4) > div.t15j_infos.t15j_border_top_none > div.t15j_infos_txt > span > p').text();

        var meteo = [jourj, jour1];

            /*$('#t15j_ensemble > div:nth-child(4)').each(function(i, elem) {
              meteo[i] = $(this).text();
            });

            meteo.join(', ');*/

        return meteo;
      },

    })


  });
}