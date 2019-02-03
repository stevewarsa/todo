<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept');
header('Content-Type: application/json; charset=utf8; Accept: application/json');

$request = file_get_contents('php://input');
error_log("get_todos.php - Here is the JSON received: ");
error_log($request);
$userParam = json_decode($request);
$db = null;
$filename = 'db/todo_' . $loginParam->uid . '.sqlite';
if (file_exists($filename)) {
	$db = new SQLite3('db/todo_' . $userParam->uid . '.sqlite');
	$results = $db->query('SELECT ID, CATEGORY, TITLE, DESCRIPTION, STATUS from TODO ORDER BY ID');

	$todos = array();
	while ($row = $results->fetchArray()) {
		$todo = new stdClass;
		$todo->id = $row['ID'];
		$todo->category = $row['CATEGORY'];
		$todo->title = $row['TITLE'];
		$todo->description = $row['DESCRIPTION'];
		$todo->status = $row['STATUS'];
		array_push($todos, $todo);
	}

	$db->close();

	print_r(json_encode($todos));
} else {
	error_log("get_todos.php - No database file " . $filename);
	print_r(json_encode("error|There is no database for user " . $loginParam->uid));
}
?>

