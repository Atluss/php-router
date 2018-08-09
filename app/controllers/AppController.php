<?php
namespace app\controllers;
use vendor\core\base\Controller;
use app\models\App as AppClass;

/**
 * Класс помошник для котроллеров.
*/
class AppController extends Controller
{

	/**тайтл, деск, и киворд @var array*/
	public $meta = array();
	/**Скрипты для подключения для страницы @var array*/
	public $scripts = array();
	/**css для подклю на странице @var array*/
	public $css = array();

	/**переменные для передачи во вьюшку*/
	public $variables = array();

	/**
	 * AppController constructor.
	 * @param $route
	 */
	public function __construct($route)
	{
		parent::__construct($route);

		//задаём дефолтные стили
		$this->css = [
			$this->getFilePathEmbedded("/css/fonts.css"),
			$this->getFilePathEmbedded("/css/style.css"),
			$this->getFilePathEmbedded("/css/style_def.css")
		];

		//задаём дефолтные js
		$this->scripts = [
			$this->getFilePathEmbedded("/js/jquery-3.3.1.min.js"),
			$this->getFilePathEmbedded("/js/inputmask/jquery.inputmask.bundle.min.js"),
			$this->getFilePathEmbedded("/js/main.js")
		];
	}


	/**
	 * пополнения мета инф. на странице
	 *
	 * @param string $title
	 * @param string $desc
	 * @param string $keywords
	 */
	protected function setMeta($title = '', $desc = '', $keywords = '') {

		if(!empty($title))
			$this->meta['title'] = $title;
		
		if(!empty($desc))
			$this->meta['desc'] = $desc;

		if(!empty($keywords))
			$this->meta['keywords'] = $keywords;
	}

	/**
	 * пополняем наш массив скриптов
	 *
	 * @param string|array $script путь до скрипта
	 */
	protected function setScripts($script) {
		if(is_array($script)) {
			foreach ($script as $scr)
				$this->scripts[] = $this->getFilePathEmbedded($scr);
		} else {
			$this->scripts[] = $this->getFilePathEmbedded($script);
		}
	}

	/**
	 * Добавление скриптов с других сайтов например яндекс карты.
	 *
	 * @param $script
	 */
	protected function setScriptsFromSide($script) {
		if(is_array($script)) {
			foreach ($script as $scr)
				array_unshift($this->scripts, $scr);
		} else {
			array_unshift($this->scripts, $script);
		}
	}

	/**
	 * пополняем наш массив css
	 *
	 * @param string|array $css путь до css
	 */
	protected function setCss($css) {
		if(is_array($css)) {
			foreach ($css as $cs)
				$this->css[] = $this->getFilePathEmbedded($cs);
		} else {
			$this->css[] = $this->getFilePathEmbedded($css);
		}

	}

	/**
	 * файл штамп встриваемого файл html
	 *
	 * @param $path
	 * @return string
	 */
	private function getFilePathEmbedded($path) {

		$fullPath = WWW . $path;
		$publicPath = PATH_TO_PUBLIC . $path . '?';

		return is_file($fullPath) ? $publicPath . filemtime($fullPath) : $publicPath . EMBEDED_VER;

	}

	/**
	 * Отдача 404 ошибки
	 *
	 * @param mixed $alice параметры для страницы 404
	 * @param mixed $errorMessage
	 */
	protected function get404Error($alice = false, $errorMessage = false) {

		http_response_code(404);
		$cObj = new MainController(array(
			'controller' => 'Main',
			'action' => 'error404',
			'alice' => $alice,
			'error_message'	=> $errorMessage
			)
		);
		$cObj->error404Action();
		$cObj->getView();
		exit();

	}

	/**
	 * Если авторизации нет то выдаем формы авторизации
	 */
	protected function checkAuth() {
		if(!IS_AUTH) {
			$this->getAuthController($this->route['alias'], 'Пользователь не авторизован');
		}
	}

	/**
	 * Редирект с формы авторизации или регистрации
	 *
	 * @param bool $alice
	 * @param bool $errorMessage
	 */
	protected function redirectAuthToProfile($alice = false, $errorMessage = false) {
		if(IS_AUTH) {
			http_response_code(300);
			/*$cObj = new LkController(array(
					'controller' => 'Lk',
					'action' => 'index',
					'alice' => $alice,
					'error_message'	=> $errorMessage
				)
			);
			$cObj->indexAction();
			$cObj->getView();*/
			header('Location: /masters/lk/');
			exit();
		}
	}

	/**
	 * Выводим форму авторизации
	 *
	 * @param mixed $alice алис вызванной страницы
	 * @param mixed $errorMessage какой нибудь нибудь лог
	 */
	protected function getAuthController($alice = false, $errorMessage = false) {

		http_response_code(401);
		$cObj = new AuthController(array(
				'controller' => 'Auth',
				'action' => 'index',
				'alice' => $alice,
				'error_message'	=> $errorMessage
			)
		);
		$cObj->indexAction();
		$cObj->getView();
		exit();
	}

	/**
	 * Добавление переменной в массив для передачи во вьюшку
	 *
	 * @param $varName
	 * @param $varValue
	 */
	protected function addVars($varName, $varValue) {
		$this->variables[$varName] = $varValue;
	}

	/**
	 * Передаем значение во вьюшку и тут же проверяем если пользовать авторизован, то пишем значения кол-ва сообщений.
	 */
	protected function setVars() {

		$this->addToVarsRouteMetaCssScripts();

		if(IS_AUTH) {
			$this->variables['lk_counts_menu'] = AppClass::getUserMessagesCounts();
		}

		$this->set($this->variables);
	}

	protected function addToVarsRouteMetaCssScripts() {
		$this->addVars('route', $this->route);
		$this->addVars('scripts', $this->scripts);
		$this->addVars('css', $this->css);
		$this->addVars('meta', $this->meta);
	}
}