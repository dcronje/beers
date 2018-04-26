let apiApp = require('./api.app')
let corsApp = require('./cors.app')
let graphiqlApp = require('./graphiql.app')
let publicApp = require('./public.app')

module.exports = {
  apiApp,
  corsApp,
  graphiqlApp,
  publicApp,
}