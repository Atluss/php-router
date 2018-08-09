<?php

namespace vendor\core\base;


abstract class Controller {

	/**@var array ррутер*/
	public $route = array();

	/**@var string текущая вьюха*/
	public $view;

	/**
	 * шаблон @var string шаблон для сайта
	*/
	public $layout;

	/**
	 * переменные для передачи во вьювер
	 * @var array
	 */
	public $vars = array();

	public function __construct($route) {
		$this->route = $route;
		$this->view = $route['action'];

	}

	/**
	 * рендерим страницу
	 */
	public function getView ()
	{
		$vObj = new View($this->route, $this->layout, $this->view);

		$vObj->render($this->vars);
	}

	/**
	 * Задаём пользовательские переменные для передачи во вьювер.
	 *
	 * @param $vars array
	 */
	public function set($vars) {
		$this->vars = $vars;
	}

}