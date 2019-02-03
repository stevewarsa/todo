<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept');
header('Content-Type: application/json; charset=utf8; Accept: application/json');

$request = file_get_contents('php://input');
if (empty($request)) {
	error_log("add_todo.php - may be options call - JSON request not sent - exiting");
	exit();
}
error_log("add_todo.php - Here is the JSON received: ");
error_log($request);
$todoParam = json_decode($request);
$todo = $todoParam->todo;
$uid = $todoParam->uid;

error_log("add_todo.php - Received data: uid=" . $uid . ", id=" . $todo->id . ", category=" . $todo->category . ", title=" . $todo->title . ", description=" . $todo->description . ", status=" . $todo->status);

// now insert this TODO
$db = null;
$filename = 'db/todo_' . $uid . '.sqlite';
if (file_exists($filename)) {
	$db = new SQLite3('db/todo_' . $uid . '.sqlite');
	try {
		$statement = $db->prepare('update TODO set CATEGORY = :category, TITLE = :title, DESCRIPTION = :description, STATUS = :status where ID = :id');
		$statement->bindValue(':id', $todo->id);
		$statement->bindValue(':category', $todo->category);
		$statement->bindValue(':title', $todo->title);
		$statement->bindValue(':description', $todo->description);
		$statement->bindValue(':status', $todo->status);
		$statement->execute();
		$statement->close();

		if ($db->changes() < 1) {
			$statement = $db->prepare("insert into TODO (CATEGORY, TITLE, DESCRIPTION, STATUS) values (:category,:title,:description,:status)");
			$statement->bindValue(':category', $todo->category);
			$statement->bindValue(':title', $todo->title);
			$statement->bindValue(':description', $todo->description);
			$statement->bindValue(':status', $todo->status);
			$statement->execute();
			$statement->close();
			
			// now get the newly generated id
			$results = $db->query('SELECT last_insert_rowid() as id');
			$id = -1;
			while ($row = $results->fetchArray()) {
				$id = $row["id"];
				break;
			}
			$todo->id = $id;
			error_log("add_todo.php - Inserted new TODO...");
		} else {
			error_log("add_todo.php - Updated TODO...");
		}
		$db->close();
		print_r(json_encode($todo));
	} catch (Exception $e) {
		error_log("add_todo.php - Error inserting or updating TODO...  Error message: " . $e->getMessage());
		$db->close();
		print_r(json_encode($todo));
	}
} else {
	error_log("add_todo.php - No database file " . $filename);
	print_r(json_encode("error|There is no database for user " . $uid));
}

?>