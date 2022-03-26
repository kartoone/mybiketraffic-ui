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
	<div class="row" style="height:100vh;">
		<div class="col-md-6">
			<div class="row">
				<div class="col-md-6">
					STATS
				</div>
			</div>
			<div class="row">
				<div class="col-md-6">
					<?php 
						echo form_open('rides/multisubmit',  ['id'=>'multiform']);
					?>
					<table id="ridetable" class="table table-md compact">
					  <thead class="thead-dark">
					      <tr>
					        <th>&nbsp;</th>
					        <th>&nbsp;</th>
					        <th colspan="3">VEHICLE STATS</th>
					        <th colspan="6" style="border-left:1px solid #000">RIDE STATS</th>
					        <th>&nbsp;</th>
					        </tr>
					        <tr>
					        <th><?php echo form_checkbox('checkallmulti', 1, false, 'onclick="$(\'.checkall\').prop(\'checked\', $(this).prop(\'checked\'));"'); ?></th>
							    <th>Datetime (TZ)</th>
					        <th>Total</th>
					        <th class="imperial">per mile</th>
					        <th class="metric">per km</th>
					        <th>per minute</th>
					        <th class="imperial" style="border-left:0px solid #000">Miles</th>
					        <th class="metric" style="border-left:0px solid #000">Kms</th>
					        <th class="imperial">Disabled <br />(miles)</th>
					        <th class="metric">Disabled <br />(kms)</th>
					        <th>Moving time<br />(minutes)</th>
					        <th>Disabled <br />(minutes)</th>
					        <th class="imperial">Avg speed<br />(mph)</th>
							    <th class="metric">Avg speed<br />(kph)</th>
					        <th>Action</th>
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
					  <td></span><span class="moving"><?php echo $ride->movingcars; ?></span></td>
					  <td class="imperial"></span><span class="moving"><?php echo $ride->movingcpmile; ?></span></td>
					  <td class="metric"><span class="moving"><?php echo $ride->movingcpkm; ?></span></td>
					  <td><span class="moving"><?php echo $ride->movingcpminute; ?></span></td>
					  <td class="imperial" style="border-left:1px solid #000"><?php echo $ride->diststr; ?></td>
					  <td class="metric" style="border-left:1px solid #000"><?php echo $ride->diststrkm; ?></td>
					  <td class="imperial"><?php echo $ride->disableddist; ?></td>
					  <td class="metric"><?php echo $ride->disableddistkms; ?></td>
					  <td><?php echo $ride->movingstr; ?></td>
					  <td><?php echo $ride->disabledstr; ?></td>
					  <td class="imperial"><?php echo $ride->speedstr; ?></td>
					  <td class="metric"><?php echo $ride->speedstrkph; ?></td>
					  <td>
					      <?php
					            echo anchor("rides/delete/{$ride->id}", img("assets/img/redx.gif") . '&nbsp;', ['title'=>'delete ride','onclick'=>"return confirm('Are you sure you want to delete this ride?');"]);
					            echo ' | ';
					            echo anchor("rides/attachvideo/{$ride->id}", "&nbsp;&#128249;", ['title'=>'attach video']);
					            echo ' | ';
					            echo anchor("rides/refreshcars/{$ride->id}", "&nbsp;&#128663;", ['title'=>'refresh car count']);
					            echo ' | ';
					            echo anchor("rides/segmentor/{$ride->id}", "&sect;", ['title'=>'create segment']);
					            if ($ride->private == 1) {
					                echo ' | ';
					                echo anchor("rides/makepublic/{$ride->id}", "&nbsp;&#128274;", ['title'=>'make ride public']);
					            } else {
					                echo ' | ';
					                echo anchor("rides/makeprivate/{$ride->id}", "&nbsp;&#128275;", ['title'=>'make ride private']);
					            }
					      ?>
					  </td>
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
		<div class="col-md-6" style="height:100vh">
			MAP<br clear="all" />
		</div>
	</div>
</div>
