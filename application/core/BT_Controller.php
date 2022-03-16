<?php
class BT_Controller extends CI_Controller
{
    // let's create a common data attribute
    protected $data = [];
    
    public function __construct()
    {
        parent::__construct();
        $this->load->helper('html');
        $this->load->helper('url');
        $this->load->helper('form');
        $this->load->library('form_validation');
    }
    
}
