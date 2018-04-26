let { GraphQLScalarType } = require('graphql')
let { Kind } = require('graphql/language')
let { GraphQLError } = require('graphql/error')
let validator = require('validator')

function parseURL(value) {
  // if (!validator.isURL(value)) {
  //   throw new TypeError(`Value: '${value}' is not a valid URL`)
  // }
  return value
}

let URLQL = new GraphQLScalarType({
  name: 'URL',
  serialize: function serialize(value) {
    return parseURL(value)
  },
  parseValue: function parseValue(value) {
    if (typeof value !== 'string') {
      throw new TypeError('Field error: value is not an instance of string')
    }
    return parseURL(value)
  },
  parseLiteral: function parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError('Query error: Can only parse strings to url but got a: ' + ast.kind, [ast])
    }
    try {
      return parseURL(ast.value)
    } catch (e) {
      throw new GraphQLError('Query error: ' + e.message, [ast])
    }
  },
})

module.exports = URLQL
