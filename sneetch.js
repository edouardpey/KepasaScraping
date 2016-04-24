EvenementsSneetch = new Mongo.Collection('evenementsSneetch');


if (Meteor.isClient) {

  Meteor.call('getEvent_Sneetch', function (error, result) {
    if (error) {
      console.log("error", error);
    };
  });


    Template.sneetch.helpers({
    evenementsSneetch: function () {
      return EvenementsSneetch.find().fetch();
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var cheerio = Meteor.npmRequire('cheerio');

    Meteor.methods({
      getEvent_Sneetch: function () {
        result = Meteor.http.get("http://sneetch.fr/agenda/liste/");
        $ = cheerio.load(result.content);

        var eventSneetch = [];
        var date_debut = [];
        var date_fin = [];
        EvenementsSneetch.remove({});

            $('h2 > a').each(function(i, elem) {
              eventSneetch[i] = $(this).text();
              $('div.tribe-events-event-meta > div.author > div.tribe-event-schedule-details > span.tribe-event-date-start').each(function(u, elem){
                date_debut[u] = $(this).text();
              });
              $('div.tribe-events-event-meta > div.author > div.tribe-event-schedule-details > span.tribe-event-date-start').each(function(u, elem){
                date_fin[u] = $(this).text();
              });
              var row = {};
              row["eventSneetch"] = eventSneetch[i];
              row["début"] = date_debut[i];
              row["fin"] = date_fin[i];
              //row["description"] = description[i];
              EvenementsSneetch.insert(row);
            });

            eventSneetch.join(', ');

        return eventSneetch;
      },

    })


  });
}
