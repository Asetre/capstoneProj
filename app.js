$(document).ready(function() {
    retrieveGasApi(loadPage);
    initMap();
//Event Listeners
    $('#imperial-option').on('click', unitedStatesToggle);
    $('#metric-option').on('click', canadaToggle);
    $('.submit-button').on('click', calculateCost);
    $('.reset').on('click', clearForms);
});

var costOfTrip;
var regionChoice;
var regionPrice;
var unitedStatesPrices;
var canadaPrices;
var distance;

//Remove the loading screen
function loadPage() {
}

//Make AJAX request for prices
function retrieveGasApi(cb) {
  //cb argument is a callback
  //Get gas prices for US
  $.getJSON('https://quiet-atoll-70799.herokuapp.com/USA', function(information) {
    unitedStatesPrices = information;
    //Get gas prices for Canada
    $.getJSON('https://quiet-atoll-70799.herokuapp.com/CAN', function(information) {
      canadaPrices = information;
      //Wait for async code to load before running callback
      cb()
    });
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
	destination: $('#pac-input2').val(),
	travelMode: 'DRIVING'
    }, function(response, status) {
	if (status === 'OK') {
	    directionsDisplay.setDirections(response);
	    var distanceCalculated = response.routes[0].legs[0].distance.value;
	    distance = distanceCalculated;
	} else {
	    console.log('Directions request failed due to ' + status);
	}
    });

}

function unitedStatesToggle(event) {
   event.preventDefault();
   $('#us-options-js').toggle();
   $('#can-options-js').hide();

}

function canadaToggle(event) {
    event.preventDefault();
    $('#can-options-js').toggle();
	$('#us-options-js').hide();

}

function calculateCost(event) {
    event.preventDefault();
    calculateDistance();
    getRegionPrice();
    setTimeout(function() {

		if( $('#us-options-js').is(":visible") && $('#can-options-js:hidden')) {
			var vehicleMileage = $('#miles-per-gallon').val();
			var distanceInMiles = distance * 0.000621371;

			costOfTrip = (distanceInMiles / vehicleMileage * regionPrice).toFixed(2);


		} else if($('#can-options-js').is(":visible") && $('#us-options-js:hidden')) {
			var vehicleMileage = $('#litres-per-km-js').val();
			var distanceInKm = distance * .001;
			costOfTrip = (distanceInKm / 100 * vehicleMileage * regionPrice).toFixed(2);

		}

		renderCost();
    }, 500);


}

function clearForms(event) {
   event.preventDefault();
   document.getElementById("myForm").reset();
}

function getRegionPrice() {
	if( $('#us-options-js').is(":visible") && $('#can-options-js:hidden')) {
		regionChoice = $('#states-js').val();
		for(keys in unitedStatesPrices) {
			if(regionChoice === keys) {
				regionPrice  = unitedStatesPrices[keys];
			}
		}
	} else if($('#can-options-js').is(":visible") && $('#us-options-js:hidden')) {
		regionChoice = $('#provinces-js').val();
		for(keys in canadaPrices) {
			if(regionChoice === keys) {
				regionPrice = canadaPrices[keys] * .01;
			}

		}
	}
}

function renderCost() {
	costToHTML = '<h3>The estimated cost of your trip is: </h3>' +  '<h2>$' + costOfTrip + '</h2>';

	$('.cost-container').html(costToHTML);

}
