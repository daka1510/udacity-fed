var Map = (function() {
  "use strict";
  // the map object
  var googleMap;
  var markers = [];

  // This function initializes the map view and centers the map on the initial location
  function init() {
    googleMap = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: CONFIG.INITIAL_LOCATION
    });
  }

  // This function adds a location marker to the map view.
  function showLocations(locationItem) {
    var marker = new google.maps.Marker({
      position: locationItem.position,
      title: locationItem.name,
      animation: google.maps.Animation.DROP,
      map: googleMap
    });
    markers.push(marker);
  }

  // This function recenters the map and makes sure that all markers fit in the view
  function fitBounds() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
      bounds.extend(markers[i].position);
    }
    googleMap.fitBounds(bounds);
  }

  return {
    init: init,
    addLocation: addLocation,
    fitBounds: fitBounds
  };
})();