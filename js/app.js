/****** MODEL *******/
// global variables
var map;
var InfoWindow;

// setting location data for Basel
var initialLocations = [
{name : "Basel Minster", address: "Rittergasse 3, 4051 Basel", tags: ["church", "cathedral"], lat: 47.556458, lng: 7.592443, marker: null},
{name : "Zoo Basel", address: "Binningerstrasse 40, 4054 Basel", tags: ["animals", "attraction", "family fun"], lat: 47.547405, lng: 7.578807, marker: null},
{name : "Kunstmuseum Basel",  address: "St. Alban-Graben 16, 4051 Basel", tags: ["art", "museum"], lat: 47.554021, lng: 7.594268, marker: null, requestW: null},
{name : "Basel SBB Railway Station", address: "Centralbahnstrasse 10, 4051 Basel", tags: ["getting here", "travel"], lat: 47.547571, lng: 7.589662, marker: null},
{name : "EuroAirport Basel Mulhouse Freiburg", address: "68304 Saint-Louis, France", tags: ["getting here", "travel"], lat: 47.598181, lng: 7.525497, marker: null},
{name : "Museum Tinguely", address: "Paul Sacher-Anlage 2, 4002 Basel", tags: ["art", "museum"], lat: 47.559101, lng: 7.612236, marker: null, requestW: null},
{name : "Theatre Basel", address: "Elisabethenstrasse 16, 4051 Basel", tags: ["art", "theatre", "shows"], lat: 47.553306, lng: 7.590082, marker: null},
{name : "Dollhouse Museum", address: "Steinenvorstadt 1, 4051 Basel", tags: ["art", "museum", "family fun"], lat: 47.553882, lng: 7.589206, marker: null},
{name : "Basel Paper Mill", address: "St. Alban-Tal 37, 4052 Basel", tags: ["museum"], lat: 47.554668, lng: 7.603095, marker: null},
];

// initializing the map
function initialize() {
  /* Bindings are applied here so that the google map has been 
   *loaded when the ViewModel is called */
   
  ko.applyBindings(new ViewModel());
  // connecting the map to index.html by Id
  map = document.getElementById('google-map');

  // initial position of map when loading on first item of list
  var centerLatLng = new google.maps.LatLng(initialLocations[0].lat, initialLocations[0].lng);
  var mapOptions = {
    center: centerLatLng,
    zoom: 13,
    title: initialLocations[0].name
  };

  // creating the map
  map = new google.maps.Map(map, mapOptions);

  // setting the markers on the map
  for (var i = 0; i < initialLocations.length; i++) {
    initialLocations[i].marker.setMap(map); 
  }

  // creating the infoWindow 
  InfoWindow = new google.maps.InfoWindow({
    // setting max width of infowindow to 250px
    maxWidth: 250
  });
};

/****** VIEWMODEL *******/

var ViewModel = function() {
  // console.log('ViewModel');
  var self = this;  // = ViewModel{}
  var imageBlack = 'img/marker-icon-black.png';

  // creating an observable array for the bullet points to display
  self.bulletPoints = ko.observableArray(initialLocations);
  
  self.bulletPoints().forEach(function(bulletPoint) {
    bulletPoint.requestW = ko.observableArray();
  });

  // creates a marker for each bulletPoint
  for (var i = 0; i < self.bulletPoints().length; i++) {
    self.bulletPoints()[i].marker = new google.maps.Marker({
      position: new google.maps.LatLng(self.bulletPoints()[i].lat, self.bulletPoints()[i].lng),
      title: self.bulletPoints()[i].name,
      visible: false,   // hides markers in general
      map: map,
      draggable: false,
      animation: null,    // needs to be set in order to make animation on click work
      icon: imageBlack
     });
  };

  // setting the content for the infoWindow and event listener for markers and list items
  for (var i = 0; i < self.bulletPoints().length; i++) {

    // creating marker variables for the event listener
    var newMarker = self.bulletPoints()[i].marker;

    // event listener for the infoWindow to open on click
    google.maps.event.addListener(newMarker, 'click', (function(markerRef, pointRef) {
    
      // creating the wikipedia request with sandbox
      var newRequest = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+ newMarker.title + '&format=json&callback=wikiCallback';

      return function() {
        $.ajax({
          type: "GET",
          url: newRequest,
          dataType: "jsonp",
          success: function (response) {
            // The creation of the content string starts here
            // But first we wait for response of the ajax request
            var newContent;
            var wikiArticles = response[1];
            if (wikiArticles.length > 0) {
              for (var i = 0 ; i < wikiArticles.length; i++ ) {
                var site = wikiArticles[i];
                var url = "http://en.wikipedia.org/wiki/" + wikiArticles[i];

                // filling the requestW observable with the ajax output
                // bug: multiple results are not returned
                pointRef.requestW.push('<li class="li-wiki"><a href="' + url + '"target="_blank">' + site + '</li></a>');
              };

              // Here we create the actual content string for each location using the results of the ajax request
                newContent = '<div id="content">'+
                  '<div id="siteNotice">'+
                  '</div>'+
                  '<h3 id="firstHeading" class="firstHeading">' + pointRef.name + '</h3>'+
                  '<div id="bodyContent">'+
                  '<p>The <b>' + pointRef.name + '</b> is located at <b>' + pointRef.address + '</b></p>'+
                  '<h5>Related Wikipedia articles:</h5>' + 
                  '<ul>' + pointRef.requestW() + '</ul>' +
                  '</div>'+
                  '</div>';
            }
            else {
              // if no articles are found, the following message is displayed
              newContent = '<p>Sorry, no matching articles found</p>';
            }

            // setting the content for the InfoWindow
            InfoWindow.setContent(newContent);

            // opening the infoWindow
            InfoWindow.open(map, markerRef);              
          },

          // if the request can't be loaded, the following error message is displayed
          error: function (e) {
            newContent = '<p>Articles could not be loaded.</p>';
          }
        });
        return false;
      };
    })(newMarker, self.bulletPoints()[i]));

    // other Google Maps events
    google.maps.event.addListener(newMarker, 'click', (function(contentCopy) {
      return function() {
        // makes marker bounce once upon click
        if (contentCopy.getAnimation() !== null) {
          contentCopy.setAnimation(null);
        } 
        else {
          contentCopy.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function(){ contentCopy.setAnimation(null); }, 750);
        };
      }
    })(newMarker));
  }

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