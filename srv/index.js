// load up the express framework and body-parser helper
const express = require('express');
const bodyParser = require('body-parser');

var cors = require('cors');
// create an instance of express to serve our end points
const app = express();

// we'll load up node's built in file system helper library here
// (we'll be using this later to serve our JSON files
const fs = require('fs');

// configure our express instance with some body-parser settings 
// including handling JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(express.static('dist'))

// this is where we'll handle our various routes from
const routes = require('./routes/routes.js')(app, fs);

// finally, launch our server on port 3001.

const port = process.env.PORT || 3001;
app.set('port', port);

// Listen on the specified port
app.listen(port, function() {
  console.log('Client server listening on port ' + port);
});
