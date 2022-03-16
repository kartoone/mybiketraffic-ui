function convertMetersToMiles(meters) {
    let miles = meters*0.000621371;
    return miles.toFixed(2);
}
function convertMetersToFeet(meters) {
    let feet = meters*3.28084;
    return feet.toFixed(1);
}
function convertMetersPerSecToMPH(mps) {
    let mph = mps*2.23694;
    return mph.toFixed(2);
}

function toggleStats(stationary) {
	$(".stationary").toggle();
	$(".moving").toggle();
}

function updateAbsolute(units) {
	// only do something if we are indeed displaying absolute vs relative speeds 
	if ($(".abs").length > 0) {
		// check current imperial v. metric status
		let imperial = units==0;
		let relative = $("input[name='abs']:checked").val() == 0;
		
		// now only show the apprpriate things
		// now reveal only correct speed (four possibilities)
		if (relative && imperial) {
			$(".rel.imperial").css("display","table-cell");
			$(".rel.metric").css("display","none");
			$(".abs.metric").css("display","none");
			$(".abs.imperial").css("display","none");
		} else if (relative && !imperial) {
			$(".rel.metric").css("display","table-cell");
			$(".rel.imperial").css("display","none");
			$(".abs.metric").css("display","none");
			$(".abs.imperial").css("display","none");
		} else if (!relative && imperial) {
			$(".abs.imperial").css("display","table-cell");
			$(".abs.metric").css("display","none");
			$(".rel.metric").css("display","none");
			$(".rel.imperial").css("display","none");
		} else {
			$(".abs.metric").css("display","table-cell");
			$(".abs.imperial").css("display","none");
			$(".rel.metric").css("display","none");
			$(".rel.imperial").css("display","none");
		}
	}
}

function changeUnits(units) {
	var impviz = false;
	var metviz = false;
	// first approriately show imperial vs. metric
	if (units==0) {
		$(".imperial").css("display","table-cell");
		$("span.imperial").css("display","inline");
		$(".metric").css("display","none");
	} else if (units==1) {
		$(".imperial").css("display","none");
		$(".metric").css("display","table-cell");
		$("span.metric").css("display","inline");
	}

	// now check to see if we are also displaying absolute/relative speeds on this page and hide
	updateAbsolute(); 
}

// converts mysql date str YYYY-mm-dd HH:ii:ss to a new javascript Date object
function convertMysqldate(datestr) {
	var parts = datestr.trim().split(' ');
	var dateparts = parts[0].split('-');
	var timeparts = null;
	if (parts.length>1) {
		timeparts = parts[1].split(':');
	}
	return timeparts ?
		new Date(dateparts[0],dateparts[1]-1,dateparts[2],timeparts[0],timeparts[1],timeparts.length>1?timeparts[2]:0) :
		new Date(dateparts[0],dateparts[1]-1,dateparts[2]);
}

function xhrSaveUnits(units) {
    $("#busyicon").show();
    $.get( site_url + 'users/saveunits/' + units + '/', function( data ) {
    	$("#busyicon").hide();
    	$("#succmsg").fadeIn(0).fadeOut(5000);
    });
}

function xhrGetStats(startdate, finishdate, user_id) {
    startdate.setHours(0,0,0);
    finishdate.setHours(23,59,59);
    let starttime = Math.round(startdate.getTime()/1000); // javascript uses ms, but php uses s, so divide by 1000
    let finishtime = Math.round(finishdate.getTime()/1000);
    $.get( 'getstats/'+starttime+'/'+finishtime+'/'+user_id , function( data ) {
        if (data) {
            var stats = JSON.parse(data);
            $("#stats_vehicles_movingcnt").html(stats.vehicles.movingcnt);
            $("#stats_vehicles_movingcnt2").html(stats.vehicles.movingcnt);
            $("#stats_vehicles_movingcpride").html(stats.vehicles.movingcpride);
            $("#stats_vehicles_movingcpmile").html(stats.vehicles.movingcpmile);
            $("#stats_vehicles_movingcpminute").html(stats.vehicles.movingcpminute);
            $("#stats_rides_totalcnt").html(stats.rides.totalcnt);
            $("#stats_rides_totalcnt2").html(stats.rides.totalcnt);
            $("#stats_rides_totalmiles span.imperial").html(Math.round((stats.rides.totaldist-stats.rides.totaldisableddist)*0.000621371));
            $("#stats_rides_totalmiles span.metric").html(Math.round((stats.rides.totaldist-stats.rides.totaldisableddist)*0.001));
            $("#stats_rides_totaltime").html(Math.round(stats.rides.totalmoving/3600) + " hours");
            $("#stats_rides_totalavgspd span.imperial").html(toMPH(stats.rides.totalavgspeed));
            $("#stats_rides_totalavgspd span.metric").html(toKPH(stats.rides.totalavgspeed));
            $("#stats_rides_totalavgspd span.imperial.units").html("MPH");
            $("#stats_rides_totalavgspd span.metric.units").html("KPH");
        }
    });
}

// convert spd in meters per second to MPH
function toMPH(spd) {
    return Math.round(spd*10*2.23694)/10;
}
// convert spd in meters per second to KPH
function toKPH(spd) {
    return Math.round(spd*10*3.6)/10;
}

function refreshPass(startdate, finishdate, user_id) {
    $("#passstatsrow").hide();
    $("#busyrow").show();
    startdate.setHours(0,0,0);
    finishdate.setHours(23,59,59);
    let starttime = Math.round(startdate.getTime()/1000); // javascript uses ms, but php uses s, so divide by 1000
    let finishtime = Math.round(finishdate.getTime()/1000);
    $.get( 'refreshpass/'+starttime+'/'+finishtime, function( data ) {
        if (data) {
            var stats = JSON.parse(data);
            $("#processcnt").html(stats[0]);
            $("#processtotal").html(stats[1]);
            checkRideProcessing(user_id);
//            for (var i=0; i<stats.length; i++) {
//                $("#stats_pass_vcnt"+i).html(stats[i].vcnt);
//                $("#stats_pass_avgtime"+i).html(stats[i].avgpasstime + " seconds");
//                $("#stats_pass_avgapproachspd"+i).html((stats[i].avgapproachspd*2.23694).toFixed(1) + " MPH");
//                $("#stats_pass_avgpassspd"+i).html((stats[i].avgpassspd*2.23694).toFixed(1) + " MPH");
//                $("#stats_pass_avgslowamt"+i).html(((stats[i].avgapproachspd-stats[i].avgpassspd)*2.23694).toFixed(1) + " MPH");
//            }
//            $("#busyrow").hide();
//            $("#passstatsrow").show();
        } else {
        	window.location.href=site_url + 'home'; // force login
        }
    } )
}

function statsAlltime() {
    $("#dateslider").dateRangeSlider("bounds", stats_startdate, stats_finishdate);
    $("#dateslider").dateRangeSlider("values", stats_startdate, stats_finishdate);
}

// appropriate check for bounds
// update bounds if out of range (resolves some quirks in slider behavior)
function updateSlider(firstDay, lastDay) {
    firstDay.setHours(0,0,0);
    lastDay.setHours(23,59,59);
    let updatedminbound = stats_startdate;
    let updatedmaxbound = stats_finishdate;
    if (firstDay < stats_startdate) {
        updatedminbound = firstDay;
    }
    if (lastDay > stats_finishdate) {
    	updatedmaxbound = lastDay;
    }
    $("#dateslider").dateRangeSlider("bounds", updatedminbound, updatedmaxbound);
    $("#dateslider").dateRangeSlider("values", firstDay, lastDay);
}

function statsCurrentYear() {
    var date = new Date();
    var firstday = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastday = date;
    updateSlider(firstday, lastday);
}

function statsLastYear() {
    var date = new Date();
    var firstday = new Date(date.getFullYear()-1, 0, 1);
    var lastday = new Date(date.getFullYear()-1, 11, 31);
    updateSlider(firstday, lastday);
}

function statsCurrentMonth() {
    var date = new Date();
    var firstday = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastday = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    updateSlider(firstday, lastday);
}

function statsLastMonth() {
    var date = new Date();
    var firstday = new Date(date.getFullYear(), date.getMonth()-1, 1);
    var lastday = new Date(date.getFullYear(), date.getMonth(), 0);
    // handle january separately
    if (date.getMonth()==0) {
        firstday = new Date(date.getFullYear()-1, 11, 1);
        lastday = new Date(date.getFullYear()-1,11,31);
    }
    updateSlider(firstday, lastday);
}

function statsCurrentWeek() {
    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
    var firstDay = new Date(curr.setDate(first));
    var lastDay = new Date(curr.setDate(firstDay.getDate()+6));
    updateSlider(firstDay, lastDay);
}

function statsLastWeek() {
    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay() + 1 - 7; // subtract 7 to go back a week
    var firstDay = new Date(curr.setDate(first));
    var lastDay = new Date(curr.setDate(firstDay.getDate()+6));
    updateSlider(firstDay, lastDay);
}
