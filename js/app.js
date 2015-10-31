/****** MODEL *******/
// global variables
var map;

// setting location data for Basel
var initialLocations = [
{name : "Basler Münster", address: "Rittergasse 3, 4051 Basel", tags: ["church", "cathedral"], lat: 47.556458, lng: 7.592443, marker: "", contentString: ""},
{name : "Zoo", address: "Binningerstrasse 40, 4054 Basel", tags: ["animals", "attraction", "family fun"], lat: 47.547405, lng: 7.578807, marker: "", contentString: ""},
{name : "Muesum of Art",  address: "St. Alban-Graben 16, 4051 Basel", tags: ["art", "museum"], lat: 47.554021, lng: 7.594268, marker: "", contentString: ""},
{name : "Railway Station", address: "Centralbahnstrasse 10, 4051 Basel", tags: ["getting here", "travel"], lat: 47.547571, lng: 7.589662, marker: "", contentString: ""},
{name : "St Paul's church", address: "Steinenring 20, 4051 Basel", tags: ["church", "cathedral"], lat: 47.551786, lng: 7.578393, marker: "", contentString: ""},
{name : "Museum Tinguely", address: "Paul Sacher-Anlage 2, 4002 Basel", tags: ["art", "museum"], lat: 47.559101, lng: 7.612236, marker: "", contentString: ""},
{name : "Theatre Basel", address: "Elisabethenstrasse 16, 4051 Basel", tags: ["art", "theatre", "shows"], lat: 47.553306, lng: 7.590082, marker: "", contentString: ""},
{name : "Town Hall", address: "Altstadt Grossbasel, 4051 Basel", tags: ["politics"], lat: 47.558168, lng: 7.587952, marker: "", contentString: ""},
{name : "Contemporary art gallery", address: "Steinenberg 7, 4051 Basel", tags: ["art", "gallery"], lat: 47.553634, lng: 7.591093, marker: "", contentString: ""},
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

  // did not work since marker is still empty --> bug fix: moved google maps script into header
  // setting the markers on the map
  for (var i = 0; i < initialLocations.length; i++) {
    initialLocations[i].marker.setMap(map); 
  }

  // creating the infoWindow 
  infowindow = new google.maps.InfoWindow();
};

// Load map on page load
google.maps.event.addDomListener(window, 'load', function() {
  init();
});

/****** VIEWMODEL *******/

var ViewModel = function() {
  var self = this;  // = ViewModel{}
  var image = 'img/marker-icon.png';

  // creating an observable array for the bullet points to display
  self.bulletPoints = ko.observableArray(initialLocations);

  // creates a marker for each bulletPoint
  for (var i = 0; i < self.bulletPoints().length; i++) {
    // creates a marker for each bulletPoint
    self.bulletPoints()[i].marker = new google.maps.Marker({
      position: new google.maps.LatLng(self.bulletPoints()[i].lat, self.bulletPoints()[i].lng),
      title: self.bulletPoints()[i].name,
      visible: false,   // hides markers in general
      map: map,
      icon: image
     });
  };

  // infoWindow creatiion and event listener 
  for (var i = 0; i < self.bulletPoints().length; i++) {
    // creates a content string for each bulletPoint

    var newContent = self.bulletPoints()[i].name;
    var newMarker = self.bulletPoints()[i].marker;
    console.log(newMarker);
    console.log(newContent);
   
    // event listener for the infoWindow to open on click
    google.maps.event.addListener(newMarker, 'click', (function(contentCopy) {
        return function() {
          infowindow.setContent(contentCopy);
          infowindow.open(map, this);
        };
      })(newContent));
    };

  // declaring the user input as an observable
  self.query = ko.observable('');

  // creating a computed observable to find matches between user input and bullet point list 
  self.search = ko.computed(function(){
    return ko.utils.arrayFilter(self.bulletPoints(), function(bulletPoint){   
         
      // if the input matches one of the initialLocations, the matching list items and markers are returned
      if (bulletPoint.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
        bulletPoint.marker.setVisible(true);
        return bulletPoint.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
      }
      else {
        bulletPoint.marker.setVisible(false); 
      }
    });   
  });
};

// Apply bindings
ko.applyBindings(new ViewModel());


// code for infowindow to be added later
    // contentString = '<div id="content">'+
    //   '<div id="siteNotice">'+
    //   '</div>'+
    //   '<h1 id="firstHeading" class="firstHeading">' + self.bulletPoints()[i].name + '</h1>'+
    //   '<div id="bodyContent">'+
    //   '<p>The sight <b>' + self.bulletPoints()[i].name + '</b> is located at <b>' + self.bulletPoints()[i].address + '</b></p>'+
    //   // API input will go here at some point
    //   // '<p>Attribution: <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
    //   // 'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
    //   '</p>'+
    //   '</div>'+
    //   '</div>';