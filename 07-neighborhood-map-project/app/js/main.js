// This function serves as the main entry point of the application and performs all necessary initializations.
var initApp = function init() {
  // initialize app view
  Map.init();

  // add location entries to the Knockout ViewModel and the map
  for (var i = 0; i < LOCATIONS.length; i++) {
    var currentLocation = LOCATIONS[i];
    myViewModel.addLocation(currentLocation);
  };

  // recenter map
  Map.fitBounds();
}

var ViewModel = function() {
  var self = this;

  // observable that holds all known locations
  self.allLocations = ko.observableArray([]);

  // observable that holds the category filter value
  self.categoryFilter = ko.observable("");

  // foursquare image urls
  self.foursquareVenuePhotos = ko.observableArray([]);

  // foursquare venue hours
  self.foursquareVenueHours = ko.observableArray([]);

  // observable that holds the subset of locations based on the selected filter criteria
  self.filteredLocations = ko.computed(function() {
    var filter = self.categoryFilter();
    var result = self.allLocations().filter(function(locationItem) {
      // if a filter is set, only return locations that match the criteria
      return filter.length === 0 || locationItem.category === filter;
    });
    return result;
  });

  // observable that holds an array of unique categories
  self.uniqueCategories = ko.computed(function() {
    // map locations to an array of categories
    var categories = self.allLocations().map(function(location) {
      return location.category;
    });

    // make sure the resulting array only contains unique categories
    return [...new Set(categories)]; // the spread operator (...) transforms set back into an array
  });

  // function that sets a location filter
  self.filterByCategory = function(locationItem) {
    self.categoryFilter(locationItem);
  };

  // function that resets the filter criteria
  self.resetFilter = function() {
    self.categoryFilter("");
  };

  self.selectItem = function(locationItem) {
    Map.recenter(locationItem);
    Map.showInfoWindow(locationItem);
  };
};

// function that allows to add locations that are tracked by the view model
ViewModel.prototype.addLocation = function(locationItem) {
  this.allLocations.push(locationItem);
};

// initialize view model and apply bindings
var myViewModel = new ViewModel();
myViewModel.filteredLocations.subscribe(function(arr){
  Map.deleteMarkers();
  Map.showLocations(arr);
  Map.fitBounds();
});
ko.applyBindings(myViewModel);
