#!/usr/bin/env php
<?php
define("DISPLAY_INCOMING_PACKETS", false);

// $user is instance of WebSocketUser from users.php
require_once('./websockets.php');

class echoServer extends WebSocketServer {
	//protected $maxBufferSize = 1048576; //1MB... overkill for an echo server, but potentially plausible for other applications.
	protected $players = [];
	protected $gameMaster = null;
	
 	protected function process ($user, $message) {
		if (is_null($message) || $message=="") {
			return;
		} 

		try {
			$data = json_decode($message);
		} catch (Exception $e) {
			$echo->stdout($e->getMessage());
		}

		// valid json area
		if (DISPLAY_INCOMING_PACKETS) var_dump($data);
		
		// all received packets from game master
		if ($data->role == "MASTER") {
			switch ($data->type) {
		
				// update roles by status packet
				case "STATUS":
					$this->updateMaster($user);
					break;
				case "DISPLAYPLAYERS":
					$this->displayPlayers();
					break;
				case "DISPLAYMASTER":
					$this->displayMaster();
					break;
				case "DISPLAYCONNECTIONS":
					$this->displayConnections();
					break;
				case "STATUS":
					$this->updateMaster($user);
					break;
				case "QUESTION":
					$this->sendToAllExceptGameMaster($message);
					break;

			}
		} else if ($data->role == "PLAYER") {
			// all received packets from a player
			
			switch ($data->type) {
				case "STATUS":
					echo $message;
					break;
				case "REGISTERTEAM":
					$this->registerPlayer($user, $data);
					break;
			}	
		}	

	
	}
  
	protected function connected ($user) {
		// user connected...add to user (connections);
		//$this->displayConnections();
	}
  
	protected function closed ($user) {
		// Do nothing: This is where cleanup would go, in case the user had any sort of
		// open files or other objects associated with them.  This runs after the socket 
		// has been closed, so there is no need to clean up the socket itself here.
	}
	
	protected function registerPlayer($us, $dt) {
		//echo "registerPlayer";
		$userid = $us->id;
		//var_dump($dt);
		$tm = $dt->data;

		$recd = $this->sql("SELECT * FROM current_users WHERE team_name = '$tm' ORDER BY team_name");
		if (count($recd) == 0) {
			$token = bin2hex(random_bytes(128));
			// no team record...create one.
			echo "Adding new team: " . $tm . "\n";
			
			$this->sql("INSERT INTO current_users (team_name, team_token) VALUES ('$tm', '$token')");
			
			$return_data = array('name'=> $tm, 
								'token'=> $token);
			
			// create acknowlegement packet and send to player
			$return_packet = json_encode(array(	'role'=>'MASTER',
										'route'=>'PLAYER',
										'type'=>'ACKNOWLEDGEREGISTER',
										'data'=>$return_data));
				
			$this->send($us, $return_packet);

			// create team list packet and send to game master
			$this->sendTeamList();
		} 
	}
	
	protected function sendTeamList() {
		$return_data = $this->sql("SELECT * FROM current_users ORDER BY team_score DESC, team_name");

		$return_packet = json_encode(array(	'role'=>'SERVER',
									'route'=>'MASTER',
									'type'=>'TEAMLIST',
									'data'=>$return_data));			
		
		$this->sendToGameMaster($return_packet);
	}
	
	protected function updateMaster($user) {
		echo $user;
		$this->gameMaster = $user;	
		$this->displayMaster();
		$this->sendTeamList();
		
	}
	
	protected function displayPlayers() {
		echo "Players:\n";
		foreach ($this->players as $us) {
			echo "\t" . $us . "\n";
		}
		echo "==========\n\n";
	}
	
	protected function displayMaster() {
		echo "Game Master: " . $this->gameMaster . "\n";
		echo "==========\n\n";
	}	
	
	protected function displayConnections() {
		echo "Connections:\n";
		foreach ($this->users as $us) {
			//var_dump($us);
			echo "\t" . $us . "\n";
		}
		echo "==========\n\n";
	}	
	
	protected function sendToAll($msg) {
		//var_dump($this->users);
		//$fullmsg = "Message From (" . $user->id . "): " . $msg;
		
		foreach ($this->users as $us) {
			$this->send($us,  $msg);
		}
	}
	
	protected function sendToAllExceptGameMaster($msg) {
		//var_dump($this->users);
		//$fullmsg = "Message From (" . $user->id . "): " . $msg;
		$gm = $this->gameMaster;
		
		foreach ($this->users as $us) {
			if ($us->id != $gm->id) {
				$this->send($us,  $msg);
			}
		}
	}
	
	protected function sendToGameMaster($msg) {
		echo "Sent to game master: " . $msg;
		$this->send($this->gameMaster,  $msg);
	}


	protected function sql ($sql) {
		//echo "sql";
		require("creds/mysql_creds.php");
		$dbms = new PDO('mysql:host=localhost;dbname=triviamaster;charset=utf8mb4', $user, $pw);
		
		$stmt = $dbms->query($sql);
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
}		

echo 'Current PHP version: ' . phpversion() . "\n\n";

$echo = new echoServer("0.0.0.0","9000");

try {
  $echo->run();
}
catch (Exception $e) {
  $echo->stdout($e->getMessage());
}
