<?php
// services for editing game info

if ($_SERVER["REQUEST_METHOD"] === "GET") {
	get();
} else if ($_SERVER["REQUEST_METHOD"] === "POST") {
	post();
} else if ($_SERVER["REQUEST_METHOD"] === "PUT") {
	put();	
} else if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
	del();
}

function get() {
	if (! isset($_GET["id"])) {
		// all records
		http_response_code(200);
		echo json_encode(sql("SELECT * FROM games ORDER BY game_date DESC, game_name"));
	} else {
		$id = $_GET["id"];
		http_response_code(200);
		echo json_encode(sql("SELECT * FROM games WHERE game_id = '$id' ORDER BY game_date DESC, game_name"));
	}
}

function post() {
	$gn = addslashes($_POST["game_name"]);
	$gd = $_POST["game_date"];
	$gl = addslashes($_POST["game_location"]);
	
	
	$sql = "INSERT INTO games SET game_name='$gn', game_date='$gd', game_location='$gl'";

	sql($sql);
	http_response_code(200);
	echo "Saved Succesfully!";
}

function put() {
	$_PUT = array();
	parse_str(file_get_contents('php://input'), $_PUT);	
		
	$id = $_PUT["game_id"];
	$gn = $_PUT["game_name"];
	$gd = $_PUT["game_date"];
	$gl = $_PUT["game_location"];
	
	
	sql("UPDATE games SET game_name='$gn', game_date='$gd', game_location='$gl' WHERE game_id=$id");

}

function del() {
	try {
		$_DELETE = array();
		parse_str(file_get_contents('php://input'), $_DELETE);	
		$id = $_DELETE["game_id"];

		sql("DELETE FROM games WHERE game_id=$id");
		http_response_code(200);
		echo "Game Deleted";
	} catch (Exception $e) {
		http_response_code(400);
		echo "Couldn't Delete...";
	}
}


function sql ($sql) {
	//echo "sql";
	require("../creds/mysql_creds.php");
	
	try {
		$dbms = new PDO('mysql:host=localhost;dbname=triviamaster;charset=utf8mb4', $user, $pw);
	
		$stmt = $dbms->query($sql);
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	} catch (Exception $e) {
		echo $e->getMessage();
	}
}
?>