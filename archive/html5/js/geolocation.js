

var getLatitudeAndLongitude = function() {
    navigator.geolocation.getCurrentPosition(function (position) {
        showLocation(position.coords.latitude, position.coords.longitude)
    });
};

var getLatitudeAndLongitudeWithFallback = function(){

    if ((typeof google === 'object') && google.loader && google.loader.ClientLocation) {

        showLocation(google.loader.ClientLocation.latitude, google.loader.ClientLocation.longitude);

    } else {

        var message = $("<p>Couldn`t find your</p>");
        message.insertAfter("#map");
    }
};


