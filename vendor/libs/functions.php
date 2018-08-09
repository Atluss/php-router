<?php

/**
 * То место где творится магия
 *
 * @param $errno
 * @param $msg
 * @param $file
 * @param $line
 */
function myErrorHandler($errno, $msg, $file, $line)
{
	//set_error_handler("myErrorHandler", E_ALL);
	//restore_error_handler();
	if(IS_ADMIN) {
		$file = str_replace($_SERVER['DOCUMENT_ROOT'], '', $file);
		echo '<div style="border: 2px inset;background: #990000;color: #fff; font-size: 12px; padding: 5px; box-sizing: border-box; word-wrap: break-word">';
		echo "Произошла ошибка с кодом ".FriendlyErrorType($errno)." <b>($errno)</b>!<br />";
		echo "Файл: <span>$file</span><br />Строка: $line<br />";
		echo "Текст ошибки: <i>$msg</i>";
		echo "</div>";
	}
}

/**
 * Название константы ошибок
 *
 * @param $type
 * @return string
 */
function FriendlyErrorType($type)
{
	switch($type)
	{
		case E_ERROR: // 1 //
			return 'E_ERROR';
		case E_WARNING: // 2 //
			return 'E_WARNING';
		case E_PARSE: // 4 //
			return 'E_PARSE';
		case E_NOTICE: // 8 //
			return 'E_NOTICE';
		case E_CORE_ERROR: // 16 //
			return 'E_CORE_ERROR';
		case E_CORE_WARNING: // 32 //
			return 'E_CORE_WARNING';
		case E_COMPILE_ERROR: // 64 //
			return 'E_COMPILE_ERROR';
		case E_COMPILE_WARNING: // 128 //
			return 'E_COMPILE_WARNING';
		case E_USER_ERROR: // 256 //
			return 'E_USER_ERROR';
		case E_USER_WARNING: // 512 //
			return 'E_USER_WARNING';
		case E_USER_NOTICE: // 1024 //
			return 'E_USER_NOTICE';
		case E_STRICT: // 2048 //
			return 'E_STRICT';
		case E_RECOVERABLE_ERROR: // 4096 //
			return 'E_RECOVERABLE_ERROR';
		case E_DEPRECATED: // 8192 //
			return 'E_DEPRECATED';
		case E_USER_DEPRECATED: // 16384 //
			return 'E_USER_DEPRECATED';
		case E_ALL: // 32767 //
			return "E_ALL";
	}
	return "";
}