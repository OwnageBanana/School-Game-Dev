<?php
//required db con
require('connection.php');

//get the request variables to insert
$score = $_REQUEST['score'];
$level = $_REQUEST['level'];

//building query
$query = "
INSERT INTO scores
(
Score,
Level
)
VALUES
(".$score."
,".$level."
);
";

//insert row
mysqli_query($con, $query) or die('Error querying database.');

//close the connection
mysqli_close($con);
?>