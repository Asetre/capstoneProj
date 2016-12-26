(document).ready(function() {
    retrieveGasApi();
    initMap();
//Event Listeners
    $('#metric-option').on('click', unitedStatesToggle);
    $('.submit-button').on('clicl', calculateCost);
    
});

var unitedStatesPrices;
var regionChoice;
var unitedStatesPrices;
var vehicleMileage;



function retrieveGasApi() {
    $.getJSON('https://quiet-atol-70799.herokuapp.com/', function(information) {
	unitedStatesPrices = information;
    });
}

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
	    center: {lat: 46.392410, lng: -94.636230},
	    zoom: 4
    });

    var input1 = document.getElementById('pac-input');
    var input2 = document.getElementById('pac-input2');
    var searchbox1 = new google.maps.places.SearchBox(input1);
    var searchbox2 = new google.maps.places.SearchBox(input2);


}

function calculateDistance() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;


    directionsDisplay.setMap(map);

    directionsService.route({
	origin: $('#pac-input').val(),
	destionation: $('#pac-input2').val();
	travelMode: 'DRIVING'
    }, function(response, status) {

	console.log(status);

    }



}

function unitedStatesToggle() { 
   $('#staes.js').toggle();
   $('.vehicle-mileage-js').toggle

}



function calculateCost() {
    calculateDistance();



}

















