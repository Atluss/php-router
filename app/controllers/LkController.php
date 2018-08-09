<?php
/**
 * Created by PhpStorm.
 * User: ATLUS
 * Date: 19.04.2018
 * Time: 9:50
 */

 /**Пример контроллера с несколькими страницами */

namespace app\controllers;

use app\models\Lk as LkModel;

class LkController extends AppController
{

	/**
	 * Индексная страница
	 *
	 */
	public function indexAction() {

		$this->checkAuth();
		$this->setPageProps("Главная");
		$this->setVars();

	}

	/**
	 * Настройки профиля
	*/
	public function profileAction() {

		$this->checkAuth();
		$modelData = new LkModel();
		$data = $modelData->getProfileInfo();

		foreach ($data as $key => $value) {
			$this->addVars($key, $value);
		}

		$this->setScriptsFromSide(['https://api-maps.yandex.ru/2.1.42/?lang=ru_RU']);
		$this->setPageProps("Настройки профиля","/css/lk_profile.css", ['/js/loadingFiles.js', '/js/lk_profile.js']);
		$this->setVars();
	}

	/**
	 * Мои заказы
	 *
	 */
	public function myordersAction() {

		$this->checkAuth();
		$this->setPageProps("Мои заказы", "/css/lk_myorders.css", "/js/lk_myorders.js");
		$this->setVars();
	}

	/**
	 * Установка параметров страницы, и передача нужных css/js
	 *
	 * @param string $title тайтл страницы
	 * @param bool $css
	 * @param bool $scripts
	 */
	private function setPageProps($title, $css = false, $scripts = false) {

		$this->setMeta(
			$title ,
			'Личный кабинет',
			'');

		$this->setCss($css ? $css : '/css/lk.css');
		$this->setScripts($scripts ? $scripts : "/js/lk.js");

	}
}