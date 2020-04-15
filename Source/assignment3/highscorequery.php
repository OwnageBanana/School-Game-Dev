

<?php
//required db con
require('connection.php');
//check con
if (!$con) {
    die('Could not connect: ' . mysqli_error($con));
}

//getting the table data for the page
mysqli_select_db($con,"score_get");
//get the top 10 scores
$query = "SELECT * FROM scores order by score desc limit 10";
$result = mysqli_query($con,$query) or die('Error querying database.');

//building the tablewith echos to return to the page
echo "<table>
<tr>
<th>Position</th>
<th>Score</th>
<th>Level</th>
</tr>";
$pos = 1;
//for each row in the data
while($row = mysqli_fetch_array($result)) {
    echo "<tr>";
    echo "<td>" . $pos . "</td>";
    echo "<td>" . $row['Score'] . "</td>";
    echo "<td>" . $row['Level'] . "</td>";
    echo "</tr>";
    $pos  = $pos + 1;
}
echo "</table>";
mysqli_close($con);
?>