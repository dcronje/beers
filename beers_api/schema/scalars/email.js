let { GraphQLScalarType } = require('graphql')
let { Kind } = require('graphql/language')
let { GraphQLError } = require('graphql/error')
let validator = require('validator')

function parseEmail(value) {
  if (!validator.isEmail(value)) {
    throw new TypeError(`Value: '${value}' is not a valid email address`)
  }
  return value
}

let EmailQL = new GraphQLScalarType({
  name: 'Email',
  serialize: function serialize(value) {
    return parseEmail(value)
  },
  parseValue: function parseValue(value) {
    if (typeof value !== 'string') {
      throw new TypeError('Field error: value is not an instance of string')
    }
    return parseEmail(value)
  },
  parseLiteral: function parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError('Query error: Can only parse strings to email but got a: ' + ast.kind, [ast])
    }
    try {
      return parseEmail(ast.value)
    } catch (e) {
      throw new GraphQLError('Query error: ' + e.message, [ast])
    }
  },
})

module.exports = EmailQL
