let express = require('express')
let { graphqlExpress } = require('apollo-server-express')
let schema = require('../schema/schema')
let APIPublicUser = require('../schema/lib/apipublicuser')
let APIRegisteredUser = require('../schema/lib/apiregistereduser')


let getApp = (user, request, response, next) => {
  let options = {
    schema: schema,
    context: { user: user },
    graphiql: true,
    pretty: true,
    debug: true,
    formatError: (error) => {
      console.log(error.stack)
      try {
        let errorData = JSON.parse(error.message)
        return {
          message: errorData.message,
          code: errorData.code,
        }
      } catch (e) {
        return {
          message: error.message,
          code: 500,
          details: error.stack,
        }
      }
    },
  }
  return graphqlExpress(request => options)(request, response, next)
}

let apiApp = express()
apiApp.use('/', (request, response, next) => {
  return new Promise((resolve, reject) => {
    if (request.headers.authorization) {
      // use a registered user here
      let user = new APIRegisteredUser()
      user.loadPermissions(request.headers.authorization)
      .then((user) => {
        return getApp(user, request, response, next)
      })
      .catch((err) => {
        console.log(err.stack)
      })
    } else {
      let user = new APIPublicUser()
      user.loadPermissions('replace with header token')
      .then((user) => {
        return getApp(user, request, response, next)
      })
      .catch((error) => {
        console.log(error.stack)
        try {
          let errorData = JSON.parse(error.message)
          response.set('Content-Type: application/json')
          response.send({
            data: {
              data: null,
            },
            errors: [{
              message: errorData.message,
              code: errorData.code,
            }],
          })
        } catch (e) {
          response.set('Content-Type: application/json')
          response.send({
            data: {
              data: null,
            },
            errors: [{
              message: error.message,
              code: 500,
              details: error.stack,
            }],
          })
        }
      })
    }
  })
})

module.exports = apiApp
