<?php 
	if (!isset($units)) {
		$units = 1;
	}
	echo changeUnitsHelper($units,false);
?>
<div id="map"></div>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBXeEisZ_I_p3Ix86eUtfUmsUvY0WpGg0c"></script>
<script src="<?php echo site_url('assets/js/mybiketraffic.js'); ?>"></script>
<script src="<?php echo site_url('assets/js/markerclusterer.js'); ?>"></script>
<script>
<?php
    if (isset($ridedata)) {
        echo addride($ridedata, $stationary, $segmentor);
    }
	if (isset($rides)) {
		foreach ($rides as $ride) {
        	$ridedata = $this->rides_model->loadridedata($ride->id, false);
			echo addride($ridedata, false, false);
		}
	}
    if (isset($segment)) {
        echo addsegment($segment->segmentdata);
    }
?>
</script>
