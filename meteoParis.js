if (Meteor.isClient) {

  Meteor.call('getMeteo_Paris', function (error, result) {
    if (error) {
      console.log("error", error);
    };

    console.log(result[0]);

    Session.set("meteo0", result[0]);
    Session.set("meteo1", result[1]);
  });

  Template.meteo.helpers({
    meteo_0: function () {
      return Session.get("meteo0");
    }
  });
    Template.meteo.helpers({
    meteo_1: function () {
      return Session.get("meteo1");
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var cheerio = Meteor.npmRequire('cheerio');

    Meteor.methods({
      getMeteo_Paris: function () {
        result = Meteor.http.get("http://www.meteo-paris.com/ile-de-france/previsions.php");
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
