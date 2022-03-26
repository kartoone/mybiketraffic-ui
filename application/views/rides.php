<style>
form {
  display:inline;
  color: red;
  background-color: red;
}
</style>
<style>
body {
  color: lightgray;
  background-color: lightgreen;
}
main{
	background-color:yellow;
}
h1 {
  color: green;
}
.scrollable {
  overflow-y: scroll;
}
</style>
<h1 style="display:inline">Your rides</h1>
<div style="display:inline;margin-left:10px;vertical-align:text-bottom"><?= anchor('rides/import','IMPORT NEW RIDES'); ?></div>
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.css">  
<script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.js"></script>
<div class="container-fluid">
	<div class="row">
		<div class="col-md-6 d-flex flex-column">
			<div class="row">
				<div class="col-md-12">
					<div style="height:360px;background-color:white">
						<div class="row">
							<div class="col-md-6">
								BIKE STATS	
							</div>
							<div class="col-md-6">
								VEHICLE STATS	
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="row scrollable flex-grow-1" style="height:600px">
				<div class="col-md-12">
					<?php 
						echo form_open('rides/multisubmit',  ['id'=>'multiform']);
					?>
					<table id="ridetable" class="table table-md compact">
					  <thead class="thead-dark">
					  	<tr>
					       	<th><?php echo form_checkbox('checkallmulti', 1, false, 'onclick="$(\'.checkall\').prop(\'checked\', $(this).prop(\'checked\'));"'); ?></th>
							<th>Datetime (TZ)</th>
					       	<th>#cars</th>
					        <th>miles</th>
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
						  <td><span class="moving"><?php echo anchor('rides/view/'.$ride->id, $ride->localtimestr); ?></span> <?php echo $videostr; ?></td>
						  <td><span class="moving"><?php echo $ride->movingcars; ?></span></td>
						  <td class="imperial" style="border-left:1px solid #000"><?php echo $ride->diststr; ?></td>
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
		<div class="col-md-6">
			MAP<br clear="all" />
		</div>
	</div>
</div>
