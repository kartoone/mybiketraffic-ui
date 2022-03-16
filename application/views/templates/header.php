<?php
defined('BASEPATH') or exit('No direct script access allowed');
?><!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>MyBikeTraffic.com<?php echo isset($title)?' '.$title:'';?></title>

    <!-- Custom styles for this template -->
    <link href="<?php echo site_url('assets/css/default.css'); ?>" rel="stylesheet">

    <!-- Bootstrap core CSS -->
    <link href="<?php echo site_url('assets/css/bootstrap.min.css'); ?>" rel="stylesheet">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">

    <link href="<?php echo site_url('assets/css/iThing-min.css'); ?>" rel="stylesheet">

    <!-- Need to make sure jquery is loaded before maps -->
    <!-- <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script> -->
    <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js"></script>
    <script src="<?php echo site_url('assets/js/jQRangeSlider-min.js'); ?>"></script>
    <script src="<?php echo site_url('assets/js/popper.min.js'); ?>"></script>
    <script src="<?php echo site_url('assets/js/bootstrap.min.js'); ?>"></script>
    
	<script type="text/javascript">
		var site_url = "<?php echo site_url(''); ?>";
	</script>
    <style>
      .stationary { display:none; }
    </style>
  </head>

  <body>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark">
      <a class="navbar-brand" href="<?php echo site_url(''); ?>"><img src="<?php echo site_url('/assets/img/m3.png'); ?>" width="30" height="30" style="margin-bottom:5px;margin-right:10px" />MyBikeTraffic.com</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsMainMenuYo" aria-controls="navbarsMainMenuYo" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

  <?php
  $homeactive = $this->uri->segment(1)=='home' ? 'active' : '';
  $aboutactive = $this->uri->segment(1)=='about' ? 'active' : '';
  $exampleactive = $this->uri->segment(1)=='example' ? 'active' : ''; '';
  $youractive = '';
  $importactive = '';
  $segmentsactive = '';
  if ($this->uri->segment(1)=='rides') {
    $exampleactive = $this->uri->segment(2)=='public' ? 'active' : '';
    $importactive = $this->uri->segment(2)=='import' ? 'active' : '';
    $otheractive = $this->uri->segment(2)=='attachvideo'||$this->uri->segment(2)=='view';
    $youractive = (!$exampleactive && !$importactive && !$otheractive) ? 'active' : '';
  } else if ($this->uri->segment(1)=='users') {
    $exampleactive = $this->uri->segment(2)=='public' ? 'active' : '';
  } else if ($this->uri->segment(1)=='segments') {
    $segmentsactive = 'active';
  }
  ?>
      <div class="collapse navbar-collapse" id="navbarsMainMenuYo">
        <ul class="navbar-nav mr-auto" style="line-height:25px">
          <li class="nav-item <?php echo $homeactive; ?>">
            <a class="nav-link" href="<?php echo site_url('home/'); ?>">Home <span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item <?php echo $aboutactive; ?>">
            <a class="nav-link" href="<?php echo site_url('about/'); ?>">About</a>
          </li>
          <li class="nav-item <?php echo $youractive; ?>">
            <a class="nav-link" href="<?php echo site_url('rides/'); ?>">Your&nbsp;Rides</a>
          </li>
          <li class="nav-item <?php echo $exampleactive; ?>">
            <a class="nav-link" href="<?php echo site_url('example/'); ?>">Data</a>
          </li>
          <li class="nav-item <?php echo $segmentsactive; ?>">
            <a class="nav-link" href="<?php echo site_url('segments/'); ?>">Segment&nbsp;Stats</a>
          </li>
          <li class="nav-item <?php echo $importactive; ?>">
            <a class="nav-link" href="<?php echo site_url('rides/import'); ?>">Import</a>
          </li>
          <li>
          	<a class="nav-link" href="<?php echo site_url('donate'); ?>"><img src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" alt="Donate" title="Learn more about making a donation to this project" /> </a>
          </li>
        </ul>
        <div style="color:white">
        </div>
        <!-- <form class="form-inline my-2 my-lg-0">
          <input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form> -->
      </div>
    </nav>
    <main role="main" class="container" style="max-width:100%">
