// Initialize Firebase
var config = {
  apiKey: "AIzaSyByYoGBaL4msOfs4EiRRfDW0YwXmQHSO3c",
  authDomain: "traintime-b56d5.firebaseapp.com",
  databaseURL: "https://traintime-b56d5.firebaseio.com",
  projectId: "traintime-b56d5",
  storageBucket: "",
  messagingSenderId: "240045038486"
};
firebase.initializeApp(config);

var database = firebase.database();

var train = "";
var destination = "";
var firstTrain = 0;
var frequency = 0;
var nextTrain = 0;
var minutesLeft = 0;

$("#submit").on('click', function(event) {
  event.preventDefault();
  train = $("#trainName").val().trim();
  destination = $("#destination").val().trim();
  firstTrain = $("#firstTrain").val().trim();
  frequency = parseInt($("#frequency").val().trim());
  $("#trainEntry").trigger("reset");

  database.ref().push({
    train: train,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

});

database.ref().on("child_added", function(snapshot) {
  var sv = snapshot.val();

  var newRow = $("<tr>");
  //train 
  var trainCell = $("<td>");
  trainCell.text(sv.train);
  newRow.append(trainCell);

  //destination 
  var destinationCell = $("<td>");
  destinationCell.text(sv.destination);
  newRow.append(destinationCell);

  //frequency
  var frequencyCell = $("<td>");
  frequencyCell.text(sv.frequency);
  newRow.append(frequencyCell);

  //next arrival
  var firstTrainConverted = moment(sv.firstTrain, "HH:mm").subtract(1, "years");
  console.log(firstTrainConverted);
  var diffFirst = moment().diff(moment(firstTrainConverted), "minutes");
  console.log(diffFirst);
  var remainder = diffFirst % sv.frequency;
  console.log(remainder);
  var minutesLeft = sv.frequency - remainder;
  console.log(minutesLeft);
  nextTrain = moment().add(minutesLeft, 'minutes');
  var nextTrainCell = $("<td>");
  nextTrainCell.text(moment(nextTrain).format('h:mm'));
  newRow.append(nextTrainCell);

  //minutes left
  var minutesLeftCell = $("<td>");
  minutesLeftCell.text(minutesLeft);
  newRow.append(minutesLeftCell);

  $("#train-schedule").append(newRow);

}, function(errorObject) {
  console.log("Errors handled: " + errorObjecxt.code);
});