<style>
form {
  display:inline;
  color: white;
}
</style>
<style>
body{
	background-color: #6997ab;
}
main{
	color: black;
	background-color: #6997ab;
}
h3 {
  color: black;
}
.scrollable {
  overflow-y: scroll;
}
</style>
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.css">  
<script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.js"></script>
<div class="container-fluid">
	<div class="row justify-content-md-center">
		<div class="col-md-6 d-flex flex-column" style="margin:50px;border-radius: 50px;background: #6997ab;box-shadow: inset 20px 20px 60px #598091,inset -20px -20px 60px #79aec5;">
			<div class="row">
				<div class="col-md-12">
					<div style="height:500px;">
						<div class="row justify-content-md-center">
							<div class="col-md-3 center"style="margin-right: 50px;margin-top: 50px;height:400px;border-radius: 50px;background: #6997ab;box-shadow:  20px 20px 60px #598091,-20px -20px 60px #79aec5;">
							<div class="container">
    							<ul class="nav nav-tabs">
    								<li class="active"><a href="#">Bike Stats(TAB)</a></li>
    								<li><a href="#">Car Stats(TAB)</a></li>
  								</ul>
							</div>
								subhead 
								<br>
								Bike Icon image 
								<br>	
								average speed:     13.62 
								<br>
								total miles:       45
								<br>
								<br>
								subhead 
								<br>
								Vehicle Icon image
								<br>
								per min:     0.7 
								<br>
								per miles:   3.3 
								<br>
								total:       65
							</div>
							<div>
							<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26629.495750413756!2d-86.82588801001114!3d33.45746111760029!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8889193f37ce0795%3A0xe74c32794bbfc294!2sHomewood%2C%20AL!5e0!3m2!1sen!2sus!4v1648786754729!5m2!1sen!2sus" 
								width="800" height="400" style="margin-top: 50px;border-radius:50px;background #6997ab;box-shadow:  20px 20px 60px #598091,-20px -20px 60px #79aec5;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="container-fluid">
	<div class="row justify-content-md-center">
		<div class="col-md-6 d-flex flex-column">
			<div class="row scrollable flex-grow-1" style="height:550px;border-radius: border-radius: 50px;background: #6997ab;box-shadow:  20px 20px 60px #598091,-20px -20px 60px #79aec5;">
				<div class="col-md-12">
					<?php 
						echo form_open('rides/multisubmit',  ['id'=>'multiform']);
					?>
					<table id="ridetable" class="table table-md compact;table table-hover">
					  <thead class="">
					  	<tr>
							<th>Datetime (TZ)</th>
					       	<th>#cars</th>
					        <th>miles</th>
							<th><button>Share rides</button></th>
					    </tr>
					  </thead>
					  <tbody>
						<?php foreach ($rides as $ride): ?>
						<?php 
						    $videostr = '[ ';
						    $i=0;
						    if ($ride->videos) {
						      $vid = end($ride->videos);
						      $videostr .= anchor("uploads/{$ride->user_id}/{$ride->id}.sm/{$vid->virbvideo}.mp4", "video", ['target'=>'_blank']) . ' ';
						    }
						    $videostr .= ']';
						?>
						<tr>
						  
						  <td><span class="moving"><?php echo anchor('https://mybiketraffic.com/rides/view/'.$ride->id, $ride->localtimestr); ?></span> <?php echo $videostr; ?></td>
						  <td><span class="moving"><?php echo $ride->movingcars; ?></span></td>
						  <td class="imperial" style="border-left:2px solid #000"><?php echo $ride->diststr; ?></td>
						</tr>
						<?php endforeach; ?>
						</tbody>
					</table>
					<?php
						echo form_close();
					?>
				</div>
			</div>
		</div>
	</div>
</div>
