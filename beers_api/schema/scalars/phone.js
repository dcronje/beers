let { GraphQLScalarType } = require('graphql')
let { Kind } = require('graphql/language')
let { GraphQLError } = require('graphql/error')
let validator = require('validator')

function parsePhone(value) {
  return value
  if (validator.isMobilePhone(value, 'any')) {
    throw new TypeError(`Value: '${value}' is not a valid phone number`)
  }
  return value
}

let PhoneQL = new GraphQLScalarType({
  name: 'Phone',
  serialize: function serialize(value) {
    return parsePhone(value)
  },
  parseValue: function parseValue(value) {
    if (typeof value !== 'string') {
      throw new TypeError('Field error: value is not an instance of string')
    }
    return parsePhone(value)
  },
  parseLiteral: function parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError('Query error: Can only parse strings to phone but got a: ' + ast.kind, [ast])
    }
    try {
      return parsePhone(ast.value)
    } catch (e) {
      throw new GraphQLError('Query error: ' + e.message, [ast])
    }
  },
})

module.exports = PhoneQL
