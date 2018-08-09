<?php
namespace app\models;
use vendor\core\base\Model;

class Books extends Model
{
	/**
	 * возвращаем что то из модели
	 *
	 * @return array|bool|string
	 */
	public function getSomeThink() {
		return ['et'];

	}
}