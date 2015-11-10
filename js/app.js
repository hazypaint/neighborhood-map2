/****** MODEL *******/
// global variables
var map;
var InfoWindow;

// setting location data for Basel
var initialLocations = [
{name : "Basel Minster", address: "Rittergasse 3, 4051 Basel", tags: ["church", "cathedral"], lat: 47.556458, lng: 7.592443, marker: null, requestW: null, requestN: null},
{name : "Zoo Basel", address: "Binningerstrasse 40, 4054 Basel", tags: ["animals", "attraction", "family fun"], lat: 47.547405, lng: 7.578807, marker: null, requestW: null, requestN: null},
{name : "Kunstmuseum Basel",  address: "St. Alban-Graben 16, 4051 Basel", tags: ["art", "museum"], lat: 47.554021, lng: 7.594268, marker: null, requestW: null, requestN: null},
{name : "Basel SBB Railway Station", address: "Centralbahnstrasse 10, 4051 Basel", tags: ["getting here", "travel"], lat: 47.547571, lng: 7.589662, marker: null, requestW: null, requestN: null},
{name : "EuroAirport Basel Mulhouse Freiburg", address: "68304 Saint-Louis, France", tags: ["getting here", "travel"], lat: 47.598181, lng: 7.525497, marker: null, requestW: null, requestN: null},
{name : "Museum Tinguely", address: "Paul Sacher-Anlage 2, 4002 Basel", tags: ["art", "museum"], lat: 47.559101, lng: 7.612236, marker: null, requestW: null, requestN: null},
{name : "Theatre Basel", address: "Elisabethenstrasse 16, 4051 Basel", tags: ["art", "theatre", "shows"], lat: 47.553306, lng: 7.590082, marker: null, requestW: null, requestN: null},
{name : "Dollhouse Museum", address: "Steinenvorstadt 1, 4051 Basel", tags: ["art", "museum", "family fun"], lat: 47.553882, lng: 7.589206, marker: null, requestW: null, requestN: null},
{name : "Basel Paper Mill", address: "St. Alban-Tal 37, 4052 Basel", tags: ["museum"], lat: 47.554668, lng: 7.603095, marker: null, requestW: null, requestN: null},
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
  InfoWindow = new google.maps.InfoWindow();
};

/****** VIEWMODEL *******/

var ViewModel = function() {
  // console.log('ViewModel');
  var self = this;  // = ViewModel{}
  var imageBlack = 'img/marker-icon-black.png';
  var $wikiElem = $('#wikipedia-links');
  var $nytElem = $('#nytimes-articles');
  var wikiContent = "";

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
  

  // load function for AJAX request -- executed on click event
  var loadData = function (bulletPoint){
    for (var i = 0; i < self.bulletPoints().length; i++) {
      // wikipedia link created with wiki sandbox
      self.bulletPoints()[i].requestW = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+ self.bulletPoints()[i].name + '&format=json&callback=wikiCallback';
      var requestWiki = self.bulletPoints()[i].requestW;

      // NYTimes link for request
      // self.bulletPoints()[i].requestN = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + self.bulletPoints()[i].name + "&page=0&max=5&api-key=bec2df7e772a904f941747a02d2bc3e7:4:72782796";
      // var requestNYT = self.bulletPoints()[i].requestN;
    }
    
    console.log('1: ' + requestWiki);
  
    // time out error info in case wikipedia can't be loaded
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("Wikipedia articles could not be loaded.");
    }, 8000);
    console.log('2: right b4 AJAX');
    // Wikipedia AJAX request
    $.ajax({
      type: "GET",
      url: requestWiki,
      dataType: "jsonp",
      success: function (response) {
        console.log('3: ');              //!!!
        var wikiArticles = response[1];
        if (wikiArticles.length > 0) {
          for (var i = 0 ; i < wikiArticles.length; i++ ) {
              var site = wikiArticles[i];
              var url = "http://en.wikipedia.org/wiki/" + wikiArticles[i];
              $wikiElem.append("<li><a href='" + url + "'target='_blank'>" + site + "</a></li>");
              wikiContent = "<li><a href='" + url + "'target='_blank'>" + site + "</a></li>";
              console.log('3a: ' + wikiContent);
              }
            }
        // if no articles are found, the following message is displayed
        else {
          $wikiElem.append("<p>Sorry, we could not find any matching Wikipedia articles for your search</p>" );
          wikiContent = "<p>Sorry, no matching articles found</p>" ;
        }
          clearTimeout(wikiRequestTimeout);
        },
      // if the request can't be loaded, the following message is displayed
      error: function (e) {
          $wikiElem.text("Wikipedia articles could not be loaded.");
          wikiContent = "<p>Articles could not be loaded.</p>" ;
        }
    });
    console.log('4: skips til here')
    // NYTimes AJAX request
    // $.getJSON(requestNYT)
    //   .done ( function (data) {
    //     var articles = data.response.docs;

    //     //runs through each article and provides the requested data (head line + snippet) from each
    //     if (articles.length > 0) {
    //       for (var i = 0 ; i < articles.length ; i++ ) {
    //         var headlineAndLink = "<a href='" + articles[i].web_url + "'target='_blank''>" + articles[i].headline.main;
    //         var snippet = "<p>" + articles[i].snippet + "</p>" ;
    //         $nytElem.append("<li class='article'>" + headlineAndLink  + "</a>" + snippet + "</li>" );
    //         };
    //     }
    //     // if no articles are found, the following message is displayed
    //     else {
    //       $nytElem.append("<li class='article'>Sorry, we could not find any NYTimes articles for this search time</li>" );
    //     }
    //     })
    //   // if the request can't be loaded, the following message is displayed
    //   .fail ( function (e) {
    //       $nytElem.text("New York Times article could not be loaded.");
    //   });
    return false;
  };
// }
loadData();
console.log('5: outside of loadData');

  // setting the content for the infoWindow and event listener for markers and list items
  for (var i = 0; i < self.bulletPoints().length; i++) {
    
    console.log('6: content creation for infowindow');

    // creates a content string for each location
    var newContent = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h3 id="firstHeading" class="firstHeading">' + self.bulletPoints()[i].name + '</h3>'+
      '<div id="bodyContent">'+
      '<p>The <b>' + self.bulletPoints()[i].name + '</b> is located at <b>' + self.bulletPoints()[i].address + '</b></p>'+
      '<h5>Wikipedia Articles:</h5>' + 
// needs fix: should update wikipedia link 
      '<ul id="wikipedia-links">' + wikiContent[i] + '</ul>'
      '<h5>Foursquare rating:</h5>' + 
      '</div>'+
      '</div>';

    // creating marker variables for the event listener
    var newMarker = self.bulletPoints()[i].marker;
    
    // event listener for the infoWindow to open on click
    google.maps.event.addListener(newMarker, 'click', (function(contentCopy) {
      return function() {
        InfoWindow.setContent(contentCopy);
        InfoWindow.open(map, this);
      };
    })(newContent));

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
          $wikiElem.text("");
          $nytElem.text("");
          // loads wiki content related to clicked marker or list item
          loadData(contentCopy);
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