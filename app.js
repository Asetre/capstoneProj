
$(document).ready(function() {

    var tripCalculator = {

        distance: null,

    //Inputs
        //starting location input form
        startingPoint: null,
        //ending location input form
        endingPoint: null,
        //Button calculate
        submitButton: $('.submit-button'),
        //Reset Form button
        resetButton: $('.reset'),
        //calculate the distance

    //Starting Tasks
        init: function(){
            this.initMap();
        },

    //Methods
        //Initialize the map
        initMap: function() {
             map = new google.maps.Map(document.getElementById('map'), {
              center: {lat: 46.392410, lng: -94.636230},
              zoom: 4
            });

             //Form Autocomplete
             var input1 = document.getElementById('pac-input');
             var input2 = document.getElementById('pac-input2');
             var searchbox1 = new google.maps.places.SearchBox(input1);
             var searchbox2 = new google.maps.places.SearchBox(input2);
        },

        calcDistance: function(event){
            event.preventDefault();

            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer;

            directionsDisplay.setMap(map);

            directionsService.route({
                origin: $('#pac-input').val(),
                destination: $('#pac-input2').val(),
                travelMode: 'DRIVING'
            }, function(response, status) {
                directionsDisplay.setDirections(response);
                var distanceCalculated = response.routes[0].legs[0].distance.value;
                this.distance =  distanceCalculated;

                
            });
            //Once distance is known, calculate the cost
            this.calculateCost();
        },

        calculateCost: function(){
            console.log(this.distance);
        }


    }

    // $('.reset').on('click', function() {
    //     document.getElementById("myForm").reset();
    // });


    // // Imperial and metric Toggle
    // $('#imperial-option').click(function(event) {
    //     event.preventDefault();
    //     renderImperial();
    // });

    // $('#metric-option').click(function(event) {
    //     event.preventDefault();
    //     renderMetric();
    // });


tripCalculator.init();
tripCalculator.submitButton.on('click', tripCalculator.calcDistance);
});


// function calculateCost(distance) {
//     if ($('.price-container').children().hasClass("imperial-price")) {
//         var costPerLitre = $('.cost-gallon').val() * 0.264172052;
//         var efficiency = $('.miles-gallon').val() * 0.425144;
//         var km = distance * 0.001;
//         var cost = (km / 100 * efficiency * costPerLitre).toFixed(2);
//         checkOptions(cost);

//     } else {
//         var costPerLitre = $('.cost-litre').val();
//         var efficiency = $('.litre-100km').val();
//         var km = distance * 0.001;
//         var cost = (km / 100 * efficiency * costPerLitre).toFixed(2);
//         checkOptions(cost);
//     }
// }

// function checkOptions(cost) {
//     var testifNaN = isNaN(cost)
//     if(testifNaN) {
//             var errHTML = '<div><h4>Missing Information: Check Imperial or Metric.</h4>';
//             $('.cost').html(errHTML);
//         } else {
//            var costHTML = '<h2 class="cost-header">$ ' + cost + '</h2>';
//            $('.cost').html(costHTML);
            
//         }
// }

// function renderImperial() {
//     var imperialHTMl = '<div class="imperial-price">' +
//                         '<input type="text" placeholder="Dollars per Gallon" class="cost-gallon">' +
//                         '<input type="text" placeholder="Vehicle Miles/Gallon" class="miles-gallon">' +
//                     '</div>';
//     $('.price-container').html(imperialHTMl);
// }

// function renderMetric() {
//      var metricHTML = '<div class="metric-price">' +
//                         '<input type="text" placeholder="Dollars per Litre" class="cost-litre">' +
//                         '<input type="text" placeholder="Vehicle Litres/100KM" class="litre-100km">' +
//                     '</div>';
//     $('.price-container').html(metricHTML);
// }




// ///////////////////////



// $.getJSON('https://quiet-atoll-70799.herokuapp.com/Oklahoma', function(info){
//     console.log(info);
// })




















