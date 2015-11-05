/****** MODEL *******/
// global variables
var map;
var infowindow;

// setting location data for Basel
var initialLocations = [
{name : "Basler Münster", address: "Rittergasse 3, 4051 Basel", tags: ["church", "cathedral"], lat: 47.556458, lng: 7.592443, marker: null},
{name : "Zoo Basel", address: "Binningerstrasse 40, 4054 Basel", tags: ["animals", "attraction", "family fun"], lat: 47.547405, lng: 7.578807, marker: null},
{name : "Muesum of Art",  address: "St. Alban-Graben 16, 4051 Basel", tags: ["art", "museum"], lat: 47.554021, lng: 7.594268, marker: null},
{name : "SBB Railway Station", address: "Centralbahnstrasse 10, 4051 Basel", tags: ["getting here", "travel"], lat: 47.547571, lng: 7.589662, marker: null},
{name : "St Paul's church", address: "Steinenring 20, 4051 Basel", tags: ["church", "cathedral"], lat: 47.551786, lng: 7.578393, marker: null},
{name : "Museum Tinguely", address: "Paul Sacher-Anlage 2, 4002 Basel", tags: ["art", "museum"], lat: 47.559101, lng: 7.612236, marker: null},
{name : "Theatre Basel", address: "Elisabethenstrasse 16, 4051 Basel", tags: ["art", "theatre", "shows"], lat: 47.553306, lng: 7.590082, marker: null},
{name : "Town Hall", address: "Altstadt Grossbasel, 4051 Basel", tags: ["politics"], lat: 47.558168, lng: 7.587952, marker: "", contentString: null},
{name : "Contemporary art gallery", address: "Steinenberg 7, 4051 Basel", tags: ["art", "gallery"], lat: 47.553634, lng: 7.591093, marker: null},
];

/****** VIEW *******/
// initializing the google map
init = function() {
  // connectiong the map to index.html by Id
  var mapDiv = document.getElementById('google-map');

  // initial position of map when loading on first item of list
  var centerLatLng = new google.maps.LatLng(initialLocations[0].lat, initialLocations[0].lng);
  var mapOptions = {
    center: centerLatLng,
    zoom: 13,
    title: initialLocations[0].name
  };

  // creating the map
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

// not sure how to /if to use this yet
// var Location = function(data){
//   self.name = ko.observable(data.name);
//   self.address = ko.observable(data.address);
//   self.marker = ko.observable(data.marker);
//   self.tags = ko.observableArray(data.tags);

//   self.wikipediaArticle = ko.computed(function() {
//     return self.name + " " + self.address;
//   }, self);
// }

/****** VIEWMODEL *******/

var ViewModel = function() {
  var self = this;  // = ViewModel{}
  var imageBlack = 'img/marker-icon-black.png';
  var $wikiElem = $('#wikipedia-links');

  // creating an observable array for the bullet points to display
  self.bulletPoints = ko.observableArray(initialLocations);

  // creates a marker for each bulletPoint
  for (var i = 0; i < self.bulletPoints().length; i++) {
    self.bulletPoints()[i].marker = new google.maps.Marker({
      position: new google.maps.LatLng(self.bulletPoints()[i].lat, self.bulletPoints()[i].lng),
      title: self.bulletPoints()[i].name,
      visible: false,   // hides markers in general
      map: map,
      draggable: false,
      animation: null, 
      icon: imageBlack
     });
  };

  // setting the content for the infoWindow and event listener for markers and list items
  for (var i = 0; i < self.bulletPoints().length; i++) {

    // creates a content string for each location
    var newContent = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h2 id="firstHeading" class="firstHeading">' + self.bulletPoints()[i].name + '</h2>'+
      '<div id="bodyContent">'+
      '<p>The <b>' + self.bulletPoints()[i].name + '</b> is located at <b>' + self.bulletPoints()[i].address + '</b></p>'+
      // API input will go here at some point
      '<h4>Wikipedia Articles:</h4>' + 
      '<ul id="wikipedia-links"></ul>' +
      // '<p>More information from Wikipedia: <a href="https://en.wikipedia.org/w/index.php?title=' + self.bulletPoints()[i].name + '">'+
      // 'https://en.wikipedia.org/w/index.php?title=' + self.bulletPoints()[i].name + '</a> '+
      '</p>'+
      '</div>'+
      '</div>';

    // creating marker variables for the event listener
    var newMarker = self.bulletPoints()[i].marker;
    
    // event listener for the infoWindow to open on click
    google.maps.event.addListener(newMarker, 'click', (function(contentCopy) {
      return function() {
        infowindow.setContent(contentCopy);
        infowindow.open(map, this);
      };
    })(newContent));

    // more Google Maps events
    google.maps.event.addListener(newMarker, 'click', (function(contentCopy) {
      return function() {
        if (contentCopy.getAnimation() !== null) {
          contentCopy.setAnimation(null);
        } 
        else {
          // makes marker bounce once upon click
          contentCopy.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function(){ contentCopy.setAnimation(null); }, 750);
          $wikiElem.text("");
          console.log('load');    // loads each time marker or list item is clicked
          loadData(contentCopy);
        };
      }
    })(newMarker));

  }
    
  var loadData = function (bulletPoint){
    // for (var i = 0; i < self.bulletPoints().length; i++) {
      console.log(bulletPoint.title);
      var requestWiki  = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+ bulletPoint.title + '&format=json&callback=wikiCallback';
    // }
    console.log(requestWiki); 
    // time out error info in case wikipedia can't be loaded
    // var wikiRequestTimeout = setTimeout(function(){
    //     $wikiElem.text("Wikipedia articles could not be loaded.");
    // }, 8000);

    // Wikipedia AJAX request
    $.ajax({
      type: "GET",
      url: requestWiki,
      dataType: "jsonp",
      success: function (response) {
        var wikiArticles = response[1];

        for (var i = 0 ; i < wikiArticles.length ; i++ ) {
            var site = wikiArticles[i];
            var url = "http://en.wikipedia.org/wiki/" + wikiArticles[i];
            $wikiElem.append("<li><a href='" + url + "'target='_blank'>" + site + "</a></li>" );
            }
            // };
          // }
        // clearTimeout(wikiRequestTimeout);
      },
      error: function (e) {
        console.log('error');
          $wikiElem.text("Wikipedia articles could not be loaded.");
      }
    });

    return false;
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

  // causes info marker to act as if it's been clicked when the corresponding list item is clicked
  self.listClick = function(bulletPoint) {
    var listMarker = bulletPoint.marker;
    google.maps.event.trigger(listMarker, "click");
  };  

};

// Apply bindings
ko.applyBindings(new ViewModel());