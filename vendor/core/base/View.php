<?php

namespace vendor\core\base;


class View
{
	/*текущий маршрут*/
	public $route = array();

	/*текущий вид*/
	public $view;

	/*текущий шаблон*/
	public $layout;

	/**
	 * View constructor.
	 * @param array $route данные роутера
	 * @param $view string вувер
	 * @param $layout string шаблон
	 */
	public function __construct(array $route, $layout = '', $view = '')
	{
		$this->route = $route;

		if($layout === false ) {
			$this->layout = false;
		} else {
			$this->layout = $layout ?: LAYOUT;
		}

		$this->view = $view;
	}


	/**
	 * Рисуем страницу
	 *
	 * @param $vars array данные для передачи во вувер.
	 */
	public function render($vars)
	{

		/*передаём данные во вувер*/
		if(is_array($vars)) extract($vars);

		$file_view  = APP . "/views/{$this->route['controller']}/{$this->view}.php";

		/*пути до включаемых областей.*/
		$includes = [
			'menu' => APP . "/views/Menu/{$this->layout}.php", // меню сайта
			'seo_metrics' => APP . "/views/Include/{$this->layout}_stats.php" // статистики (google)
		];

		ob_start();
		if(is_file($file_view)) {
			require $file_view;
		} else {
			debmes("<p>Не найден вид <b>$file_view</b></p>");
		}
		$content = ob_get_clean();

		if(false !== $this->layout) {

			$file_layout = APP . "/views/Layouts/{$this->layout}.php";

			if(is_file($file_layout)) {

				/*данныее включаемых областей*/
				$includes = $this->setIncludeFiles($includes, $vars);

				require $file_layout;

			} else {
				debmes("<p>Шаблон <b>$file_layout</b> не найден.</p>");
			}

		} else {
			echo $content;
		}
	}


	/**
	 * Подключение включаемых областей, формат:
	 *  [
	 *    'имя_области' => 'путь_до_файла',
	 *    'имя_области' => 'путь_до_файла',
	 *  ]
	 *
	 * @param array $item формат см. выше.
	 * @param array $vars переменные которые проброшены во вьюшку, к сожлаению приходится их пробрасывать(((
	 * @return array
	 */
	private function setIncludeFiles($item, $vars) {

		if(is_array($vars)) extract($vars);

		$arrFiles = [];

		foreach ($item as $name => $file) {
			ob_start();
			if(is_file($file)) {

				require $file;

			} else {
				debmes("<p>Не наёден подключаемый файл: <b>$file</b></p>");
			}
			$arrFiles[$name] = ob_get_clean();
		}

		return $arrFiles;
	}

}