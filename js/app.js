// cat data from previous cat clickers

// var map;
var initialLocations = [
    {name : "Basler Münster", address: "Rittergasse 3, 4051 Basel", tags: ["sight", "church", "cathedral"], lat: 47.556458, lng: 7.592443},
    {name : "Zoo", address: "Binningerstrasse 40, 4054 Basel", tags: ["animals", "attraction", "family fun"], lat: 47.547405, lng: 7.578807},
    {name : "Muesum of Art",  address: "St. Alban-Graben 16, 4051 Basel", tags: ["art", "museum"], lat: 47.554021, lng: 7.594268},
    {name : "Railway Station", address: "Centralbahnstrasse 10, 4051 Basel", tags: ["getting here", "travel"], lat: 47.547571, lng: 7.589662},
    {name : "St Paul's church", address: "Steinenring 20, 4051 Basel", tags: ["sight", "church", "cathedral"], lat: 47.551786, lng: 7.578393},
    ];

function initMap() {
  var myLatLng = {lat: 47.556458, lng: 7.592443};

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: myLatLng
  });
}

var Location = function(data) {
    var latlng;
    this.clickCount = ko.observable(data.clickCount);
    this.name = ko.observable(data.name);
    this.address = ko.observable(data.address);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.tags = ko.observableArray(data.tags);
}

var ViewModel = function() {
    var self = this;
    var map;
    var markers = ko.observableArray([]);

    this.locationList = ko.observableArray([]);

    initialLocations.forEach(function(locationItem){
        self.locationList.push( new Location(locationItem));
    });

    self.currentLocation = ko.observable(this.locationList()[0]);


    this.setLocation = function(clickedLocation) {
        self.currentLocation(clickedLocation);
    }

};

ko.applyBindings(new ViewModel());