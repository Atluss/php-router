<?php
namespace app\controllers;

use app\models\Main;

class MainController extends AppController
{

	//пример глобального переоределения шаблона
	//public $layout = 'new_layout';

	public function indexAction()
	{

		//берём данные в модель для передачи во вувёр)
		$model = new Main();

		$mainPageDataArray = $model->getMainPageData();

		$this->setMeta(
			'Главная старница' ,
			'Описание для главной страницы',
			'ключевые слова');

		$this->setCss(array(
			'/css/slick.css',
			'/css/slick-theme.css',
			'/css/mainPage.css'));

		$this->setScripts(array(
			'/js/slick.min.js',
			'/js/mainPage.js'));

		$this->addVars('mainPageDataArray', $mainPageDataArray);

		$this->setVars();

	}

	/**
	 * 404 страница
	 */
	public function error404Action() {

		$this->setMeta(
			'Страницы не существует' ,
			'',
			'');

		$this->setVars();

	}

	public function newmainpageAction() {
		//пример изменения вбювера
		$this->view = 'new_index';
		//пример изменения шаблона
		$this->layout = 'new_layout';
		//пример вывода только контента
		$this->layout = false;
	}

}