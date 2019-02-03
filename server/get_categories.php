<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept');
header('Content-Type: application/json; charset=utf8; Accept: application/json');

$request = file_get_contents('php://input');
error_log("get_categories.php - Here is the JSON received: ");
error_log($request);
$userParam = json_decode($request);
$uid = $userParam->uid;

error_log("get_categories.php - Received data: uid=" . $uid);
$db = null;
$filename = 'db/todo_' . $uid . '.sqlite';
if (file_exists($filename)) {
	$db = new SQLite3('db/todo_' . $uid . '.sqlite');
	$results = $db->query('SELECT CATEGORY from CATEGORY ORDER BY CATEGORY');

	$categories = array();
	while ($row = $results->fetchArray()) {
		array_push($categories, $row['CATEGORY']);
	}

	$db->close();

	print_r(json_encode($categories));
} else {
	error_log("get_categories.php - No database file " . $filename);
	print_r(json_encode("error|There is no database for user " . $uid));
}
?>

