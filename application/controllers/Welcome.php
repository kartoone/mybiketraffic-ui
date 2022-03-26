<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends BT_Controller {

    public function __construct()
    {
        parent::__construct();
	}
 	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/userguide3/general/urls.html
	 */
	public function index()
	{
		$this->load->view('templates/header');
		$this->load->view('welcome_message');
		$this->load->view('templates/footer');
	}

	// http://localhost/simple/welcome/hello 
	public function home()
	{
		$this->load->view('templates/header');
		$this->load->view('home');
		$this->load->view('templates/footer');
	}

	// http://localhost/simple/welcome/hello 
	public function hello()
	{
		$this->load->view('templates/header');
		$this->load->view('hello');
		$this->load->view('templates/footer');
	}

	// http://localhost/simple/welcome/privacy 
	public function privacy()
	{
		$this->load->view('templates/header');
		$this->load->view('privacy');
		$this->load->view('templates/footer');
	}

	// http://localhost/simple/welcome/credits 
	public function credits()
	{
		$this->load->view('templates/header');
		$this->load->view('credits');
		$this->load->view('templates/footer');
	}

	// http://localhost/simple/welcome/rides 
	public function rides() {
		$this->load->view('templates/header');
		$this->data['rides'] = unserialize(file_get_contents('ridelist.txt'));
//		ddebug($this->data['rides']);
		$this->load->view('rides',$this->data);
		$this->load->view('templates/footer');
	}

	// http://localhost/simple/welcome/rides 
	public function ridelist() {
		$this->load->view('templates/header');
		$this->data['rides'] = unserialize(file_get_contents('ridelist.txt'));
//		ddebug($this->data['rides']);
		$this->load->view('ridelist',$this->data);
		$this->load->view('templates/footer');
	}

}
