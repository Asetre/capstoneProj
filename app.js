

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 49.246292, lng: -123.116226},
      zoom: 11
    });

    var input = document.getElementById('pac-input');
    var input2 = document.getElementById('pac-input2')
    var searchbox = new google.maps.places.SearchBox(input);
    var searchbox2 = new google.maps.places.SearchBox(input2);
    var service = new google.maps.places.PlacesService(map);

    var gasStations = [];


    var request = {
    	key: 'AIzaSyDsIljx-RAmmjUcvwI5YsQtzZiRAtWQokU',
    	location: new google.maps.LatLng(49.246292,-123.116226),
    	radius: 3000,
    	keyword: 'gas',
    	type: 'gas_station'
    };

    service.radarSearch(request, function(info) {
    	info.forEach(infocallback)
    });

    function infocallback(places) {
    	var newRequest = {
    		placeId: places.place_id
    	}
    	service.getDetails(newRequest, function(data) {
    		gasStations.push(data)
    	})

    }
    console.log(gasStations)
}

$(document).ready(function() {
	$('form').submit(function(event){
		event.preventDefault();
		var startingPoint = $('#pac-input').val();
		var endingPoint = $('#pac-input2').val();

		var directionsService = new google.maps.DirectionsService;
    	var directionsDisplay = new google.maps.DirectionsRenderer;

    	directionsDisplay.setMap(map);

	    directionsService.route({
	    	origin: startingPoint,
	    	destination: endingPoint,
	    	travelMode: 'DRIVING'
	    }, function(response, status) {
	    	directionsDisplay.setDirections(response);
	    	console.log(response.routes[0].legs[0].distance)
	    });

	})
});




