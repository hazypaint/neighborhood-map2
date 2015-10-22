/****** MODEL *******/
// global variables
var map;

// location data
var initialLocations = [
    {name : "Basler Münster", address: "Rittergasse 3, 4051 Basel", tags: ["sight", "church", "cathedral"], lat: 47.556458, lng: 7.592443, marker: ""},
    {name : "Zoo", address: "Binningerstrasse 40, 4054 Basel", tags: ["animals", "attraction", "family fun"], lat: 47.547405, lng: 7.578807, marker: ""},
    {name : "Muesum of Art",  address: "St. Alban-Graben 16, 4051 Basel", tags: ["art", "museum"], lat: 47.554021, lng: 7.594268, marker: ""},
    {name : "Railway Station", address: "Centralbahnstrasse 10, 4051 Basel", tags: ["getting here", "travel"], lat: 47.547571, lng: 7.589662, marker: ""},
    {name : "St Paul's church", address: "Steinenring 20, 4051 Basel", tags: ["sight", "church", "cathedral"], lat: 47.551786, lng: 7.578393, marker: ""},
    ];
    
    // log statement shows that markers are added
    console.log(initialLocations);



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

    for (var i = 0; i < initialLocations.length; i++) {
    initialLocations[i].marker.setMap(map); 
}
};

// Load map on page load
google.maps.event.addDomListener(window, 'load', function() {
    init();
});


/****** VIEWMODEL *******/
var ViewModel = function() {
    var self = this;

    // another map marker try
    
    // looping over initialLocations.marker and adding their data to the initial list
    for (var i = 0; i < initialLocations.length; i++) {
        initialLocations[i].marker = new google.maps.Marker({
             position: new google.maps.LatLng(initialLocations[i].lat, initialLocations[i].lng),
             title: '<p>' + initialLocations[i].name + '</p>',
             visible: true,
             map: map
        });
    } 

    // To add the marker to the map, call setMap();
    // initialLocations.marker.setMap(map); 

    // creating an array for the bullet points to display
    self.bulletPoints = ko.observableArray(initialLocations);

    // declaring the user input as an observable
    self.query = ko.observable('');

    // creating a computed observable to find matches between user input and bullet point list 
    self.search = ko.computed(function(){
        return ko.utils.arrayFilter(self.bulletPoints(), function(bulletPoint){
            initialLocations[0].marker.setVisible(true);
            // console.log(self.bulletPoints().marker);   
            return bulletPoint.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;  

            });
            
        });
};

// Apply bindings
ko.applyBindings(new ViewModel());