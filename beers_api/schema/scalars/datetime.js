let { GraphQLScalarType } = require('graphql')
let { Kind } = require('graphql/language')
let { GraphQLError } = require('graphql/error')

function parseDateTime(value) {
  var result = new Date(value)
  if (isNaN(result.getTime())) {
    throw new TypeError('Invalid datetime: ' + value)
  }
  return result
}

let DateTimeQL = new GraphQLScalarType({
  name: 'DateTime',
  serialize: function serialize(value) {
    if (!(value instanceof Date)) {
      throw new TypeError('Field error: value is not an instance of DateTime')
    }
    if (isNaN(value.getTime())) {
      throw new TypeError('Field error: value is an invalid DateTime')
    }
    return dateToIsoString(value)
  },
  parseValue: function parseValue(value) {
    if (typeof value !== 'string') {
      throw new TypeError('Field error: value is not an instance of string')
    }
    return parseDateTime(value)
  },
  parseLiteral: function parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError('Query error: Can only parse strings to datetimes but got a: ' + ast.kind, [ast])
    }
    try {
      return parseDateTime(ast.value)
    } catch (e) {
      throw new GraphQLError('Query error: ' + e.message, [ast])
    }
  },
})

let dateToIsoString = function (date) {
  let tzo = -date.getTimezoneOffset()
  let dif = tzo >= 0 ? '+' : '-'
  let pad = function (num) {
    var norm = Math.abs(Math.floor(num))
    return (norm < 10 ? '0' : '') + norm
  }
  return date.getFullYear() +
    '-' + pad(date.getMonth() + 1) +
    '-' + pad(date.getDate()) +
    'T' + pad(date.getHours()) +
    ':' + pad(date.getMinutes()) +
    ':' + pad(date.getSeconds()) +
    dif + pad(tzo / 60) +
    ':' + pad(tzo % 60)
}

module.exports = DateTimeQL
