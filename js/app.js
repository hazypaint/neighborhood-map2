/****** MODEL *******/
// global variables
var map;

// location data
var initialLocations = [
{name : "Basler Münster", address: "Rittergasse 3, 4051 Basel", tags: ["church", "cathedral"], lat: 47.556458, lng: 7.592443, marker: ""},
{name : "Zoo", address: "Binningerstrasse 40, 4054 Basel", tags: ["animals", "attraction", "family fun"], lat: 47.547405, lng: 7.578807, marker: ""},
{name : "Muesum of Art",  address: "St. Alban-Graben 16, 4051 Basel", tags: ["art", "museum"], lat: 47.554021, lng: 7.594268, marker: ""},
{name : "Railway Station", address: "Centralbahnstrasse 10, 4051 Basel", tags: ["getting here", "travel"], lat: 47.547571, lng: 7.589662, marker: ""},
{name : "St Paul's church", address: "Steinenring 20, 4051 Basel", tags: ["church", "cathedral"], lat: 47.551786, lng: 7.578393, marker: ""},
{name : "Museum Tinguely", address: "Paul Sacher-Anlage 2, 4002 Basel", tags: ["art", "museum"], lat: 47.559101, lng: 7.612236, marker: ""},
{name : "Theatre Basel", address: "Elisabethenstrasse 16, 4051 Basel", tags: ["art", "theatre", "shows"], lat: 47.553306, lng: 7.590082, marker: ""},
{name : "Town Hall", address: "Altstadt Grossbasel, 4051 Basel", tags: ["politics"], lat: 47.558168, lng: 7.587952, marker: ""},
{name : "Contemporary art gallery", address: "Steinenberg 7, 4051 Basel", tags: ["art", "gallery"], lat: 47.553634, lng: 7.591093, marker: ""},
];

// shows the objects including marker and contentString
// console.log(initialLocations[0].marker);

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

  // did not work since marker is still empty --> bug fix: moved google maps script into header
  for (var i = 0; i < initialLocations.length; i++) {
    // setting the markers on the map
    initialLocations[i].marker.setMap(map); 
  }

  // creating one infoWindow 
  infowindow = new google.maps.InfoWindow();
};

// Load map on page load
google.maps.event.addDomListener(window, 'load', function() {
  init();
});

/****** VIEWMODEL *******/
var ViewModel = function() {
  var self = this;  // = ViewModel{}
  var new_content;
  var image = 'img/marker-icon.png';

  // creating an array for the bullet points to display
  self.bulletPoints = ko.observableArray(initialLocations); 
  // console.log(self.bulletPoints().name);

  // creating markers for each bulletPoint
  for (var i = 0; i < self.bulletPoints().length; i++) {
    self.bulletPoints()[i].marker = new google.maps.Marker({
      position: new google.maps.LatLng(self.bulletPoints()[i].lat, self.bulletPoints()[i].lng),
      title: self.bulletPoints()[i].name,
      visible: false,
      map: map,
      icon: image
     });
    
    google.maps.event.addListener(self.bulletPoints()[i].marker, 'click', function() {
      for (var i = 0; i < self.bulletPoints().length; i++) {
        infowindow.setContent(self.bulletPoints()[i].name);
        infowindow.open(map, this);
      }
    });

  }
  

  // for (var i = 0; i < self.bulletPoints().length; i++) {
    // var contentString = '<div id="content">'+
    // '<div id="siteNotice">'+
    // '</div>'+
    // '<h1 id="firstHeading" class="firstHeading">' + self.bulletPoints()[i].name + '</h1>'+
    // '<div id="bodyContent">'+
    // '<p>The sight <b>' + self.bulletPoints()[i].name + '</b> is located at <b>' + self.bulletPoints()[i].address + '</b></p>'+
    // '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
    // 'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
    // '</p>'+
    // '</div>'+
    // '</div>';
    // console.log(new_Content);
  // }

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