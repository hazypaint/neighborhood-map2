/****** MODEL *******/
// global variables
    var map;

// Default infoWindow
var infoWindow = new google.maps.InfoWindow({
  content: '<div><h4 id="location-name"></h4><p id="location-address"></p></div>'
});

// location data
var initialLocations = [
    {name : "Basler Münster", address: "Rittergasse 3, 4051 Basel", tags: ["sight", "church", "cathedral"], lat: 47.556458, lng: 7.592443},
    {name : "Zoo", address: "Binningerstrasse 40, 4054 Basel", tags: ["animals", "attraction", "family fun"], lat: 47.547405, lng: 7.578807},
    {name : "Muesum of Art",  address: "St. Alban-Graben 16, 4051 Basel", tags: ["art", "museum"], lat: 47.554021, lng: 7.594268},
    {name : "Railway Station", address: "Centralbahnstrasse 10, 4051 Basel", tags: ["getting here", "travel"], lat: 47.547571, lng: 7.589662},
    {name : "St Paul's church", address: "Steinenring 20, 4051 Basel", tags: ["sight", "church", "cathedral"], lat: 47.551786, lng: 7.578393},
    ];

/****** VIEWMODEL *******/
var ViewModel = function() {
    var self = this;
    self.locationList = ko.observableArray([]);

    // initializing the google maps
    self.init= function() {
        var mapDiv = document.getElementById('google-map');

        // initial position of map when loading on first item of list
        var centerLatLng = new google.maps.LatLng(initialLocations[0].lat, initialLocations[0].lng);
        var mapOptions = {
            center: centerLatLng,
            zoom: 13,
            title: initialLocations[0].name
        };
        map = new google.maps.Map(mapDiv, mapOptions);
    };

    // Building an array of locations
    self.createLocations = function() {
        // this.locationList = ko.observableArray([]);

        initialLocations.forEach(function(locationItem) {
            self.locationList.push( new Location(locationItem) );
        });

        // self.currentLocation = ko.observable(this.locationList()[0]);

        // this.setLocation = function(clickedLocation) {
        // self.currentLocation(clickedLocation);
    // }
    };

    self.setMarkerClick = function() {
    self.locationList().forEach(function(location) {
      google.maps.event.addListener(location.marker(), 'click', function() {
        self.setLocationClick(location);
      });
    });
    };

    // Function to handle clicking on a brewery (either in list or marker)
    self.setLocationClick = function(location) {
    // Set the content of the infoWindow
    var contentString = '<div><h4 id="location-name"></h4><p id="location-address"></p></div>';
    infoWindow.setContent(contentString);
    };
    
    // Open the infoWindow at the marker location
    infoWindow.open(map, location.marker);

/*  map loads when page is loaded; init, createLocations & setMarkerCLickFunction are called
    Had to remove callback in index.html, otherwise it did not work*/
    google.maps.event.addDomListener(window, 'load', function() {
        self.init();
        self.createLocations();
        self.setMarkerClick();
    });
};

// setting the Location variable and ko.observables
// this should be in the MODEL, but code won't execute when moved up
var Location = function(data) {
    this.name = ko.observable(data.name);
    this.address = ko.observable(data.address);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.tags = ko.observableArray(data.tags);
    this.marker = ko.observable(marker);

    // Marker for location
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.lng),
        map: map,
        title: initialLocations.name,
        visible: true
    });
};

// Apply bindings
ko.applyBindings(new ViewModel());