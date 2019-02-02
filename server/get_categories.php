<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf8');

$db = new SQLite3('db/todo.sqlite');
$results = $db->query('SELECT CATEGORY from CATEGORY ORDER BY CATEGORY');

$categories = array();
while ($row = $results->fetchArray()) {
	array_push($categories, $row['CATEGORY']);
}

$db->close();

print_r(json_encode($categories));

?>

