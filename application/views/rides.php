<style>
form {
  display:inline;
  color: white;
  background-color: yellow;
}
</style>
<style>
body {
  color: yellow;
  background-color: lightgreen; 
}
main{
	color: black;
	background-color:white;
}
h1 {
  color: black;
}
.scrollable {
  overflow-y: scroll;
}
</style>
<h1 style="display:inline">Your Rides</h1>
<button>Share rides</button>
<div class="btn btn-default" style="display:inline;margin-left:10px;vertical-align:text-bottom"><?= anchor('rides/import','IMPORT NEW RIDES'); ?></div>
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.css">  
<script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.js"></script>
<div class="container-fluid">
	<div class="row">
		<div class="col-md-6 d-flex flex-column">
			<div class="row">
				<div class="col-md-12">
					<div style="height:700px;">
						<div class="row">
							<div class="col-md-6 center" style="border-radius: 12px;background: linear-gradient(315deg, #cacaca, #f0f0f0);box-shadow:  -8px -8px 10px #bebebe,8px 8px 10px #ffffff;">
								BIKE STATS	<br>
								subhead <br>
								Bike Icon image
							</div>
							<div class="col-md-6 center"style="border-radius: 12px;background: linear-gradient(315deg, #cacaca, #f0f0f0);box-shadow:  -8px -8px 10px #bebebe,8px 8px 10px #ffffff;">
								VEHICLE STATS <br>
								subhead <br>
								Vehicle Icon image
									<div>
									<i class="fa-solid fa-bicycle"></i>
									</div>
							</div>
							<div class="col-md-6 center"style="height:600px;border-radius: 30px;background: linear-gradient(315deg, #cacaca, #f0f0f0);box-shadow:  -8px -8px 8px #bebebe,8px 8px 8px #ffffff;">
								average speed:     13.62 <br>
								total miles:       45
							</div>
							<div class="col-md-6 center"style="height:600px;border-radius: 30px;background: linear-gradient(315deg, #cacaca, #f0f0f0);box-shadow:  -8px -8px 8px #bebebe,8px 8px 8px #ffffff;">
								per min:     0.7 <br>
								per miles:   3.3 <br>
								total:       65
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="row scrollable flex-grow-1" style="height:400px;border-radius: 30px;background: linear-gradient(315deg, #cacaca, #f0f0f0);box-shadow:  -8px -8px 16px #bebebe,8px 8px 16px #ffffff;">
				<div class="col-md-12">
					<?php 
						echo form_open('rides/multisubmit',  ['id'=>'multiform']);
					?>
					<table id="ridetable" class="table table-md compact">
					  <thead class="">
					  	<tr>
					       	<th><?php echo form_checkbox('checkallmulti', 1, false, 'onclick="$(\'.checkall\').prop(\'checked\', $(this).prop(\'checked\'));"'); ?></th>
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
						  <td><?php echo form_checkbox(['name'=>'checkall[]','value'=>$ride->id,'checked'=>false,'class'=>'checkall']); ?></td>
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
			<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26629.495750413756!2d-86.82588801001114!3d33.45746111760029!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8889193f37ce0795%3A0xe74c32794bbfc294!2sHomewood%2C%20AL!5e0!3m2!1sen!2sus!4v1648786754729!5m2!1sen!2sus" width="700" height="1100" style="border-radius: 30px;background: linear-gradient(315deg, #cacaca, #f0f0f0);box-shadow:  -8px -8px 16px #bebebe,14px 14px 28px #ffffff;;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
		</div>
			</div>
	</div>
</div>


