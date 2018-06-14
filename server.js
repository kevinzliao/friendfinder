// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// import object array from app/data/friends.js
// =============================================================
var fs = require('fs');
var friends = JSON.parse(fs.readFileSync('./app/data/friends.js'));

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/app/public/home.html"));
});

app.get("/survey", function(req, res) {
  res.sendFile(path.join(__dirname, "app/public/survey.html"));
});

app.get("/all", function(req, res) {
  res.sendFile(path.join(__dirname, "all.html"));
});

// Displays all characters
app.get("/api/friends", function(req, res) {
  return res.json(friends);
});

// Create New Characters - takes in JSON input
app.post("/api/friends", function(req, res) {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body-parser middleware
  var newfriend = req.body;

  // Using a RegEx Pattern to remove spaces from newCharacter
  // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html

  console.log(newfriend);

// initalize best friend as 0th person, always assume friends.js has at least one item
    var indexOfBest = 0;

    //map call to calculate absolute difference and reduce to one value
  var difArray = friends[0].scores.map((x, index) => Math.abs(parseInt(x)-parseInt(newfriend.scores[index])));
  var totalDifference = difArray.reduce((total, amount) => total + amount);

  //run the same map and reduce against other people
  for (i = 1; i < friends.length; i++) {
    difArray = friends[i].scores.map((x, index) => Math.abs(parseInt(x)-parseInt(newfriend.scores[index])));
    var temp = difArray.reduce((total, amount) => total + amount);
    if (totalDifference > temp) {
        indexOfBest = i;
        totalDifference = temp;
    }
  }

  //now push the new person to the friend list
  friends.push(newfriend);
  //save to friends.js
  fs.writeFile('./app/data/friends.js', JSON.stringify(friends), (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
  //return json for the post call of the friend with the smallest difference
  res.json(friends[indexOfBest]);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
