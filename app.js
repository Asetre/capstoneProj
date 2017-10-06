var prices = {
  usa: null,
  can: null
}

//			costOfTrip = (distanceInMiles / vehicleMileage * regionPrice).toFixed(2);
var info ={
  distance: 0,
  price: 0,
  mileage: 0,
  year: 0,
  costUs: function() {
    //convert km to miles
		var distanceMiles = this.distance * 0.000621371;
    console.log(typeof Number(this.mileage), typeof distanceMiles, typeof this.price)
    return (distanceMiles / Number(this.mileage) * this.price).toFixed(2)
  },
  costCa: function() {
//			var distanceInKm = distance * .001;
//			costOfTrip = (distanceInKm / 100 * vehicleMileage * regionPrice).toFixed(2);
    var distanceKm = this.distance * .001
    return (distanceKm / 100 * Number(this.mileage) * this.price).toFixed(2)
  },
  convertMileage: function() {
    this.mileage = 235.215 / this.mileage
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
  var input1 = document.getElementById('start-loc')
  var input2 = document.getElementById('dest-loc')
  //set google maps autocomplete
  var searchbox1 = new google.maps.places.SearchBox(input1)
  var searchbox2 = new google.maps.places.SearchBox(input2)
  //Load the page
  loadPage()
}

//Make page viewable
function loadPage() {
  //remove blur on page
  $('.main').removeClass('blur')
  //remove loading circle and message
  $('.loading').hide()
  $('.loading-msg').hide()
}

//Toggle html elements
function unitedStatesToggle(event) {
  event.preventDefault()
  $('#states-js').toggle()
  $('#provinces-js').hide()

}

//Toggle html elements
function canadaToggle(event) {
  event.preventDefault();
  $('#provinces-js').toggle()
  $('#states-js').hide()

}

function renderHtml() {
  let cost;
	if( $('#states-js').is(":visible") && $('#provinces-js')) {
    cost = info.costUs()
  }else if($('#provinces-js').is(':visible') && $('#states-js')) {
    cost = info.costCa()
  }
  let costHTML = "<h2>The estimated cost is: " + "$" + cost + "</h2>"
  $('.cost-container').append(costHTML)
}

function getRegionPrice() {
  //Match the state/province of choice to cost
  //If user chooses us
	if( $('#states-js').is(":visible") && $('#provinces-js')) {
		var regionChoice = $('#states-js').val();
		for(keys in prices.usa) {
			if(regionChoice === keys) {
				info.price  = prices.usa[keys];
			}
		}
  //if user chooses ca
} else if($('#provinces-js').is(":visible") && $('#states-js')) {
		var regionChoice = $('#provinces-js').val();
		for(keys in prices.can) {
			if(regionChoice === keys) {
				info.price = prices.can[keys] * .01;
			}
		}
	}
  //get the vehicle mileage
  getMileage(renderHtml)
}

function handleXML(err, xml, cb) {
  if(err) {
     console.log(err)
     alert('Sorry there was an error finding your vehicle please try again')
  }
  //convert xml into json
  let jsonRaw = xml2json(xml, "")
  try {
    let vehicles = JSON.parse(jsonRaw).vehicles.vehicle
    let cars = vehicles

    //find the car with matching year
    for(key in cars) {
      if(cars[key].year === info.year) {
        info.mileage = cars[key].comb08
        break
      }
    }
  }catch(err) {
    console.log(err)
      alert('Sorry, we could not find you vehicle. We have used an average vehicle mileage')
      info.mileage = 26.2
  }
  //execute callback
  cb()
}

function getMileage(cb) {
  //cb is a callback
  var make = $('#car-make').val()
  var model = $('#car-model').val()
  info.year = $('#car-year').val()

  //remove whitespace
  make = make.replace(' ', '')
  model = model.replace(' ', '')

  //make ajax request to get xml data for vehicle
  $.ajax({
    url: 'https://www.fueleconomy.gov/ws/rest/ympg/shared/vehicles?make=' + make + '&model=' + model,
    dataType: 'xml',
    crossDomain: true,
    success: function(xml) {
      handleXML(null, xml, cb)
    },
    error: function(err) {
      handleXML(err, null, cb)
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
    origin: $('#start-loc').val(),
    destination: $('#dest-loc').val(),
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
  $('.btn-us-opt').on('click', unitedStatesToggle);
  $('.btn-can-opt').on('click', canadaToggle);
  $('.btn-calc').on('click', calculateCost);

})
