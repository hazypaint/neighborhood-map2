/****** MODEL *******/
// global variables
var map;

// location data
var initialLocations = [
    {name : "Basler Münster", address: "Rittergasse 3, 4051 Basel", tags: ["sight", "church", "cathedral"], lat: 47.556458, lng: 7.592443, marker: "", contentString: ""},
    {name : "Zoo", address: "Binningerstrasse 40, 4054 Basel", tags: ["animals", "attraction", "family fun"], lat: 47.547405, lng: 7.578807, marker: "", contentString: ""},
    {name : "Muesum of Art",  address: "St. Alban-Graben 16, 4051 Basel", tags: ["art", "museum"], lat: 47.554021, lng: 7.594268, marker: "", contentString: ""},
    {name : "Railway Station", address: "Centralbahnstrasse 10, 4051 Basel", tags: ["getting here", "travel"], lat: 47.547571, lng: 7.589662, marker: "", contentString: ""},
    {name : "St Paul's church", address: "Steinenring 20, 4051 Basel", tags: ["sight", "church", "cathedral"], lat: 47.551786, lng: 7.578393, marker: "", contentString: ""},
    ];

// shows the objects including marker and contentString
console.log(initialLocations[0]);

// not sure why this logs empty since the statement above logs correct data incl. marker data
console.log("why empty: " + initialLocations[0].marker);


/****** VIEW *******/
// initializing the google map
init = function() {
    var mapDiv = document.getElementById('google-map');
    var infoWindow;

    // initial position of map when loading on first item of list
    var centerLatLng = new google.maps.LatLng(initialLocations[0].lat, initialLocations[0].lng);
    var mapOptions = {
        center: centerLatLng,
        zoom: 13,
        title: initialLocations[0].name
    };
    map = new google.maps.Map(mapDiv, mapOptions);

    // creating a content string for each infoWindow
    for (var i = 0; i < initialLocations.length; i++) {
        initialLocations[i].contentString = '<div id="content">'+
          '<div id="siteNotice">'+
          '</div>'+
          '<h1 id="firstHeading" class="firstHeading">' + initialLocations[i].name + '</h1>'+
          '<div id="bodyContent">'+
          '<p>The sight <b>' + initialLocations[i].name + '</b> is located at <b>' + initialLocations[i].address + '</b></p>'+
          '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
          'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
          '</p>'+
          '</div>'+
          '</div>';
      }

    // did not work since marker is still empty --> bug fix: moved google maps script into header
    for (var i = 0; i < initialLocations.length; i++) {
        // setting the markers on the map
        initialLocations[i].marker.setMap(map); 

        // creating an infoWindow for each location
        infoWindow = new google.maps.InfoWindow({
            content: initialLocations[i].contentString
        });

        // adding the event listener for each window
        google.maps.event.addListener(initialLocations[i].marker, 'click', function() {
            console.log(initialLocations.marker); // is undefined
            var currentMarker = initialLocations.marker; // is undefined -- WHY?
            infoWindow.open(map, currentMarker);
        });
    }
};

// Load map on page load
google.maps.event.addDomListener(window, 'load', function() {
    init();
});

/****** VIEWMODEL *******/
var ViewModel = function() {
    var self = this;  // = ViewModel{}

    // creating an array for the bullet points to display
    self.bulletPoints = ko.observableArray(initialLocations);
    // console.log(self.bulletPoints());  

    // creating markers for each bulletPoint
    for (var i = 0; i < self.bulletPoints().length; i++) {
        self.bulletPoints()[i].marker = new google.maps.Marker({
             position: new google.maps.LatLng(self.bulletPoints()[i].lat, self.bulletPoints()[i].lng),
             title: self.bulletPoints()[i].name,
             visible: false,
             map: map
        });
    };

    // declaring the user input as an observable
    self.query = ko.observable('');

    // creating a computed observable to find matches between user input and bullet point list 
    self.search = ko.computed(function(){

        return ko.utils.arrayFilter(self.bulletPoints(), function(bulletPoint){   
            // LC defines lowerCase name 
            var LC = bulletPoint.name.toLowerCase();
            
            // if the input matches one of the initialLocations, the matching list items and markers are returned
            if (LC.indexOf(self.query().toLowerCase()) >= 0) {
                bulletPoint.marker.setVisible(true);
                return LC.indexOf(self.query().toLowerCase()) >= 0;
            }
            else {
                bulletPoint.marker.setVisible(false); 
            }
        });   
    });
};

// Apply bindings
ko.applyBindings(new ViewModel());