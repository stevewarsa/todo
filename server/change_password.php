<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept');
header('Content-Type: application/json; charset=utf8; Accept: application/json');

$request = file_get_contents('php://input');
if (empty($request)) {
	error_log("change_password.php - may be options call - JSON request not sent - exiting");
	exit();
}
error_log("change_password.php - Here is the JSON received: ");
error_log($request);
$changePasswordParam = json_decode($request);
$uid = $changePasswordParam->uid;
$oldPassword = $changePasswordParam->oldPassword;
$newPassword = $changePasswordParam->newPassword;

error_log("change_password.php - Received data: uid=" . $uid . ", oldPassword=" . $oldPassword . ", newPassword=" . $newPassword);

$db = null;
$filename = 'db/todo_' . $uid . '.sqlite';
if (file_exists($filename)) {
	$db = new SQLite3('db/todo_' . $uid . '.sqlite');
	try {
		$results = $db->query("SELECT PASSWORD FROM USER WHERE USER_ID = '" . $uid . "'");
		$password = null;
		while ($row = $results->fetchArray()) {
			$password = $row["PASSWORD"];
			break;
		}
		if ($password == $oldPassword) {
			$statement = $db->prepare('update USER set PASSWORD = :newPassword WHERE USER_ID = :uid');
			$statement->bindValue(':newPassword', $newPassword);
			$statement->bindValue(':uid', $uid);
			$statement->bindValue(':oldPassword', $oldPassword);
			$statement->execute();
			$statement->close();
			print_r(json_encode("success"));
		} else {
			print_r(json_encode("badlogin"));
		}
		$db->close();
	} catch (Exception $e) {
		error_log("change_password.php - Error deleting TODO...  Error message: " . $e->getMessage());
		$db->close();
		print_r(json_encode("error"));
	}
} else {
	error_log("change_password.php - No database file " . $filename);
	print_r(json_encode("error|There is no database for user " . $uid));
}

?>