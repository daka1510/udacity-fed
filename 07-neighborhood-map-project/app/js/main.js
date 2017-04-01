// function that serves as the main entry point of the application and performs all necessary initializations
var initApp = function init() {
  // initialize app view
  Map.init();

  // add location entries to the Knockout ViewModel and the map
  for (var i = 0; i < LOCATIONS.length; i++) {
    var currentLocation = LOCATIONS[i];
    //Map.addLocation(currentLocation);
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

  // observable that holds the subset of locations based on the selected filter criteria
  self.filteredLocations = ko.computed(function() {
    var filter = self.categoryFilter();
    var result = self.allLocations().filter(function(locationItem) {
      // if a filter is set, only return locations that match the criteria
      return filter.length === 0 || locationItem.category === filter;
    });
    return result;
  });

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
  }
};

// function that allows to add locations that are tracked by the view model
ViewModel.prototype.addLocation = function(locationItem) {
  this.allLocations.push(locationItem);
};

var Location = function(data) {
  this.name = ko.observable(data.name);
  this.category = ko.observable(data.category);
}

// initialize view model and apply bindings
var myViewModel = new ViewModel();
myViewModel.filteredLocations.subscribe(function(arr){
  Map.deleteMarkers();
  Map.showLocations(arr);
  Map.fitBounds();
});
ko.applyBindings(myViewModel);