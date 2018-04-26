let { makeExecutableSchema } = require('graphql-tools')
require('./registry')
let schemaDefinition = require('./schemadefinition')
let resolverMap = require('./resolvermap')

const schema = makeExecutableSchema({
  typeDefs: schemaDefinition,
  resolvers: resolverMap,
})

module.exports = schema
