<?php
//ini_set('error_reporting', E_ALL);
// ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);

use vendor\core\Router;

$query = rtrim($_SERVER['QUERY_STRING'], '/');

define('WWW', __DIR__);
define('CORE', dirname(__DIR__) . "/vendor/core");
define('ROOT', dirname(__DIR__));
define('APP', dirname(__DIR__) . "/app");

define('LAYOUT', 'default');
define('PATH_TO_PUBLIC', str_replace($_SERVER['DOCUMENT_ROOT'], "", WWW));
define('EMBEDED_VER', '1');
define('IS_AUTH', false); // статус авторизации пользователя
define('USER_ID', IS_AUTH ? $GLOBALS['USER']->GetID() : false);
define('IS_ADMIN', false);

/*что то подключаем глобоально при аторизации пользователя*/
if(IS_AUTH) {
	
}

require_once $_SERVER['DOCUMENT_ROOT'] . '/vendor/libs/functions.php';

spl_autoload_register(function($class) {
	$file = ROOT . '/' . str_replace('\\', '/', $class) . ".php";
	if(is_file($file )) {
		require_once $file ;
	}
});

Router::add('^book/(?P<alias>[a-z-_0-9]+)$', array('controller' => 'Book', 'action' => 'index'));
/*пример использования одного рута на несколько экшенов, см. подробно в котроллере*/
Router::add('^books/(?P<alias>[a-z-_0-9]+)$', array('controller' => 'Books', 'action' => 'index'));

/*пример разбивки экшенов в рутере*/
Router::add('^article$', array('controller' => 'Article', 'action' => 'index'));
Router::add('^article/(?P<alias>[a-z-_0-9]+)$', array('controller' => 'Article', 'action' => 'section'));

/*дефолтные руты*/
Router::add('^$', array('controller' => 'Main', 'action' => 'index'));
Router::add('^(?P<controller>[a-z-_]+)/?(?P<action>[a-z-_0-9]+)?$');

Router::dispatch($query);
