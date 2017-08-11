$(document).ready(init);

function init(evt) {
	displayQuestionFields(false);
	$("#divQuestionEditFields").tabs();
	// get game_id from cookie
	game_id = $.cookie('game_id');
	$("#btnAddQuestion").attr("data-game-id", game_id);
	
	req = {id: game_id};
	$.get("services/gameinfo.php", req, gotGame,"JSON");
	
	req = {game_id: game_id};
	$.get("services/questioninfo.php", req, gotQuestions, "JSON");
}

function gotGame(data) {
		$("#lblGameName").text("Game Name: " + data[0]["game_name"]);
		$("#lblGameLocation").text("Game Location: " + data[0]["game_location"]);
		$("#lblGameDate").text("Game Date: " + data[0]["game_date"]);
		$("#txtGameId").val(data[0]["game_id"]);
}

function gotQuestions(data) {
	//populate question table
	$("#divQuestions").show();
	
	$("#tblQuestions > tbody").empty();
	$("#tblQuestions > tbody").append("<tr><th>Round</th><th>Rank</th><th>Prompt</th><th>Edit</th><th>Delete</th></tr>");
	
	for (ix=0; ix<data.length; ix++) {
		var q_id = data[ix]["id"];
/* 		editButton = "<input type='button' value='Edit' data-id='" + q_id + "' " +
						"data-game-id='" + game_id + "' class='btnEditQuestion'>";
		deleteButton = "<input type='button' value='Delete' data-id='" + q_id + "' " +
						"data-game-id='" + game_id + "' class='btnDeleteQuestion'>"; */
		editButton = "<img src='./images/edit-button.png'  alt='Edit Question' value='Edit'  data-id='" + q_id + "' " +
						"data-game-id='" + game_id + "' class='btnEditQuestion' width='32' height='32'>";
		deleteButton = "<img src='./images/garbage.png' alt='Delete Question' value='Delete'  data-id='" + q_id + "' " +
						"data-game-id='" + game_id +  "' class='btnDeleteQuestion' width='32' height='32'>";

						
						

		$("#tblQuestions > tbody").append("<tr><td>" + data[ix]["round"] + 
										"</td><td>" + data[ix]["rank"] +
										"</td><td>" + data[ix]["prompt"] +
										"</td><td>" + editButton + "</td><td>" + deleteButton + 
										"</td></tr>");
	}	
	$(".btnEditQuestion").unbind("click");
	$(".btnDeleteQuestion").unbind("click");
	$("#btnAddQuestion").unbind("click");
	
	$(".btnEditQuestion").click(editQuestion);
	$(".btnDeleteQuestion").click(deleteQuestion);
	$("#btnAddQuestion").click(addQuestion);
}

function addQuestion(evt) {
	log(evt.target);
	
	$(".editQuestionField").val("");
	displayQuestionFields(true);
	
	$("#btnSaveQuestion").unbind("click");
	$("#btnCancelQuestion").unbind("click");	
	
	$("#btnSaveQuestion").click(saveAddQuestion);
	$("#btnCancelQuestion").click(cancelAddQuestion);
	
	$("#txtRound").focus();
}

function displayQuestionFields(show) {
	if (show) {
		$("#divQuestionFieldsContainer").show();
		$("#divQuestionFieldsContainer").slideDown();
	} else {
		$("#divQuestionFieldsContainer").slideUp();
		$("#divQuestionFieldsContainer").hide();
	}
}

function saveAddQuestion(evt) {
	//log(evt);
	// build map from editQuestionField fields
	game_id = $("#btnAddQuestion").attr("data-game-id");
	
	data = buildFormMap(game_id);
	log(data);

	$.post("services/questioninfo.php", data, 
		function (data) {  
			repopData = {game_id: game_id};
			$.get("services/questioninfo.php", repopData, gotQuestions, "JSON");		
		}
	);
	
	displayQuestionFields(false);	
}

function buildFormMap(game_id) {
	data = {game_id: game_id};
	$(".editQuestionField").each(function(index) {
		if ($(this).attr("data-type") == "string") {
			data[$(this).attr("name")] = "'" + $(this).val() + "'";
		} else {
			data[$(this).attr("name")] = $(this).val();
		}
	});
	return data;
}

function saveDone(data) {
	$.get("services/questioninfo.php", data, gotQuestions, "JSON");
}

function cancelAddQuestion(evt) {
	displayQuestionFields(false);
	
	$(".editQuestionField").val("");
}

function editQuestion(evt) {
	id = $(evt.target).attr("data-id");
	
	sendData = {question_id: id};
	
	$.get("services/questioninfo.php", sendData, fillEditFields, "JSON");
}

function fillEditFields(data) {
	$(".editQuestionField").each(function(index) {
		$(this).val(data[0][$(this).attr("name")]);
	});
	
	$("#btnSaveQuestion").unbind("click");
	$("#btnCancelQuestion").unbind("click");	
	
	$("#btnSaveQuestion").click(saveEditQuestion);
	$("#btnCancelQuestion").click(cancelAddQuestion);
	
	displayQuestionFields(true);
}

function saveEditQuestion () {
	game_id = $("#btnAddQuestion").attr("data-game-id");
	
	sendData = buildFormMap(game_id);

	request = {type: "PUT", 
			url: "services/questioninfo.php",
			data: sendData,
			success: 
				function(data) {
					repopData = {game_id: game_id};
					$.get("services/questioninfo.php", repopData, gotQuestions, "JSON");						
				}
			};
	$.ajax(request);
	
	displayQuestionFields(false);
}

function deleteQuestion(evt) {
	var deleteIt = confirm("Do you really wish to delete this question?");
	
	if (deleteIt) {
		id = $(evt.target).attr("data-id");
		
		sendData = {question_id: id};
		
		
		request = {type: "DELETE", 
					url: "services/questioninfo.php",
					data: sendData,
					success: 
						function(data) {
							repopData = {game_id: game_id};
							$.get("services/questioninfo.php", repopData, gotQuestions, "JSON");						
						}
					};
		
		$.ajax(request);
	}
}	

function deleteQuestionCleanup(data) {
	$.get("services/questioninfo.php",gotQuestions,{},"JSON");
}	

function log(msg){console.log(msg); }