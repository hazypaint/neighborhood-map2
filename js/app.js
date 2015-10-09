/****** MODEL *******/
// global variables
    var map;

// location data
initialLocations = [
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
    var infowindow = new google.maps.InfoWindow({
        content: '<div><h4 id="brewery-name"></h4><p id="brewery-address"></p></div>'
      });
    self.locationList = ko.observableArray([]);
    // self.locationList = ko.observable();
    self.filter = ko.observable('');
    self.search = ko.observable('');

    // self.filteredLocations = ko.computed(function() {
    //     var filter = self.places_search_text().toLowerCase();
    //     var output = null;

    //     output = ko.utils.arrayFilter(self.locationList(), filterer());

    //     return output;

    //     function filterer(location) {
    //         var pass = false;
    //         location.keywords.forEach(function(name) {
    //             if (keyword.toLowerCase().indexOf(filter) > 0) {
    //                 pass = true;
    //             }
    //         });
    //         return pass;
    //     }
    // });
    // changes text input to lower case
    // self.searchText = ko.computed(function() {
    //     return self.places_search_text().toLowerCase();
    // }, self);

    // self.filter = function() {
    //     if (self.searchText == 'h') {
    //         console.log('true');
    //     }
    //     else {console.log('false');}
    // }
    // self.filter();

    
    // Creates an item for each location and pushes them to observable array
    initialLocations.forEach(function(locationItem){
        self.locationList.push( new Location(locationItem));
    });

    self.currentLocation = ko.observable(this.locationList()[0]);

    // Creats markers for each location and sets them on map on click event on name
    self.setMarker = function(clickedLocation) {
        clickedLocation.marker().setMap(map);
    };

    self.markerClick = function(location) {
    var contentString = '<div><h4 id="brewery-name">' + initialLocations.name() + '</h4>' +
                      '<h5 id="brewery-address">' + initialLocations.address() + '</h5>' +
                      '</div>';
        infoWindow.setContent(contentString);

        infowindow.open(map, initialLocations.marker);
        console.log('window');
      
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