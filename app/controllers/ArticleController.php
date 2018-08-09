<?php

namespace app\controllers;
use app\models\Article;

class ArticleController extends AppController
{

	/**
	 * Гл. страница листинга статей, если передан алис то включается другой вьювер.
	 */
	public function indexAction() {

		/* пример изменения экшена в экшене
		  if(!empty($this->route['alias'])) {
			//меняем страницу для отображаения листинга а не категорий
			$this->route['action'] = "section";
		}*/

		$this->setPageProps();
		$model = new Executers();

		$this->addVars('categories', $model->getCategories());
		$this->setVars();
	}


	/**
	 * Старница с листингами в категории
	 */
	public function sectionAction() {

		if(empty($this->route['alias'])) {
			$this->get404Error($this->route['alias'], "Не задан код секции");
		}

		$model = new Executers();
		$categories = $model->getCategoriesKeyIDValName();

		if(!isset($categories[$this->route['alias']])) {
			$this->get404Error($this->route['alias'],"Секции не существует.");
		}

		$this->setPageProps();
		$this->addVars('sectionID', $categories[$this->route['alias']]);
		$this->setVars();
	}

	/**
	 * Т.к. вьюшек тут больше одной а код поторяется вынес в один метод
	 */
	private function setPageProps() {

		$this->setMeta(
			"Статьи " ,
			'Статьи на сайте',
			'');

		$this->setCss('/css/article.css');
		$this->setScripts("/js/article.js");
	}

}