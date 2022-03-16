var map;
var infowindow;
var pagebounds;
var markerCluster; // handles all the static markers
var marker; // used in a variety of places ... probably shouldn't be global
var markers = []; // static vehicle markers
var icons = []; // vehicle (and rider) icons for static map
var vicons = []; // vehicle icons for interactive map
var viconcnt = 0; // this will rotate through the icons as vehicles appear and
					// disappear
var vmarkers = []; // interactive vehicle markers ... should always match with
					// animation[i].vehicles array ...

function attachMessage(marker, msg) {
	marker.addListener('click', function() {
		infowindow.setContent(msg);
		infowindow.open(map, marker);
	});
}

// send ajax request to save/update segment
function saveSegment() {
	let vals = $("#slider").rangeSlider("values");
	let segstart = Math.round(vals.min);
	let segfinish = Math.round(vals.max);
	let postdata = {title:'Untitled',coords:''};
	for (let i=segstart; i<segfinish; i++) {
		postdata.coords += coordinates[i].toUrlValue(5) + ";";
	}
	postdata.coords = postdata.coords.substr(0,postdata.coords.length-1); // chop
																			// off
																			// last
																			// ";"
	$.post(site_url + 'segments/savesegment/', postdata, function(data) { if (!isNaN(data)) window.location.href = site_url + 'segments/edit/' + data + '/1'; });
}

function showLaps() {
	if ($('#lapchkbox').prop('checked')) {
		$("#lapdata").show();
	} else {
		$("#lapdata").hide();
	}	
}

function showStats() {
	if ($('#statchkbox').prop('checked')) {
		$("#statdata").show();
	} else {
		$("#statdata").hide();
	}	
}

// used when viewing ride by itself
function initInteractive() {
	infowindow.close();
	if ($('#interactivechkbox').prop('checked')) {
		$("#sliderarea").show();
		ridermarker.setMap(map);
		markerCluster.clearMarkers();
		map.setZoom(16);
		map.setCenter(ridermarker.position);
	} else {
		$("#sliderarea").hide();
		ridermarker.setMap(null);
		markers.forEach(function(marker) {
			markerCluster.addMarker(marker);
		});
		map.fitBounds(pagebounds);
		map.setCenter(pagebounds.getCenter());
	}
}

// similar to initInteractive but on video processing page instead
function toggleVehicles(hide) {
	if (hide) {
		markerCluster.clearMarkers();
		map.setZoom(16);
		map.setCenter(ridermarker.position);
	} else {
		markers.forEach(function(marker) {
			markerCluster.addMarker(marker);
		});
	}
}

var mousedown = false;
var mousedownfunc = function(inc) {
	if (mousedown) {
		// check for bounds
		let oldval = $("#slider").slider("value");
		let vehcnt = animation[oldval].vehicles.length;
		let newval = oldval;
		if (inc < 0 && oldval > 0) {
			newval = newval + inc; // actually subtracts since inc is negative
		} else if (inc > 0 && oldval < $("#slider").slider("option", "max")) {
			newval = newval + inc;
		}
		$("#slider").slider("value", newval);
		setTimeout(function() {
			mousedownfunc(inc);
		}, vehcnt > 0 ? 100 : 1);
	}
}

function interactiveMousedown(inc) {
	mousedown = true;
	mousedownfunc(inc);
}

function interactiveMouseup() {
	mousedown = false;
}

function interactivePlay() {
	interactiveMousedown(1);
}

function interactivePause() {
	interactiveMouseup();
}

// ai - animation index
// updates the rider marker and vehicle markers (if any)
function updateMarkers(ai) {
	// handle rider marker first
	let pos = animation[ai].riderpos;
	let markerpos = new google.maps.LatLng(pos[0], pos[1]);
	let bounds = map.getBounds();
	if (!bounds.contains(markerpos)) {
		map.setCenter(markerpos);
	}
	ridermarker.setPosition(markerpos);

	// now let's address the vehicle markers
	let veh = animation[ai].vehicles;
	if (veh.length < vmarkers.length) {
		// car passed us (or disappeared off radar ... could check range and
		// speed to see which it is!!!
		let doomed = vmarkers.shift();
		doomed.setIcon(icons[3]);
		setTimeout(function() {
			doomed.setMap(null); // remove marker from map after exploding it
									// for a tenth of a second
		}, 100);
	}

	// now let's get rid of the rest of the markers b/c we will be creating them
	// again
	while (vmarkers.length > 0) {
		vmarkers.shift().setMap(null);
	}

	// re-add markers
	for (let vi = 0; vi < veh.length; vi++) {
		vmarkers.push(new google.maps.Marker({
			map: map,
			position: new google.maps.LatLng(veh[vi].pos[0], veh[vi].pos[1]),
			icon: icons[0]
		}));
	}
}

infowindow = new google.maps.InfoWindow({
	content: ''
});
map = new google.maps.Map(document.getElementById('map'), {
	center: { // null island while map is loading
		lat: 0,
		lng: 0
	},
	zoom: 12
});

icons[0] = {
	path: google.maps.SymbolPath.CIRCLE,
	fillColor: '#0A0',
	fillOpacity: 0.6,
	strokeColor: '#F66',
	strokeOpacity: 0.9,
	strokeWeight: 1,
	scale: 5
};
icons[1] = {
	path: google.maps.SymbolPath.CIRCLE,
	fillColor: '#AA0',
	fillOpacity: 0.6,
	strokeColor: '#AA0',
	strokeOpacity: 0.9,
	strokeWeight: 1,
	scale: 7
};
icons[2] = {
	path: google.maps.SymbolPath.CIRCLE,
	fillColor: '#0F0',
	fillOpacity: 0.6,
	strokeColor: '#0F0',
	strokeOpacity: 0.9,
	strokeWeight: 1,
	scale: 7
};
icons[3] = {
	path: google.maps.SymbolPath.CIRCLE,
	fillColor: '#F0F',
	fillOpacity: 0.6,
	strokeColor: '#F0F',
	strokeOpacity: 0.9,
	strokeWeight: 1,
	scale: 10
};
icons[4] = {
	path: google.maps.SymbolPath.CIRCLE,
	fillColor: '#0FF',
	fillOpacity: 0.6,
	strokeColor: '#0FF',
	strokeOpacity: 0.9,
	strokeWeight: 1,
	scale: 7
};
var starticon = {
		path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
		fillColor: '#0A0',
		fillOpacity: 0.6,
		strokeColor: '#0F0',
		strokeOpacity: 0.9,
		strokeWeight: 1,
		scale: 8
};
var finishicon = {
        path: 'M -2,0 0,-2 2,0 0,2 z',
		fillColor: '#F00',
		fillOpacity: 0.6,
		strokeColor: '#F00',
		strokeOpacity: 0.9,
		strokeWeight: 1,
		scale: 8
};

const VFILLO = 0.6;
const VSTROKEO = 0.9;
const VSTROKEW = 1;
const VSCALE = 6;
const VCOLORS = ['#0A0', '#A00', '#00A', '#0AA', '#A0A', 'AA0', '#FA7', '#7FA'];

for (let vi = 0; vi < VCOLORS.length; vi++) {
	vicons[vi] = {
		path: google.maps.SymbolPath.SQUARE,
		fillColor: VCOLORS[vi],
		fillOpacity: VFILLO,
		strokeColor: VCOLORS[vi],
		strokeOpacity: VSTROKEO,
		strokeWeight: VSTROKEW,
		scale: VSCALE
	};
}
