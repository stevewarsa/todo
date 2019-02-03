<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept');
header('Content-Type: application/json; charset=utf8; Accept: application/json');

$request = file_get_contents('php://input');
if (empty($request)) {
	error_log("login.php - may be options call - JSON request not sent - exiting");
	exit();
}
error_log("login.php - Here is the JSON received: ");
error_log($request);
$loginParam = json_decode($request);

error_log("login.php - Received data: uid=" . $loginParam->uid . ", pwd=" . $loginParam->pwd);

$filename = 'db/todo_' . $loginParam->uid . '.sqlite';
if (file_exists($filename)) {
	$db = null;
	try {
		$db = new SQLite3($filename);
		$results = $db->query("SELECT PASSWORD FROM USER WHERE USER_ID = '" . $loginParam->uid . "'");
		$password = null;
		while ($row = $results->fetchArray()) {
			$password = $row["PASSWORD"];
			break;
		}
		$db->close();
		if ($password == $loginParam->pwd) {
			print_r(json_encode("success"));
		} else {
			print_r(json_encode("badlogin"));
		}
	} catch (Exception $e) {
		error_log("login.php - Error querying user information...  Error message: " . $e->getMessage());
		if ($db != null) {
			$db->close();
		}
		print_r(json_encode("error|Error querying user information..."));
	}
} else {
	$db = null;
	try {
		error_log("login.php - The file " . $filename . " does not exist, copying template to create new database.");
		if (!copy('db/todo_template.sqlite', 'db/todo_' . $loginParam->uid . '.sqlite')) {
			error_log("login.php - failed to copy file...");
			print_r(json_encode("error|Unable to copy template database to make new database for " . $loginParam->uid . "..."));
		} else {
			$db = new SQLite3('db/todo_' . $loginParam->uid . '.sqlite');
			$statement = $db->prepare("insert into USER (USER_ID, PASSWORD) values (:uid,:pwd)");
			$statement->bindValue(':uid', $loginParam->uid);
			$statement->bindValue(':pwd', $loginParam->pwd);
			$statement->execute();
			$statement->close();
			$db->close();
			print_r(json_encode("success"));
		}
	} catch (Exception $ex) {
		error_log("login.php - Error while copying template db to another db...  Error message: " . $e->getMessage());
		if ($db != null) {
			$db->close();
		}
		print_r(json_encode("error|Error while creating and initializing new user databse for " . $loginParam->uid . "..."));
	}
}

?>