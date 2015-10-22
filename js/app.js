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
    // console.log(initialLocations);
var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
      '<div id="bodyContent">'+
      '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
      'sandstone rock formation in the southern part of the '+
      'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
      'south west of the nearest large town, Alice Springs; 450&#160;km '+
      '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
      'features of the Uluru - Kata Tjuta National Park. Uluru is '+
      'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
      'Aboriginal people of the area. It has many springs, waterholes, '+
      'rock caves and ancient paintings. Uluru is listed as a World '+
      'Heritage Site.</p>'+
      '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
      'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
      '(last visited June 22, 2009).</p>'+
      '</div>'+
      '</div>';

var infowindow = new google.maps.InfoWindow({
    content: contentString
});


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
        initialLocations[i].marker.addListener('click', function() {
            infowindow.open(map, initialLocations.marker);
        });
    } 

    // creating an array for the bullet points to display
    self.bulletPoints = ko.observableArray(initialLocations);

    // declaring the user input as an observable
    self.query = ko.observable('');

    // creating a computed observable to find matches between user input and bullet point list 
    self.search = ko.computed(function(){
        return ko.utils.arrayFilter(self.bulletPoints(), function(bulletPoint){            
            for (var i = 0; i < self.bulletPoints.length; i++) {
                // console.log(self.bulletPoints());
                self.bulletPoints()[1].marker.setVisible(false);
            } 
            return bulletPoint.name.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
            console.log('here2');
            });
            
        });
};

// Apply bindings
ko.applyBindings(new ViewModel());