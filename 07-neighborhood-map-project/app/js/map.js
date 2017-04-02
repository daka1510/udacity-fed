var Map = (function() {
  "use strict";
  // the map object
  var googleMap;
  var markers = [];
  var defaultIcon;
  var highlightedIcon;
  var hoveredIcon;



  // This function initializes the map view and centers the map on the initial location
  function init() {
    googleMap = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: CONFIG.INITIAL_LOCATION
    });

    defaultIcon = makeMarkerIcon('0091ff');
    highlightedIcon = makeMarkerIcon('FFFF24');
    hoveredIcon = makeMarkerIcon('FFFE24');
    largeInfoWindow = new google.maps.InfoWindow();
  }

  var largeInfoWindow

  // This function adds an array of location markers to the map view.
  function showLocations(locationItems) {

    for(var i = 0; i < locationItems.length; i++) {
      var currentItem = locationItems[i];
      var marker = new google.maps.Marker({
        position: currentItem.position,
        title: currentItem.name,
        icon: defaultIcon,
        animation: google.maps.Animation.DROP,
      });

      // create an on click event to open an infowindow at each marker
      marker.addListener('click', function() {
        populateInfoWindow(this, largeInfoWindow);
      });

      marker.addListener('mouseover', function() {
        if(this.icon.url === defaultIcon.url){
          this.setIcon(hoveredIcon);
        }
      });

      marker.addListener('mouseout', function() {
        if(this.icon.url == hoveredIcon.url){
          this.setIcon(defaultIcon);
        }
      })

      markers.push(marker);
    }
    // show on map
    setMapOnAll(googleMap);
  }

  // This function (adapted from the course material) populates the infowindow when the marker is clicked.
  function populateInfoWindow(marker, infoWindow) {
    // check to make sure the infowindow is not already opened on this marker
    if(infoWindow.marker != marker) {
      marker.icon = highlightedIcon;
      infoWindow.marker = marker;
      infoWindow.setContent('<div>Hello World' + marker.title + '</div>');
      infoWindow.open(googleMap, marker);

      // make sure the marker property is cleared when the window is closed
      infoWindow.addListener('closeclick', function() {
        infoWindow.marker = null;
        marker.setIcon(defaultIcon);
      });
    }
  }

  // Deletes all markers in the array by removing references to them.
  function deleteMarkers() {
    clearMarkers();
    markers = [];
  }

  // Removes the markers from the map, but keeps them in the array.
  function clearMarkers() {
    setMapOnAll(null);
  }


  // Sets the map on all markers in the array.
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

  // -- copied from course material --
  // This function takes in a COLOR, and then creates a new marker icon of that color.
  // The icon will be 21 px wide by 34 high, have an origin of 0,0
  // and be anchored at 10,34.
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

  function recenter(locationItem) {
    googleMap.setCenter(locationItem.position);
    googleMap.setZoom(8);
  }

  function showInfoWindow(locationItem){
    console.log("showing info window for " + JSON.stringify(locationItem));
    var idx = markers.findIndex(function(marker){
      return marker.title === locationItem.name;
    })
    if(idx > 0) {
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