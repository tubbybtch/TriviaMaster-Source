var socket;

$(document).ready(init);

function init() {
	var host = "ws://192.168.1.3:9000/echobot"; // SET THIS TO YOUR SERVER
	
	try {
		
		socket = new WebSocket(host);
		log('WebSocket - status '+socket.readyState);

		socket.onopen    = function(msg) { 
							   log("Welcome - status "+this.readyState);
								//sendStatus();
						   };
		socket.onmessage = function(msg) { 
								receive(msg);
							   //log("Received: "+msg.data); 
						   };
		socket.onclose   = function(msg) { 
							   log("Disconnected - status "+this.readyState); 
						   };
	}
	catch(ex){ 
		log(ex); 
	}

	if ($.cookie('TeamName') != undefined) {
		$("#txtTeamName").val($.cookie('TeamName'));
	}
	
	$("#btnRegisterTeam").click(registerTeam);
	$("#txtTeamName").focus();
	$("#btnSendAnswer").click(sendAnswer);
	$("#btnSendStatus").click(sendStatus);
	$("#btnDisplayConnections").click(displayConnections);
	$("#btnDisplayPlayers").click(displayPlayers);
	$("#btnDisplayMaster").click(displayMaster);
	$("#btnQuit").click(quit);
	$("#btnReconnect").click(reconnect);
}

function registerTeam() {
	statusMap = {role: "PLAYER",
				route: "SERVER",
				type: "REGISTERTEAM",
				data: $("#txtTeamName").val()
			};
	
	send(JSON.stringify(statusMap));	
}

function submitTeamName(evt) {
	if ($("#txtTeamName").val() != "") {
		dataMap = {role: "PLAYER",
					route: "SERVER",
					type: "SUBMITTEAMNAME",
					data: $("#txtTeamName").val()
				};
		
		send(JSON.stringify(dataMap));
		$("#divTeamName").slideUp();
		$.cookie('TeamName', $("#txtTeamName").val(), {expires: 14});
	}		
}


function displayConnections() {
	// asks server to display connections
	dataMap = {role: "PLAYER",
				route: "SERVER",
				type: "DISPLAYCONNECTIONS"
			};
	
	send(JSON.stringify(dataMap));
}

function displayPlayers() {
	// asks server to display players
	dataMap = {role: "PLAYER",
				route: "SERVER",
				type: "DISPLAYPLAYERS"
			};
	
	send(JSON.stringify(dataMap));
}

function displayMaster() {
	// asks server to display master connection
	dataMap = {role: "PLAYER",
				route: "SERVER",
				type: "DISPLAYMASTER"
			};
	
	send(JSON.stringify(dataMap));
}

function sendAnswer(){

	question=	{role: "PLAYER",
					route: "MASTER",
					type: "QUESTION",
					data: {
						question: "What is the capital of Washington State?",
						guess1: "Salem",
						guess2: "Seattle",
						guess3: "Olympia",
						guess4: "Spokane"
						}
				};
	
	send(JSON.stringify(question));			
}

function sendStatus() {
	// notifies server that I am a player
	statusMap = {role: "PLAYER",
				route: "SERVER",
				type: "STATUS"
				
			};
	
	send(JSON.stringify(statusMap));
}

function receive(rec) {
	//log(rec["data"]);
	//log(JSON.parse(rec["data"]));
	
	packet = JSON.parse(rec["data"]);
	packetData = packet.data;

	//log(packetData);

	switch (packet["type"]) {
		case "QUESTION":
			$("#question").html(packetData.question);
			
			buttons = ["<input type='button' id='ans1' class='answer' value='1. " + packetData.guess1 + "'><br>",
						"<input type='button' id='ans2' class='answer' value='2. " + packetData.guess2 + "'><br>",
						"<input type='button' id='ans3' class='answer' value='3. " + packetData.guess3 + "'><br>",
						"<input type='button' id='ans4' class='answer' value='4. " + packetData.guess4 + "'>"];

			$("#answers").html(buttons);
			$(".answer").click(answerSelected);
			break;	
		case "ACKNOWLEDGEREGISTER":
			// acknowledge registration - set cookie to token and team name
			$.cookie('TeamName', packetData["name"], {expires: 14});
			$.cookie('token', packetData["token"], {expires: 14});
			
			$("#divTeamName").slideUp();
			$("#teamName").html("<h3>" + packetData["name"] + "</h3>");
			break;
	}
		
		
		
}

function answerSelected(evt) {
	$(".answer").hide();
	btnPressed = evt.target.id;
	send(btnPressed);
}

function send(data) {
	// data must be String

	try { 
		socket.send(data);
		log('Sent: '+ data);
	} catch(ex) { 
		log(ex); 
	}
}

function quit(){
	if (socket != null) {
		log("Goodbye!");
		socket.close();
		socket=null;
	}
}

function reconnect() {
	quit();
	init();
}

// Utilities
function log(msg){console.log(msg); }

