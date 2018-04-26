
let env = require('./includes/env')
let express = require('express')
let bodyParser = require('body-parser')
let { corsApp, publicApp, apiApp, graphiqlApp } = require('./apps')

let app = express()

app.use(bodyParser.json())
app.use(corsApp)
app.use(publicApp)
app.use('/api', apiApp)
app.use('/graphql', graphiqlApp)

app.listen(process.env.PORT)
