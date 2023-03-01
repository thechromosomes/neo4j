const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express()

app.use(cors());
app.use(bodyParser.json())


// Bind Neo4j to the request
app.use((req, res, next) => {
  req.neo4j = require('./neo4j')
  next()
})

app.use(require('./routes'));

module.exports = app