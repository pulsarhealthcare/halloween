<?php
$request = $_GET['request'];

$con = mysqli_connect("localhost", "pulsar01", "Apsgroup01", "halloween_db");

if ($_GET['request'] === 'store') {

    $fName = $_GET['fname'];
    $lName = $_GET['lname'];
    $email = $_GET['email'];
    $nick = $_GET['nick'];
    $score = $_GET['score'];
    
    // Check connection
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }
    
    mysqli_query($con, "INSERT INTO data_collection (first_name, last_name, email_address, score, trick_treat_name)
    VALUES ('$fName', '$lName', '$email', '$score', '$nick' )");
} else if ($_GET['request'] === 'getscores') {
    
    $result = mysqli_query($con, " SELECT * FROM data_collection ORDER BY score DESC LIMIT 5");
    
    while ($row = mysqli_fetch_array($result)) {
        echo $row['first_name'] . " " . $row['last_name'] . "-" . $row['score'];
        echo "<br>";
    }
}
mysqli_close($con);
?>