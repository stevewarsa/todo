<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept');
header('Content-Type: application/json; charset=utf8; Accept: application/json');

$request = file_get_contents('php://input');
error_log("delete_todo.php - Here is the JSON received: ");
error_log($request);
$todoParam = json_decode($request);
$todo = $todoParam->todo;
$uid = $todoParam->uid;

error_log("delete_todo.php - Received data: uid=" . $uid . ", id=" . $todo->id . ", category=" . $todo->category . ", title=" . $todo->title . ", description=" . $todo->description . ", status=" . $todo->status);

$db = null;
$filename = 'db/todo_' . $uid . '.sqlite';
if (file_exists($filename)) {
	$db = new SQLite3('db/todo_' . $uid . '.sqlite');
	try {
		$statement = $db->prepare('delete from TODO where ID = :id');
		$statement->bindValue(':id', $todo->id);
		$statement->execute();
		$statement->close();
		$db->close();
		print_r(json_encode("success"));
	} catch (Exception $e) {
		error_log("delete_todo.php - Error deleting TODO...  Error message: " . $e->getMessage());
		$db->close();
		print_r(json_encode("error"));
	}
} else {
	error_log("delete_todo.php - No database file " . $filename);
	print_r(json_encode("error|There is no database for user " . $uid));
}

?>