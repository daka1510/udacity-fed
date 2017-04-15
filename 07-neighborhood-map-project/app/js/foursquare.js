var Foursquare = (function() {
  "use strict";

  // Function that gets the opening hours for a venue based on a provided foursquare id.
  // Returns a promise that resolves to an array of opening hour objects. Each of this objects contains a "day", "from", and "to" property.
  function getVenueHours(id) {
    return _getVenueDetails('https://api.foursquare.com/v2/venues/' + id + '/hours', 1)
      .then(data => {
        var openingHours = [];
        if(data.response.hours && data.response.hours.timeframes) {
          for(var i = 0; i < data.response.hours.timeframes.length; i++) {
            var timeframe = data.response.hours.timeframes[i];
            for(var j = 0; j < timeframe.days.length; j++) {
              // e.g. 1700
              var fromUnformatted = timeframe.open[0].start;
              // e.g. 1800 or +0200 (the optional + indicates the next day and is not relevant for this use-case)
              var toUnformatted = timeframe.open[0].end.startsWith("+") ? timeframe.open[0].end.substr(1) : timeframe.open[0].end;
              // assemble result object
              openingHours.push({
                "day" : _getDayString(timeframe.days[j]),
                // e.g. 17:00
                "from" : [fromUnformatted.slice(0, 2), ":", fromUnformatted.slice(2)].join(''),
                // e.g. 02:00
                "to" : [toUnformatted.slice(0, 2), ":", toUnformatted.slice(2)].join('')
              });
            }
          }
        }
        return openingHours;
      });
  }

  // Function that gets the photos for a venue based on a provided foursquare id.
  // Returns a promise that resolves to an array of image URLs.
  // The size string allows to specify the size of the requested image (e.g. 300x400)
  function getVenuePhotos(id, sizeString) {
    return _getVenueDetails('https://api.foursquare.com/v2/venues/' + id + '/photos', 1)
      .then(data => {
        var urls = [];
        if(data.response.photos.count > 0) {
          for(var i = 0; i < data.response.photos.items.length; i++){
            var item = data.response.photos.items[i];
            urls.push(item.prefix + sizeString + item.suffix);
          }
        }
        return urls;
      });
  }

  // Function that resolves an id to a string representation of a day (1 = Monday, 2 = Tuesday, ...)
  function _getDayString(id){
    var day;
    switch(id) {
      case 1:
        day = "Monday";
        break;
      case 2:
        day = "Tuesday";
        break;
      case 3:
        day = "Wednesday";
        break;
      case 4:
        day = "Thursday";
        break;
      case 5:
        day = "Friday";
        break;
      case 6:
        day = "Saturday";
        break;
      case 7:
        day = "Sunday";
        break;
      default:
        day = "unknown day";
    }
    return day;
  }

  // Function that retrieves details about a venue via the foursquare API. Returns a promise.
  function _getVenueDetails(fourSquarUrl, limit) {
    return new Promise(function (resolve, reject) {
      $.ajax({
        url: fourSquarUrl,
        type: 'GET',
        data: {
          'client_id': CONFIG.FOURSQUARE_CLIENT_ID,
          'client_secret' : CONFIG.FOURSQURE_CLIENT_SECRET,
          'v': CONFIG.FOURSQUARE_SUPPORTED_VERSION,
          'limit' : limit
        },
        dataType: 'json',
        success: resolve,
        error: reject,
        timeout: 5000
      });
    });
  }

  return {
    getVenueHours: getVenueHours,
    getVenuePhotos: getVenuePhotos
  };
})();