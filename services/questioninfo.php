<?php
// services for editing question info

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
	if (isset($_GET["question_id"])) {
		$qid = $_GET["question_id"];
		$sql = "SELECT * FROM questions WHERE id = $qid ORDER BY round, rank";
	} else {
		$gid = $_GET["game_id"];
		$sql = "SELECT * FROM questions WHERE game_id = $gid ORDER BY round, rank";
	}

	http_response_code(200);
	echo json_encode(sql($sql));
}

function post() {
	$cols = "";
	$vals = "";
	foreach($_POST as $key => $value){
		if (!($value == "")) {
			if ($cols === "") {
				$cols = "(" . $key;
				$vals = "(" . $value;
			} else {
			 	$cols .= "," . $key;
				$vals .= "," . $value;
			}
		}
	}
	$cols .= ")";
	$vals .= ")";
	
	$sql = "INSERT INTO questions $cols VALUES $vals";
	//echo $sql;
	http_response_code(200);
	echo json_encode(sql($sql));
}

function put() {
	$_DELETE = array();
	parse_str(file_get_contents('php://input'), $_DELETE);	
	
	$gid = $_DELETE["id"];
	
	$sets = "";
	foreach($_DELETE as $key => $value){
		if ($key != "id") {
			$sets .= "$key=$value, ";
		}
	}
	$sets = chop($sets, ", ");
	
	$sql = "UPDATE questions SET $sets WHERE id=$gid" ;

	http_response_code(200);
	echo json_encode(sql($sql));
}

function del() {
	try {
		$_DELETE = array();
		parse_str(file_get_contents('php://input'), $_DELETE);	
		$id = $_DELETE["id"];

		sql("DELETE FROM questions WHERE id=$id");
		http_response_code(200);
		echo "Question Deleted";
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