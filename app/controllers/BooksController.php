<?php
namespace app\controllers;
use app\models\Books;

class BooksController extends AppController
{

	public function indexAction() {

		$this->setPageProps();
		$model = new Books();

		if(!empty($this->route['alias'])) {

			$this->view = 'section';
			$categories = $model->getCategoriesKeyIDValName();

			if(!isset($categories[$this->route['alias']])) {
				$this->get404Error($this->route['alias'], "секции не существует");
			}

			$sectionID  = $categories[$this->route['alias']];

		} else {

			$categories = $model->getCategories();

		}

		$this->addVars('categories', $categories);
		$this->addVars('sectionID', $sectionID);

		$this->setVars();

	}

	function sectionAction() {

	}

	/**
	 * Т.к. вьюшек тут больше одной а код поторяется вынес в один метод
	 */
	private function setPageProps() {

		$this->setMeta(
			"Поиск книги " . ("vladimir" == TP_CITY_CODE ? "во " : "в ") . \CTPCity::GetCurrentProp('NAME2') ,
			'Описания секции',
			'');

		$this->setCss('/css/books.css');
		$this->setScripts("/js/books.js");
	}

}