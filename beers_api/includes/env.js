let env = require('node-env-file')
let path = require('path')

let appDir = path.dirname(require.main.filename)
if (!process.env.ENV_LOADED) {
  let envFile = path.join(appDir, '/.env')
  env(envFile)
}
