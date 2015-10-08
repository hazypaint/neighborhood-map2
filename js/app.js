/****** MODEL *******/
// global variables
    var map;

// location data
var initialLocations = [
    {name : "Basler Münster", address: "Rittergasse 3, 4051 Basel", tags: ["sight", "church", "cathedral"], lat: 47.556458, lng: 7.592443},
    {name : "Zoo", address: "Binningerstrasse 40, 4054 Basel", tags: ["animals", "attraction", "family fun"], lat: 47.547405, lng: 7.578807},
    {name : "Muesum of Art",  address: "St. Alban-Graben 16, 4051 Basel", tags: ["art", "museum"], lat: 47.554021, lng: 7.594268},
    {name : "Railway Station", address: "Centralbahnstrasse 10, 4051 Basel", tags: ["getting here", "travel"], lat: 47.547571, lng: 7.589662},
    {name : "St Paul's church", address: "Steinenring 20, 4051 Basel", tags: ["sight", "church", "cathedral"], lat: 47.551786, lng: 7.578393},
    ];

/****** VIEW *******/
// initializing the google map
init = function() {
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

// Load map on page load
google.maps.event.addDomListener(window, 'load', function() {
    init();
});

/****** VIEWMODEL *******/
var ViewModel = function() {
    var self = this;
    self.locationList = ko.observableArray([]);

    // Creates an item for each location and pushes them to observable array
    initialLocations.forEach(function(locationItem){
        self.locationList.push( new Location(locationItem));
    });

    self.currentLocation = ko.observable(this.locationList()[0]);

    // Creats markers for each location
    self.setMarker = function(clickedLocation) {
        var len = self.locationList().length;
    // // Loop through each location in the location list and set a marker
        for (var i = 0; i < len; i++) {
            self.locationList()[i].marker().setMap(map);
            // will not work with currentLocation
            // self.currentLocation()[i].marker().setMap(map);
            console.log('clicked Location');
        };
    };
};

// setting the Location variable and ko.observables
var Location = function(data) {
    this.name = ko.observable(data.name);
    this.address = ko.observable(data.address);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.tags = ko.observableArray(data.tags);

    // Marker for location
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.lng),
        map: map,
        title: initialLocations.name,
        visible: true
    });

    // Set the marker as a ko observable
    this.marker = ko.observable(marker);
    // console.log(marker);
};

// Apply bindings
ko.applyBindings(new ViewModel());