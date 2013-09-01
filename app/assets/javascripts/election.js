$(document).ready(function() {
	var currentLocation = [geoip_latitude(), geoip_longitude()];

	$('#map').mapSvg({
	    source: '/assets/world_high.svg',    // Path to SVG map
	    colors: {
	                base: "#E1F1F1",
	                background: "#eeeeee",
	                hover: "#548eac",
	                selected: "#065A85",
	                disabled: "#ffffff",
	                stroke: "#7eadc0"
	            },
	    disableAll:     true,
	    regions :    {
	           'USA':  {tooltip: '  USA: Click to go to Google.com', attr: {href: 'http://google.com'}},
	           'Yemen': {tooltip: 'You are above Yemen!'},
	           'France': {tooltip: ' France - wine and cheese!'},
	           'Kazakhstan': {tooltip: ' Kazakhstan - the ninth largest country in the world.'},
	           'Mongolia': {tooltip: ' Mongolia is a landlocked country in East Asia.'},
	           'China': {tooltip: ' China is the world\'s most-populous country.'},
	           'Norway': {tooltip: ' Norway'},
	           'Brazil': {tooltip: ' Brazil is the largest country in South America.'}
	          },
	  marks:     [
	            { c: currentLocation,
	             tooltip: 'You are here!'
	                +geoip_city()+''
	                +geoip_country_name()+''
	                +'Coordinates: '+currentLocation
	            },
	            { c: [38.893438,-77.03167],
	             tooltip: 'Sample pin for Washington, DCCoordinates: 38.893438,-77.03167',
	            },
	            { c: [51.49763,-0.148315],
	             tooltip: 'Sample pin for LondonCoordinates: 51.49763,-0.148315',
	            }
	                   ],
	    tooltipsMode:    'custom',
	    zoom: true,
	    pan: true,
	    responsive: true
	});
});