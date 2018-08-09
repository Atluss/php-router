<?php
namespace vendor\core;

use app\controllers\MainController;

class Router {

	protected static $routes = array();
	protected static $route = array();

	/**
	 * Добавляем путь в роутер
	 *
	 * @param $reqexp
	 * @param array $route
	 */
	public static function add($reqexp, $route = array()) {
		self::$routes[$reqexp] = $route;
	}

	/**
	 * берём пути
	 *
	 * @return array
	 */
	public static function getRoutes () {
		return self::$routes;
	}

	/**
	 * текущий путь
	 *
	 * @return array
	 */
	public static function getRoute () {
		return self::$route;
	}

	/**
	 * проверка пути
	 *
	 * @param $url
	 * @return bool
	 */
	public static function matchRoute ($url) {

		foreach (self::$routes as $pattern => $route) {

			if(preg_match("#$pattern#i", $url, $matches)) {

				foreach ($matches as $key=>$value) {
					if(is_string($key)) {
						$route[$key] = $value;
					}
				}

				if(!isset($route['action'])) {
					$route['action'] = 'index';
				}

				$route['controller'] = self::upperCamelCase($route['controller']);

				self::$route = $route;

				return true;

			}
		}

		return false;
	}

	/**
	 * Вызываем подходящий путь или 404 страницу
	 *
	 * @param $url
	 */
	public static function dispatch($url) {

		$url = self::removeQueryString($url);

		if(self::matchRoute($url)) {

			$controller = 'app\controllers\\' . self::upperCamelCase(self::$route['controller']) . "Controller";

			if(class_exists($controller)) {

				$cObj = new $controller(self::$route);
				$action = self::lowerCamelCase(self::$route['action']) . "Action";

				if(method_exists($cObj, $action)) {
					$cObj->$action();
					$cObj->getView();
				} else {

					self::send404Page(false, "Метод <b>$controller::$action</b> не найден");

				}

			} else {

				self::send404Page(false, "Контроллер <b>$controller</b> не найден");

			}

		} else {

			self::send404Page(false, "Нет совпадений в рутах");

		}
	}

	protected static function send404Page($alice = false, $errorMessage = false) {
		http_response_code(404);
		$cObj = new MainController(array(
			'controller' => 'Main',
			'action' => 'error404',
			'alice' => $alice,
			'error_message' => $errorMessage
		));
		$cObj->error404Action();
		$cObj->getView();
	}

	protected static function upperCamelCase($name) {
		return str_replace(" ", "", ucwords(str_replace(array("-", "_"), " ", $name)));
	}

	protected static function lowerCamelCase($name) {
		return lcfirst(self::upperCamelCase($name));
	}

	protected static function removeQueryString($url) {

		if($url) {
			$params = explode('&', $url, 2);
			if(false == strpos($params[0], '=')) {
				return rtrim($params[0], '/');
			} else {
				return '';
			}
		}
	}
}