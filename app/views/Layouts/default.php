<?php
/**
 * Основоной шаблон сайта.
 */
global $USER;
?>
<!DOCTYPE html>
<html>
<head>
	<title><?=empty($meta['title']) ?: $meta['title']?></title>
	<meta charset="utf-8">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<link rel="icon" type="image/ico" href="/bitrix/templates/colored_new/images/favicon/akson-favicon.ico?m=1498120539" />
	<link rel="shortcut icon" type="image/x-icon" href="/bitrix/templates/colored_new/images/favicon/akson-favicon.ico?m=1498120539" />

	<?if(!empty($meta['desc'])) {?><meta name="description" content="<?=$meta['desc']?>"><?}?>
	<?if(!empty($meta['keywords'])) {?><meta name="Keywords" content="<?=$meta['keywords']?>"><?}?>

	<?if(!empty($css) && is_array($css)) {
		foreach ($css as $style) {?>
	<link rel="stylesheet" href="<?=$style;?>">
	<?}
	}?>
</head>
<body>
	<div class="main_menu">
		<?
		/**********
		 * меню
		***********/
		echo $includes['menu']
		?>
	</div>

	<div class="header">
		
	</div>

	<div class="content">
	<?
	echo $content;
	?>
	</div>

	<div class="footer">
		
	</div>

<?if(!empty($scripts) && is_array($scripts)){
	foreach ($scripts as $script) {?>
<script type="text/javascript" src="<?=$script;?>"></script>
	<?}
}

/****************
 * Код аналитики
*****************/
echo $includes['seo_metrics'];
?>
</body>
</html>
