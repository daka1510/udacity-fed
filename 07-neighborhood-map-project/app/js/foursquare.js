var Foursquare = (function() {
  const CLIENT_ID = "TYGMNFUJEMDGQ0TBOELKSDYCEWGZUVUUZWBSYGSAGRZDO2OF";
  const CLIENT_SECRET = "41X4YIXVVNZN3GDVJEF0VPVQMKQBMZM0FPHI5UNCGXNHMUAF"
  const SUPPORTED_VERSION = "20170409"

  // get opening hours for a venue based on its foursquare id
  function getVenueHours(id, successCb) {
    _getVenueDetails('https://api.foursquare.com/v2/venues/' + id + '/hours', 1, function(data) {
      var openingHours = [];
      if(data.response.hours && data.response.hours.timeframes) {
        for(var i = 0; i < data.response.hours.timeframes.length; i++) {
          var timeframe = data.response.hours.timeframes[i];
          for(var j = 0; j < timeframe.days.length; j++) {
            openingHours.push(_getDayString(timeframe.days[j]) + ": " + _openingHourString(timeframe.open));
          }
        }
      }
      successCb(openingHours);
    });
  }

  // returns an array of photo urls
  function getVenuePhotos(id, sizeString, successCb) {
    _getVenueDetails('https://api.foursquare.com/v2/venues/' + id + '/photos', 5, function(data){
      var urls = [];
      if(data.response.photos.count > 0) {
        for(var i = 0; i < data.response.photos.items.length; i++){
          var item = data.response.photos.items[i];
          urls.push(item.prefix + sizeString + item.suffix);
        }
      }
      successCb(urls);
    });
  }

  function _openingHourString(arr) {
    var result = "";
    for(var i = 0; i < arr.length; i++) {
      var current = arr[i];
      result = result + "(" + current.start + ", " + current.end + ") ";
    }
    return result;
  }

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

  function _getVenueDetails(fourSquarUrl, limit, successCb){
    console.log("getting venue details: " + fourSquarUrl);
    $.ajax({
      url: fourSquarUrl,
      type: 'GET',
      data: {
        'client_id': CLIENT_ID,
        'client_secret' : CLIENT_SECRET,
        'v': SUPPORTED_VERSION,
        'limit' : limit
      },
      dataType: 'json',
      success: function (data) {
          successCb(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
          window.alert("Cannot retrieve data from Foursquare: " + textStatus);
      }
    });
  }


  return {
    getVenueHours: getVenueHours,
    getVenuePhotos: getVenuePhotos
  };
})();