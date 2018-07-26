$(document).ready(function() {
  var config = {
    apiKey: 'AIzaSyBYSHdlrtu4dFwywxv10KVJ-Z7UeyVJtZ0',
    authDomain: 'train-scheduler-ytf.firebaseapp.com',
    databaseURL: 'https://train-scheduler-ytf.firebaseio.com',
    projectId: 'train-scheduler-ytf',
    storageBucket: '',
    messagingSenderId: '416433187430'
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  $('#add-train').on('click', function(event) {
    event.preventDefault();
    var currName = $('#newTrainName')
      .val()
      .trim();
    var currDestination = $('#newTrainDestination')
      .val()
      .trim();
    var currFirstTrain = $('#newTrainTime')
      .val()
      .trim();
    var currFrequency = $('#frequency')
      .val()
      .trim();
    var newTrain = {
      name: currName,
      destination: currDestination,
      firstTrain: currFirstTrain,
      frequency: currFrequency
    };

    database.ref().push(newTrain);

    // console.log(newTrain.name);
    // console.log(newTrain.destination);
    // console.log(newTrain.firstTrain);
    // console.log(newTrain.frequency);

    $('#newTrainName').val('');
    $('#newTrainDestination').val('');
    $('#newTrainTime').val('');
    $('#frequency').val('');
  });

  database.ref().on('child_added', function(childSnapshot) {
    // console.log(childSnapshot.val());

    var currName = childSnapshot.val().name;
    var currDestination = childSnapshot.val().destination;
    var currFirstTrain = childSnapshot.val().firstTrain;
    var currFrequency = childSnapshot.val().frequency;

    // console.log(currName);
    // console.log(currDestination);
    // console.log(currFirstTrain);
    // console.log(currFrequency);

    var minAway;

    var firstTrainNew = moment(
      childSnapshot.val().firstTrain,
      'hh;mm'
    ).subtract(1, 'years');
    var diffTime = moment().diff(moment(firstTrainNew), 'tinutes');
    var remainder = diffTime % childSnapshot.val().frequency;
    var minAway = childSnapshot.val().frequency - remainder;
    var nextTrain = moment().add(minAway, 'minutes');
    nextTrain = moment(nextTrain).format('hh:mm');

    var newRow = $('<tr>').append(
      $('<td>').text(currName),
      $('<td>').text(currDestination),
      $('<td>').text(currFrequency),
      $('<td>').text(nextTrain),
      $('<td>').text(minAway)
    );

    $('#add-row').append(newRow);
  });
});
