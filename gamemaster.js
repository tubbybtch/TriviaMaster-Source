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
	
	$.get("services/gameinfo.php",populateGameTable,{},"JSON");
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

function populateGameTable(data) {
	$("#tblGames > tbody").empty();
	$("#tblGames > tbody").append("<tr><th>Date</th><th>Name</th><th>Location</th><th>Play Game</th></tr>");
	for (ix=0; ix<data.length; ix++) {
		var g_id = data[ix]["game_id"];
		//playButton = "<input type='button' value='Edit' data-id='" + g_id + "' class='btnEdit'>";
		playButton = "<img src='./images/play.png'  alt='Play this game' value='Play' data-id='" + g_id + "' class='btnPlay' width='64' height='64'>";

		$("#tblGames > tbody").append("<tr><td>" + data[ix]["game_date"] + 
										"</td><td>" + data[ix]["game_name"] +
										"</td><td>" + data[ix]["game_location"] +
										"</td><td>" + playButton + "</td></tr>");
	}
	
	$(".btnPlay").unbind("click");
	$(".btnPlay").click(playGame);
}

function playGame(evt) {
	game_id = $(evt.target).attr("data-id");
	//log(game_id);
	$("#gamelist").slideUp();
	// retrieve questions for game
	req = {game_id: game_id};
	$.get("services/questioninfo.php", req, gotQuestions, "JSON");
}

function gotQuestions(data) {
	//log(data);
	//populate question table
	$("#divQuestions").show();
	
	$("#tblQuestions > tbody").empty();
	$("#tblQuestions > tbody").append("<tr><th>Round</th><th>Rank</th><th>Prompt</th><th>Options</th></tr>");
	
	for (ix=0; ix<data.length; ix++) {
		var q_id = data[ix]["id"];
		playButton = "<img src='./images/play.png'  alt='Ask this question' value='Play' data-id='" + q_id + "' class='btnAsk' width='64' height='64'>";
					
						

		$("#tblQuestions > tbody").append("<tr><td>" + data[ix]["round"] + 
										"</td><td>" + data[ix]["rank"] +
										"</td><td>" + data[ix]["prompt"] +
										"</td><td>" + playButton + "</td></tr>");
	}

	$(".btnAsk").unbind("click");
	$(".btnAsk").click(playQuestion);
}

function playQuestion(evt) {
	q_id = $(evt.target).attr("data-id");

	req = {question_id: q_id};
	$.get("services/questioninfo.php", req, sendQuestion, "JSON");	
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

function retrieveQuestion(q_id) {

}


function sendQuestion(data){
	qrec = data[0];
	question=	{role: "MASTER",
					route: "PLAYERS",
					type: "QUESTION",
					data: {
						question: qrec["prompt"],
						guess1: qrec["choice1"],
						guess2: qrec["choice2"],
						guess3: qrec["choice3"],
						guess4: qrec["choice4"]
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
function log(msg){
	console.log(msg); 
	//$("#txtLog").append(JSON.stringify(msg) + "\n");
}

