let Promise = require('bluebird')
let { MongoClient, Server } = require('mongodb')

class Model {

  constructor() {
    this.db = null
  }

  static connect() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve(this.db)
      } else {
        Model.createPool()
        .then((db) => {
          this.db = db
          resolve(this.db)
        })
        .catch(reject)
      }
    })
  }

  static createPool() {
    const connectionString = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_NAME}`
    return new Promise((resolve, reject) => {
      MongoClient.connect(connectionString, { promiseLibrary: Promise, poolSize: process.env.MONGO_POOL_SIZE }, (err, db) => {
        if (err) {
          return reject(err)
        }
        let connection = db.db(process.env.MONGO_NAME)
        resolve(connection)
      })
    })
  }

  static toBase64(type, ids) {
    let time = Date.now().toString()
    if (ids) {
      return Buffer.from(`${type}-${ids.join('-')}-${Model.randomString(5)}-${time.substr(time.length - 5)}`).toString('base64')
    } else {
      return Buffer.from(`${type}-${Model.randomString(5)}-${Model.randomString(5)}-${time.substr(time.length - 5)}`).toString('base64')
    }
  }

  static fromBase64(encoded) {
    return Buffer.from(encoded, 'base64').toString('ascii').split('-')
  }

  static randomString(size) {
    var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    var randomString = ''
    for (var x = 0; x < size; x++) {
      var charIndex = Math.floor(Math.random() * characters.length)
      randomString += characters.substring(charIndex, charIndex + 1)
    }
    return randomString
  }

}

module.exports = Model
