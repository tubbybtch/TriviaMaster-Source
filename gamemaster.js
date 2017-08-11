var socket;

$(document).ready(init);

function init() {
	var host = "ws://192.168.1.3:9000/echobot"; // SET THIS TO YOUR SERVER
	
	try {
		
		socket = new WebSocket(host);
		log('WebSocket - status '+socket.readyState);

		socket.onopen    = function(msg) { 
								log("Welcome - status "+this.readyState);
								sendStatus();	
						   };
		socket.onmessage = function(msg) { 
							   receive(msg); 
						   };
		socket.onclose   = function(msg) { 
							   log("Disconnected - status "+this.readyState); 
						   };
	}
	catch(ex){ 
		log(ex); 
	}

	$("#btnSendQuestion").click(sendQuestion);
	$("#btnSendStatus").click(sendStatus);
	$("#btnDisplayConnections").click(displayConnections);
	$("#btnDisplayPlayers").click(displayPlayers);
	$("#btnDisplayMaster").click(displayMaster);
	$("#btnSQLTest").click(sqlTest);
	$("#btnQuit").click(quit);
	$("#btnReconnect").click(reconnect);
}

function receive(rec) {
	//log(rec["data"]);
	//log(JSON.parse(rec["data"]));
	
	packet = JSON.parse(rec["data"]);
	packetData = packet.data;

	//log(packet);
	log(packetData);

	switch (packet["type"]) {
		case "TEAMLIST":
			drawTeamList(packetData);
			break
	}
		
		
		
}

function drawTeamList(teams) {
	$("#tblTeamNames > tbody").empty();
	$("#tblTeamNames > tbody").append("<tr><th>Team Name</th><th>Score</th></tr>");
	for (ix=0; ix<teams.length; ix++) {
		$("#tblTeamNames > tbody").append("<tr><td>" + teams[ix]["team_name"] + 
										"</td><td>" + teams[ix]["team_score"] +
										"</td></tr>");
		//log(teams[ix]["team_name"]);
	}
}

function sqlTest() {
	// notifies server that I am master
	statusMap = {role: "MASTER",
				route: "SERVER",
				type: "SQLTEST"
			};
	
	send(JSON.stringify(statusMap));
}

function sendStatus() {
	// notifies server that I am master
	statusMap = {role: "MASTER",
				route: "SERVER",
				type: "STATUS"
			};
	
	send(JSON.stringify(statusMap));
}

function displayConnections() {
	// asks server to display connections
	dataMap = {role: "MASTER",
				route: "SERVER",
				type: "DISPLAYCONNECTIONS"
			};
	
	send(JSON.stringify(dataMap));
}

function displayPlayers() {
	// asks server to display players
	dataMap = {role: "MASTER",
				route: "SERVER",
				type: "DISPLAYPLAYERS"
			};
	
	send(JSON.stringify(dataMap));
}

function displayMaster() {
	// asks server to display master connection
	dataMap = {role: "MASTER",
				route: "SERVER",
				type: "DISPLAYMASTER"
			};
	
	send(JSON.stringify(dataMap));
}

function sendQuestion(){

	question=	{role: "MASTER",
					route: "PLAYERS",
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

function send(data) {
	// data must be String
	log(socket);
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
	$(".btnAction").unbind("click");	

}

function reconnect() {
	quit();
	init();
}

// Utilities
function log(msg){console.log(msg); }

