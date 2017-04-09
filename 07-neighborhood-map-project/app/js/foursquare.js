var Foursquare = (function() {
  const CLIENT_ID = "TYGMNFUJEMDGQ0TBOELKSDYCEWGZUVUUZWBSYGSAGRZDO2OF";
  const CLIENT_SECRET = "41X4YIXVVNZN3GDVJEF0VPVQMKQBMZM0FPHI5UNCGXNHMUAF"
  const SUPPORTED_VERSION = "20170409"

  // get opening hours for a venue based on its foursquare id
  function getVenueHours(id, successCb, errorCb) {
    console.log("getting opening hours for venue with id" + id);
     $.ajax({
        url: 'https://api.foursquare.com/v2/venues/' + id + '/hours',
        type: 'GET',
        data: {
          'client_id': CLIENT_ID,
          'client_secret' : CLIENT_SECRET,
          'v': SUPPORTED_VERSION
        },
        dataType: 'json',
        success: function (data) {
            console.info(data);
            successCb(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("an error occured" + textStatus);
        }
    });
    return "bla";
  }

  return {
    getVenueHours: getVenueHours
  };
})();