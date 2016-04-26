
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
        
        var evenementLille1 = $('#event-331283 > article > div > div > h2 > a').text();
        var evenementLille2 = $('#event-331541 > article > div > div > h2 > a').text();
        var lieu1 = $('#event-331283 > article > div > div > div:nth-child(2) ').text();
        var lieu2 = $('#event-331541 > article > div > div > div:nth-child(2) ').text();
        
        var information =[];
        information.push(evenementLille1 +". Où? "+ lieu1, evenementLille2+". Où? "+lieu2);

        return information;

   
      },

    })




  });
}
