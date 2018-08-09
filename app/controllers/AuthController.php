<?php
namespace app\controllers;

class AuthController extends AppController
{

	public function indexAction() {

		$this->redirectAuthToProfile();

		$this->setScripts('/js/auth.js');
		$this->setCss('/css/auth.css');

		$this->setMeta('Авторизируйтесь', 'Форма авторизации', '');

		$this->setVars();
	}

}