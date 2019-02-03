<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf8');

function newest($a, $b) { 
    return filemtime($b) - filemtime($a); 
} 

$userArray = array();
$files = glob('db/todo_*');
uasort($files, "newest"); 
foreach ($files as $file) {
	$fname = basename($file);
	if ($fname == 'todo_.sqlite' || $fname == 'todo_template.sqlite' || $fname == 'todo_template.sqlite.old' || $fname == 'todo_template.sqlite.bak') {
		continue;
	}
	$parts = explode("_", $fname);
	$userName = explode(".sqlite", $parts[1]);
	array_push($userArray, $userName[0]);
}

print_r(json_encode($userArray));

?>