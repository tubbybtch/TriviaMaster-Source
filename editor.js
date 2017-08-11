$(document).ready(init);

function init() {

	$("#gameEditFields").hide();
	$("#gameEditFields").slideUp();
	
	$("#divQuestions").hide();
	$("#divQuestionFieldsContainer").hide();
	$("#divQuestionFieldsContainer").slideUp();	
	$.get("services/gameinfo.php",populateGameTable,{},"JSON");
}

function populateGameTable(data) {
	$("#tblGames > tbody").empty();
	$("#tblGames > tbody").append("<tr><th>Date</th><th>Name</th><th>Location</th><th>Questions</th><th>Edit</th><th>Delete</th></tr>");
	for (ix=0; ix<data.length; ix++) {
		var g_id = data[ix]["game_id"];
		//editButton = "<input type='button' value='Edit' data-id='" + g_id + "' class='btnEdit'>";
		editButton = "<img src='./images/edit-button.png'  alt='Edit Game Data' value='Edit' data-id='" + g_id + "' class='btnEdit' width='64' height='64'>";
		//deleteButton = "<input type='button' value='Delete' data-id='" + g_id + "' class='btnDelete'>";
		deleteButton = "<img src='./images/garbage.png' alt='Delete Game' value='Delete' data-id='" + g_id + "' class='btnDelete' width='64' height='64'>";
		//questionButton =  "<input type='button' value='Questions' data-id='" + g_id + "' class='btnQuestions'>";
		questionButton =  "<img src='./images/questions.png' alt='Edit Game Questions' value='Questions' data-id='" + g_id + "' class='btnQuestions' width='64' height='64'>";
		$("#tblGames > tbody").append("<tr><td>" + data[ix]["game_date"] + 
										"</td><td>" + data[ix]["game_name"] +
										"</td><td>" + data[ix]["game_location"] +
										"</td><td>" + questionButton + "</td><td>" + editButton + "</td><td>" + deleteButton + 
										"</td></tr>");
	}
	$(".btnEdit").unbind("click");
	$(".btnDelete").unbind("click");
	$(".btnQuestions").unbind("click");
	$("#btnAdd").unbind("click");
	$(".btnEdit").click(editGame);
	$(".btnQuestions").click(questions);
	$(".btnDelete").click(deleteGame);
	$("#btnAdd").click(addGame);
}

function questions(evt) {
	var id = $(evt.target).attr("data-id");
	$.cookie('game_id', id)
	var qwin = window.open("editquestions.html","test","modal,resizable,scrollbars,status, dependent, fullscreen");
}
	
function addGame() {
	$(".editField").val("");	
	$("#games").slideUp();
	$("#gameEditFields").slideDown();
	
	$("#btnSave").unbind("click");
	$("#btnSave").click(addSave);  
	
	$("#btnCancel").unbind("click");
	$("#btnCancel").click(cancel);
}

function addSave() {

	sendData = {game_name: $("#txtName").val(),
		game_date: $("#txtDate").val(),
		game_location: $("#txtLocation").val()};
		
	$.post("services/gameinfo.php", sendData, addSaveCleanup);
		
	$("#gameEditFields").slideUp();
	$("#games").slideDown();
}

function addSaveCleanup() {
	$("#btnSave").unbind("click");
	$("#btnCancel").unbind("click");
	$(".editField").val("");
	$.get("services/gameinfo.php",populateGameTable,{},"JSON");	
}

function editGame(evt) {
	id = $(evt.target).attr("data-id");
	
	// retreive game info from db
	req = {id: id};
	$.get("services/gameinfo.php", req, editGameFields, "JSON");
}

function editGameFields(data) {
	//log(data);
	id = data[0]["game_id"];
	$("#txtName").val(data[0]["game_name"]);
	$("#txtDate").val(data[0]["game_date"]);
	$("#txtLocation").val(data[0]["game_location"]);
	
	$("#btnSave").unbind("click");
	$("#btnSave").click(function () {editSave(id)});  
	
	$("#btnCancel").unbind("click");
	$("#btnCancel").click(cancel); 
	
	$("#games").slideUp();
	$("#gameEditFields").slideDown();	
}

function cancel() {
	$("#gameEditFields").slideUp();
	$("#games").slideDown();	

	$(".editField").val("");
}

function editSave(id) {
	// save field contents to db
	$("#gameEditFields").slideUp();
	$("#games").slideDown();
	
	sendData = {game_id: id,
			game_name: $("#txtName").val(),
			game_date: $("#txtDate").val(),
			game_location: $("#txtLocation").val()};
	
	
	request = {type: "PUT", 
				success: editSaveCleanup,
				url: "services/gameinfo.php",
				data: sendData};
	
	$.ajax(request);
}

function editSaveCleanup() {
	$.get("services/gameinfo.php",populateGameTable,{},"JSON");	
	$("#btnSave").unbind("click");
	$(".editField").val("");
}

function deleteGame(evt) {
	var deleteIt = confirm("Do you really wish to delete this game?");
	
	if (deleteIt) {
		id = $(evt.target).attr("data-id");
		
		sendData = {game_id: id};
		
		
		request = {type: "DELETE", 
					success: deleteCleanup,
					url: "services/gameinfo.php",
					data: sendData};
		
		$.ajax(request);
	}
}

function deleteCleanup(data) {
	$.get("services/gameinfo.php",populateGameTable,{},"JSON");
}


// Utilities
function log(msg){console.log(msg); }

