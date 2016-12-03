//Initialize Map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 46.392410, lng: -94.636230},
      zoom: 4
    });

    var input = document.getElementById('pac-input');
    var input2 = document.getElementById('pac-input2')
    var searchbox = new google.maps.places.SearchBox(input);
    var searchbox2 = new google.maps.places.SearchBox(input2);


}

$(document).ready(function() {

    // Calculate distance and cost
    $('.submit-button').click(function(event){
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
            var distance = response.routes[0].legs[0].distance.value;
            calculateCost(distance);
            
        });
    });

    $('.reset').on('click', function() {
        document.getElementById("myForm").reset();
    });


    // Imperial and metric Toggle
    $('#imperial-option').click(function(event) {
        event.preventDefault();
        renderImperial();
    });

    $('#metric-option').click(function(event) {
        event.preventDefault();
        renderMetric();
    });



});

function calculateCost(distance) {
    if ($('.price-container').children().hasClass("imperial-price")) {
        var costPerLitre = $('.cost-gallon').val() * 0.264172052;
        var efficiency = $('.miles-gallon').val() * 0.425144;
        var km = distance * 0.001;
        var cost = (km / 100 * efficiency * costPerLitre).toFixed(2);
        $('.cost').html(cost)

    } else {
        var costPerLitre = $('.cost-litre').val();
        var efficiency = $('.litre-100km').val();
        var km = distance * 0.001;
        var cost = (km / 100 * efficiency * costPerLitre).toFixed(2);
        $('.cost').html(cost);
    }
    $('.output-container').show();
}

function renderImperial() {
    var imperialHTMl = '<div class="imperial-price">' +
                        '<input type="text" placeholder="Dollars per Gallon" class="cost-gallon">' +
                        '<input type="text" placeholder="Vehicle Miles/Gallon" class="miles-gallon">' +
                    '</div>';
    $('.price-container').html(imperialHTMl);
}

function renderMetric() {
     var metricHTML = '<div class="metric-price">' +
                        '<input type="text" placeholder="Dollars per Litre" class="cost-litre">' +
                        '<input type="text" placeholder="Vehicle Litres/100KM" class="litre-100km">' +
                    '</div>';
    $('.price-container').html(metricHTML);
}

