<?php 

$fname = $_GET['fname'];
$lname = $_GET['lname'];
$email = $_GET['email'];
$nick = $_GET['nick'];
$score = $_GET['score'];

$con=mysqli_connect("localhost","pulsar01","Apsgroup01","halloween_db");
// Check connection
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

mysqli_query($con,"INSERT INTO data_collection (first_name, last_name, email_address, score, trick_treat_name)
VALUES ($fname, $lname, $email, $score, $nick )");


echo mysqli_error($con);



mysqli_close($con);


?>