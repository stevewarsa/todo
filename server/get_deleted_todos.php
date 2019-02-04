<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept');
header('Content-Type: application/json; charset=utf8; Accept: application/json');

$request = file_get_contents('php://input');
if (empty($request)) {
	error_log("get_deleted_todos.php - may be options call - JSON request not sent - exiting");
	exit();
}
error_log("get_deleted_todos.php - Here is the JSON received: ");
error_log($request);
$userParam = json_decode($request);
if (empty($userParam) || empty($userParam->uid)) {
	error_log("get_deleted_todos.php - may be options call - userParam or userParam->uid not sent - exiting");
	exit();
}
$db = null;
$filename = 'db/todo_' . $userParam->uid . '.sqlite';
if (file_exists($filename)) {
	$db = new SQLite3('db/todo_' . $userParam->uid . '.sqlite');
	$results = $db->query("SELECT ID, CATEGORY, TITLE, DESCRIPTION, STATUS, datetime(DATE_DELETED, 'localtime') AS DT_DELETED from TODO_DELETED ORDER BY DT_DELETED DESC");

	$todos = array();
	while ($row = $results->fetchArray()) {
		$todo = new stdClass;
		$todo->id = $row['ID'];
		$todo->category = $row['CATEGORY'];
		$todo->title = $row['TITLE'];
		$todo->description = $row['DESCRIPTION'];
		$todo->status = $row['STATUS'];
		$todo->dateDeleted = $row['DT_DELETED'];
		array_push($todos, $todo);
	}

	$db->close();

	print_r(json_encode($todos));
} else {
	error_log("get_deleted_todos.php - No database file " . $filename);
	print_r(json_encode("error|There is no database for user " . $userParam->uid));
}
?>

