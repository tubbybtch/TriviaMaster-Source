#!/usr/bin/env php
<?php
// $user is instance of WebSocketUser from users.php



require_once('./websockets.php');

class echoServer extends WebSocketServer {
  //protected $maxBufferSize = 1048576; //1MB... overkill for an echo server, but potentially plausible for other applications.
  
	protected function process ($user, $message) {
		//$this->send($user,$message);
		
		$this->sendToAll($user, $message);
		
	}
  
	protected function connected ($user) {
		// Do nothing: This is just an echo server, there's no need to track the user.
		// However, if we did care about the users, we would probably have a cookie to
		// parse at this step, would be looking them up in permanent storage, etc.
		$this->addUser($user);
		$this->displayUsers();

	}
  
	protected function closed ($user) {
		// Do nothing: This is where cleanup would go, in case the user had any sort of
		// open files or other objects associated with them.  This runs after the socket 
		// has been closed, so there is no need to clean up the socket itself here.
	}
	
	protected function addUser($user) {
		// check if user exists, if not, add
		foreach ($this->users as $us) {
			if ($us->id == $user->id) {
				return;
			}
		}		
		// not in array, then add
		array_push($this->users, $user);	
	}
	
	protected function displayUsers() {

		//var_dump($this->users);

		foreach ($this->users as $us) {
			//var_dump($us);
			//var_dump($us->id);

		}
	}
	
	protected function sendToAll($user, $msg) {
		//var_dump($this->users);
		var_dump($user->id);
		$fullmsg = "Message From (" . $user->id . "): " . $msg;
		
		foreach ($this->users as $us) {
			$this->send($us,  $fullmsg);
		}
	}
}		

$echo = new echoServer("0.0.0.0","9000");

try {
  $echo->run();
}
catch (Exception $e) {
  $echo->stdout($e->getMessage());
}
