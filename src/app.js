const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())


// Bind Neo4j to the request
app.use((req, res, next) => {
  req.neo4j = require('./neo4j')
  next()
})
// Convert response from neo4j types to native types
// app.use(require('./middleware/neo4j-type-handler'))

app.use(require('./routes'));

// app.use(function (req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

module.exports = app