<?php
namespace app\controllers;
use app\models\Order;

class BookController extends AppController
{

	public function indexAction() {

		if(empty($this->route['alias']) || !is_numeric($this->route['alias'])) {
			$this->get404Error($this->route['alias'], 'Не задан id чего то:)');
		}

		$book = intval($this->route['alias']);

		/*ещё одная проверка и если что выкидывать 404 */
		if(false)
			$this->get404Error($this->route['alias'], 'Книги не существует');

		$this->setPageProps($book['Title'], $book['Description']);

		$this->addVars('book', 123);
		$this->addVars('bookData', ['asd', ['asd', 'asd']]);

		$this->setVars();
	}


	/**
	 * устанавливаем данные для страницы
	 */
	private function setPageProps($name, $bookText) {

		$this->setMeta(
			"Книга \"{$name}\"",
			"Описание: {$bookText}",
			'');

		$this->setCss([
			'/css/slick.css',
			'/css/slick-theme.css',
			'/css/book.css'
		]);

		$this->setScriptsFromSide(['https://api-maps.yandex.ru/2.1.42/?lang=ru_RU']);

		$this->setScripts([
			'/js/slick.min.js',
			'/js/loadingFiles.js',
			"/js/book.js"
		]);
	}

}