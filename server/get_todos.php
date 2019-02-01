<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf8');

$db = new SQLite3('db/todo.sqlite');
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

?>

