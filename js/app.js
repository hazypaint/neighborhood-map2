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

// Load map on page load
google.maps.event.addDomListener(window, 'load', function() {
  initialize();
});

// initializing the map
var initialize = function() {
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
  var $wikiElem = $('#wikipedia-links');
  var $nytElem = $('#nytimes-articles');

  // creating an observable array for the bullet points to display
  self.bulletPoints = ko.observableArray(initialLocations);
  
  self.bulletPoints().forEach(function(bulletPoint) {
    bulletPoint.requestW = ko.observable();
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
    // var newContent = '<h1>%title%</h1>'
    var newContent;

    // event listener for the infoWindow to open on click
    google.maps.event.addListener(newMarker, 'click', (function(markerRef, pointRef) {
    
      // creating the wikipedia request with sandbox
      var newRequest = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+ newMarker.title + '&format=json&callback=wikiCallback';
      // console.log(newRequest);

      // time out error info in case wikipedia can't be loaded
      var wikiRequestTimeout = setTimeout(function(){
          $wikiElem.text("Wikipedia articles could not be loaded.");
      }, 8000);

      return function() {
        $.ajax({
          type: "GET",
          url: newRequest,
          dataType: "jsonp",
          success: function (response) {
            var newContent;
            // create string here
            // waiting for response of ajax request
            var wikiArticles = response[1];
            if (wikiArticles.length > 0) {
              for (var i = 0 ; i < wikiArticles.length; i++ ) {
                var site = wikiArticles[i];
                var url = "http://en.wikipedia.org/wiki/" + wikiArticles[i];

                // here I am trying to fill the requestW observable with the ajax output
                // however I don't get, what will happen when multiple results are returned
                pointRef.requestW('<li><a href="' + url + '"target="_blank">' + site + '</a></li>');
              };

              // creates a content string for each location using the ajax request

                newContent = '<div id="content">'+
                  '<div id="siteNotice">'+
                  '</div>'+
                  '<h3 id="firstHeading" class="firstHeading">' + pointRef.name + '</h3>'+
                  '<div id="bodyContent">'+
                  '<p>The <b>' + pointRef.name + '</b> is located at <b>' + pointRef.address + '</b></p>'+
                  '<h5>Wikipedia Articles:</h5>' + 
                  '<ul id="wiki">' + pointRef.requestW() + 
                  '<h5>Foursquare rating:</h5>' + 
                  '</div>'+
                  '</div>';
              };

              InfoWindow.setContent(newContent);
              
            // if no articles are found, the following message is displayed
            // else {
            //   $wikiElem.append("<p>Sorry, we could not find any matching Wikipedia articles for your search</p>" );
            //   self.bulletPoints()[i].requestW("<p>Sorry, no matching articles found</p>");
            //   console.log('sorry');
            // }
            // calling clearTimeout
              clearTimeout(wikiRequestTimeout);
              InfoWindow.open(map, markerRef);

              // opening the infoWindow
              
            },
          // if the request can't be loaded, the following message is displayed
          error: function (e) {
              $wikiElem.text("Wikipedia articles could not be loaded.");
              console.log('error');
              self.bulletPoints()[i].requestW("<p>Articles could not be loaded.</p>") ;
            }
          });
        return false;
      };
    })(newMarker, self.bulletPoints()[i]));


    // event listener for the infoWindow to open on click
    // google.maps.event.addListener(newMarker, 'click', (function(contentCopy) {
    //   return function() {
    //     InfoWindow.open(map, this);
    //   };
    // })(newContent));

    // other Google Maps events
    google.maps.event.addListener(newMarker, 'click', (function(contentCopy) {
      return function() {
        if (contentCopy.getAnimation() !== null) {
          contentCopy.setAnimation(null);
        } 
        else {
          // makes marker bounce once upon click
          contentCopy.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function(){ contentCopy.setAnimation(null); }, 750);
          // clears wiki and NYT text before loading new content
          // $wikiElem.text("");
          // $nytElem.text("");
          // loads wiki content related to clicked marker or list item
          // loadData(contentCopy);
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
        // InfoWindow.close();
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