<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept');
header('Content-Type: application/json; charset=utf8; Accept: application/json');

$request = file_get_contents('php://input');
error_log("login.php - Here is the JSON received: ");
error_log($request);
$loginParam = json_decode($request);

error_log("login.php - Received data: uid=" . $loginParam->uid . ", pwd=" . $loginParam->pwd);

// now check user against table
$db = new SQLite3('db/todo.sqlite');
try {
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
	$db->close();
	print_r(json_encode("error"));
}

?>