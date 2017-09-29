var prices = {
  usa: null,
  can: null
}

//			costOfTrip = (distanceInMiles / vehicleMileage * regionPrice).toFixed(2);
var info ={
  distance: 0,
  price: 0,
  mileage: 0,
  costUs: function() {
    //convert km to miles
		var distanceMiles = this.distance * 0.000621371;
    return (distanceMiles / this.mileage * this.Price).toFixed(2)
  },
  costCa: function() {
//			var distanceInKm = distance * .001;
//			costOfTrip = (distanceInKm / 100 * vehicleMileage * regionPrice).toFixed(2);
    var distanceKm = this.distance * .001
    return (distanceKm / 100 * this.mileage * price).toFixed(2)
  }

}
//Make ajax request to get prices
function getPrices(cb) {
  //cb is a callback
  //Get US prices
  $.getJSON('https://quiet-atoll-70799.herokuapp.com/USA', function(info) {
    prices.usa = info
    //Get Can prices
    $.getJSON('https://quiet-atoll-70799.herokuapp.com/CAN', function(info) {
      prices.can = info
      //Run callback
      cb()
    });
  });
}

//Initialize google maps
function initMap() {
  //set the map with default location
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 46.392410, lng: -94.636230},
    zoom: 4
  });
  //get input elements
  var input1 = document.getElementById('pac-input')
  var input2 = document.getElementById('pac-input2')
  //set google maps autocomplete
  var searchbox1 = new google.maps.places.SearchBox(input1)
  var searchbox2 = new google.maps.places.SearchBox(input2)
  //Load the page
  loadPage()
}

//Make page viewable
function loadPage() {
  //remove blur on page
  $('.main-content').removeClass('blur')
  //remove loading circle
  $('.loading').hide()
}

//Toggle html elements
function unitedStatesToggle(event) {
  event.preventDefault()
  $('#us-options-js').toggle()
  $('#can-options-js').hide()

}

//Toggle html elements
function canadaToggle(event) {
  event.preventDefault();
  $('#can-options-js').toggle()
  $('#us-options-js').hide()

}

//Clear form elements
function clearForms(event) {
   event.preventDefault();
   document.getElementById("myForm").reset();
}

function renderHtml() {
  console.log(info)
	//var = costToHTML = '<h3>The estimated cost of your trip is: </h3>' +  '<h2>$' + costOfTrip + '</h2>';
//
	//$('.cost-container').html(costToHTML);
}

function getRegionPrice() {
  //If user chooses us
	if( $('#us-options-js').is(":visible") && $('#can-options-js:hidden')) {
		regionChoice = $('#states-js').val();
		for(keys in unitedStatesPrices) {
			if(regionChoice === keys) {
				info.price  = unitedStatesPrices[keys];
			}
		}
  //if user chooses ca
	} else if($('#can-options-js').is(":visible") && $('#us-options-js:hidden')) {
		regionChoice = $('#provinces-js').val();
		for(keys in canadaPrices) {
			if(regionChoice === keys) {
				info.price = canadaPrices[keys] * .01;
			}
		}
	}
  //get the vehicle mileage
  getMileage(renderHtml)
}

function getMileage(cb) {
  //cb is a callback
  var make = 'honda'
  var model = 'civic'
  var year = '2007'

  //make ajax request to get xml data for vehicle
  $.ajax({
    url: 'http://www.fueleconomy.gov/ws/rest/ympg/shared/vehicles?make=' + make + '&model=' + model,
    dataType: 'xml',
    crossDomain: true,
    success: function(xml) {
      //convert xml into json
      let jsonRaw = xml2json(xml, "")
      let vehicles = JSON.parse(jsonRaw).vehicles.vehicle
      let cars = vehicles

      //find the car with matching year
      for(key in cars) {
        if(cars[key].year === year) {
          info.mileage = cars[key].comb08
          break
        }
      }
      //execute callback
      cb()
    },
    error: function(err) {
      console.log(err)
    }
  })
}


function calculateCost(e) {
  e.preventDefault()
  //get vehicle mileage info
  calculateDistance(getRegionPrice)
}

function calculateDistance(cb) {
  //cb is a callback function
  //google maps map drawing
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  directionsDisplay.setMap(map);

  //Find the distance between points
  directionsService.route({
    origin: $('#pac-input').val(),
    destination: $('#pac-input2').val(),
    travelMode: 'DRIVING'
  }, function(response, status) {
    if (status === 'OK') {
      //if successful get info and draw map
      directionsDisplay.setDirections(response);
      var distanceCalculated = response.routes[0].legs[0].distance.value
      //distance is in km
      info.distance = distanceCalculated
      //run callback
      cb()
    } else {
      //Failed to get the distance
      console.log('Directions request failed due to ' + status);
    }
  });
}

$(document).ready(function() {
  //Get prices --> Initialize google maps --> make page available
  getPrices(initMap)

  //Event Listeners
  $('#imperial-option').on('click', unitedStatesToggle);
  $('#metric-option').on('click', canadaToggle);
  $('.submit-button').on('click', calculateCost);
  $('.reset').on('click', clearForms);


  (function getMileage(cb) {
  })()
})


//$(document).ready(function() {
//    retrieveGasApi(initMap(loadPage));
//});
//
//var costOfTrip;
//var regionChoice;
//var regionPrice;
//var unitedStatesPrices;
//var canadaPrices;
//var distance;
//
////Remove the loading screen
//function loadPage() {
//  $('.main-content').removeClass('blur')
//  $('.loading').hide()
//}
//
////Make AJAX request for prices
//function retrieveGasApi(cb) {
//  //cb argument is a callback
//  //Get gas prices for US
//  $.getJSON('https://quiet-atoll-70799.herokuapp.com/USA', function(information) {
//    unitedStatesPrices = information;
//    //Get gas prices for Canada
//    $.getJSON('https://quiet-atoll-70799.herokuapp.com/CAN', function(information) {
//      canadaPrices = information;
//      //Wait for async code to load before running callback
//      cb()
//    });
//  });
//
//}
//
////Initialize google maps
//var initMap = function(cb) {
//  //cb is a callback
//    //set the map with default location
//    map = new google.maps.Map(document.getElementById('map'), {
//	    center: {lat: 46.392410, lng: -94.636230},
//	    zoom: 4
//    });
//
//    //get inputs
//    var input1 = document.getElementById('pac-input');
//    var input2 = document.getElementById('pac-input2');
//    //set google maps autocomplete
//    var searchbox1 = new google.maps.places.SearchBox(input1);
//    var searchbox2 = new google.maps.places.SearchBox(input2);
//    //run callback
//    cb()
//}
//
////Calculate the total distance
//function calculateDistance() {
//    //google maps map drawing
//    var directionsService = new google.maps.DirectionsService;
//    var directionsDisplay = new google.maps.DirectionsRenderer;
//
//    directionsDisplay.setMap(map);
//
//  //Find the distance between points
//  directionsService.route({
//	origin: $('#pac-input').val(),
//	destination: $('#pac-input2').val(),
//	travelMode: 'DRIVING'
//    }, function(response, status) {
//	if (status === 'OK') {
//      //if successful get info and draw map
//	    directionsDisplay.setDirections(response);
//	    var distanceCalculated = response.routes[0].legs[0].distance.value;
//	    distance = distanceCalculated;
//      //run callback
//      getRegionPrice()
//	} else {
//	    console.log('Directions request failed due to ' + status);
//	}
//    });
//
//}
//
//
//function calculateCost(event) {
//    event.preventDefault();
//    calculateDistance();
//		if( $('#us-options-js').is(":visible") && $('#can-options-js:hidden')) {
//			var vehicleMileage = $('#miles-per-gallon').val();
//			var distanceInMiles = distance * 0.000621371;
//
//			costOfTrip = (distanceInMiles / vehicleMileage * regionPrice).toFixed(2);
//
//
//		} else if($('#can-options-js').is(":visible") && $('#us-options-js:hidden')) {
//			var vehicleMileage = $('#litres-per-km-js').val();
//			var distanceInKm = distance * .001;
//			costOfTrip = (distanceInKm / 100 * vehicleMileage * regionPrice).toFixed(2);
//
//		}
//		renderCost();
//}
//
//
//function getRegionPrice() {
//	if( $('#us-options-js').is(":visible") && $('#can-options-js:hidden')) {
//		regionChoice = $('#states-js').val();
//		for(keys in unitedStatesPrices) {
//			if(regionChoice === keys) {
//				regionPrice  = unitedStatesPrices[keys];
//			}
//		}
//	} else if($('#can-options-js').is(":visible") && $('#us-options-js:hidden')) {
//		regionChoice = $('#provinces-js').val();
//		for(keys in canadaPrices) {
//			if(regionChoice === keys) {
//				regionPrice = canadaPrices[keys] * .01;
//			}
//		}
//	}
//}
//
//function renderCost() {
//
//}
