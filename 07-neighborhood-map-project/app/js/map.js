var Map = (function() {
  "use strict";
  // the map object
  var googleMap;
  var markers = [];
  var defaultIcon;
  var hoveredIcon;
  var highlightedIcon;
  var largeInfoWindow

  // This function initializes the map view and centers the map on the initial location
  function init() {
    googleMap = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: CONFIG.INITIAL_LOCATION
    });

    defaultIcon = makeMarkerIcon('0091ff');
    hoveredIcon = makeMarkerIcon('FFFF24');
    highlightedIcon = makeMarkerIcon('FF0000');
    largeInfoWindow = new google.maps.InfoWindow();
  }


  // This function adds an array of location markers to the map view.
  function showLocations(locationItems) {

    for(var i = 0; i < locationItems.length; i++) {
      var currentItem = locationItems[i];
      var marker = new google.maps.Marker({
        position: currentItem.position,
        title: currentItem.name,
        icon: defaultIcon,
        animation: google.maps.Animation.DROP,
        locationItem: currentItem
      });

      // create an on click event to open an infowindow at each marker
      marker.addListener('click', function() {
        populateInfoWindow(this, largeInfoWindow);
      });

      marker.addListener('mouseover', function() {
        this.setIcon(hoveredIcon);
      });

      marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
      });

      markers.push(marker);
    }

    // show on map
    setMapOnAll(googleMap);
  }

  // This function (adapted from the course material) populates the infowindow when the marker is clicked.
  function populateInfoWindow(marker, infoWindow) {
    // make sure the infowindow is not already opened on this marker
    if(infoWindow.marker != marker) {
      // highlight marker for 1.5s (when it is selected via the list view / clicked directly)
      marker.setIcon(highlightedIcon);
      setTimeout(function(){ marker.setIcon(defaultIcon); }, 1500);
      infoWindow.marker = marker;
      var foursquareId = marker.get("locationItem").foursquare.id;
      infoWindow.setContent("loading data from foursquare ...");
      // retrieve data from foursquare (asynchronously)
      Promise.all([Foursquare.getVenuePhotos(foursquareId, "150x150"), Foursquare.getVenueHours(foursquareId)])
        .then(data => {
          // all calls succeeded
          myViewModel.foursquareVenuePhotos(data[0]);
          myViewModel.foursquareVenueHours(data[1]);
          // knockout does not provide support for binding dynamically injected HTML fragments
          // use a slightly different approach here: copy template that was bound before and was updated in response
          // to the above view model changes
          infoWindow.setContent($("#infowindow-template").html());
        })
        .catch(error => {
          // at least one call failed
          infoWindow.setContent("failed to load data from foursquare: " + error.statusText);
        });

      // make sure the marker property is cleared when the window is closed
      infoWindow.addListener('closeclick', function() {
        infoWindow.marker = null;
        marker.setIcon(defaultIcon);
      });

      infoWindow.open(googleMap, marker);

      // makes sure the infowindow is displayed in the visible area
      recenter(marker);
      googleMap.panBy(0,-200);
    }
  }

  // This function removes the markers from the maps and clears the markers array.
  function deleteMarkers() {
    clearMarkers();
    markers = [];
  }

  // This function removes the markers from the map, but keeps them in the markers array.
  function clearMarkers() {
    setMapOnAll(null);
  }


  // This function sets the map on all markers in the array.
  function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
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

  // This function takes in a COLOR, and then creates a new marker icon of that color.
  // The icon will be 21 px wide by 34 high, have an origin of 0,0
  // and be anchored at 10,34.
  // (copied from course material)
  function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21, 34));
    return markerImage;
  }

  // This function recenters the map based on the provided location.
  function recenter(locationItem) {
    googleMap.setCenter(locationItem.position);
    // googleMap.setZoom(15);
  }

  function showInfoWindow(locationItem) {
    // find matching location
    var idx = markers.findIndex(function(marker){
      return marker.title == locationItem.name;
    });

    if(idx >= 0) {
      populateInfoWindow(markers[idx], largeInfoWindow);
    }
  }

  return {
    init: init,
    showLocations: showLocations,
    fitBounds: fitBounds,
    deleteMarkers: deleteMarkers,
    recenter: recenter,
    showInfoWindow: showInfoWindow
  };
})();