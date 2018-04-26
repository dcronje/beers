let Promise = require('bluebird')
let _ = require('underscore')
let { ObjectID } = require('mongodb')
let Model = require('../../lib/model')
let ClassRegistry = require('../../lib/classregistry')

class UserModel extends Model {

  static add(input, ctx) {
    return new Promise((resolve, reject) => {
      UserModel.connect()
      .then((db) => {
        let collection = db.collection('users')
        collection.insertOne(Object.assign(input, { createdAt: new Date() }))
        .then((result) => {
          return UserModel.one({ _id: result.insertedId })
        })
        .then((user) => resolve(user))
        .catch(reject)
      })
      .catch(reject)
    })
  }

  static update({ _id }, input, ctx) {
    return new Promise((resolve, reject) => {
      UserModel.connect()
      .then((db) => {
        let collection = db.collection('users')
        collection.findOne({ _id: ObjectID(_id) })
        .then((user) => {
          if (!user) {
            throw new Error(JSON.stringify({ message: `User with _id: ${_id} not found.`, code: 404 }))
          }
          return collection.updateOne({ _id: ObjectID(_id) }, { $set: Object.assign(input, { updatedAt: new Date() }) })
        })
        .then(() => {
          if (input.name) {
            return db.collection('rating').update({ _userId: ObjectID(_id) }, { $set: { userName: `${user.firstName} ${user.lastName}` } })
          } else {
            return Promise.resolve()
          }
        })
        .then((result) => {
          return UserModel.one({ _id: ObjectID(_id) })
        })
        .then((user) => resolve(user))
        .catch(reject)
      })
      .catch(reject)
    })
  }

  static remove({ _id }, ctx) {
    return new Promise((resolve, reject) => {
      UserModel.connect()
      .then((db) => {
        let collection = db.collection('users')
        collection.findOne({ _id: ObjectID(_id) })
        .then((user) => {
          if (!user) {
            throw new Error(JSON.stringify({ message: `User with _id: ${_id} not found.`, code: 404 }))
          }
          return collection.deleteOne({ _id: ObjectID(_id) })
        })
        .then((result) => resolve(_id))
        .catch(reject)
      })
      .catch(reject)
    })
  }

  static one({ _id }, ctx) {
    return new Promise((resolve, reject) => {
      UserModel.connect()
      .then((db) => {
        let collection = db.collection('users')
        collection.findOne({ _id: ObjectID(_id) })
        .then((user) => {
          if (!user) {
            throw new Error(JSON.stringify({ message: `User with _id: ${_id} not found.`, code: 404 }))
          }
          resolve(user)
        })
        .catch(reject)
      })
      .catch(reject)
    })
  }

  static list(skip, limit, filters, order, ctx) {
    return new Promise((resolve, reject) => {
      UserModel.connect()
      .then((db) => {
        let collection = db.collection('users')
        return UserModel.getFiltersAndOrder(db, filters, order)
        .then(({ where, sort }) => {
          return [
            collection.find(where).sort(sort).skip(skip).limit(limit).toArray(),
            collection.count(where),
          ]
        })
        .spread((users, count) => {
          resolve({
            list: users,
            count: count,
            skip: skip,
            limit: limit,
          })
        })
        .catch(reject)
      })
      .catch(reject)
    })
  }

  static count(filters, ctx) {
    return new Promise((resolve, reject) => {
      UserModel.connect()
      .then((db) => {
        return UserModel.getFiltersAndOrder(db, filters, [])
        .then(({ where, sort }) => {
          let collection = db.collection('users')
          return collection.count(where)
        })
        .then((count) => resolve(count))
        .catch(reject)
      })
      .catch(reject)
    })
  }

  static getFiltersAndOrder(db, filters, order) {
    return new Promise((resolve, reject) => {
      let where = {}
      if (filters.firstName) {
        where.firstName = new RegExp(filters.firstName, 'gi')
      }
      if (filters.lastName) {
        where.lastName = new RegExp(filters.lastName, 'gi')
      }
      if (filters.maxCreatedAt) {
        where.createdAt = { $lt: filters.maxCreatedAt }
      }
      if (filters.minCreatedAt) {
        where.createdAt = { $gt: filters.minCreatedAt }
      }
      if (filters.maxUpdatedAt) {
        where.updatedAt = { $lt: filters.maxUpdatedAt }
      }
      if (filters.minUpdatedAt) {
        where.updatedAt = { $gt: filters.minUpdatedAt }
      }
      let sort = {}
      _.each(order, (orderItem) => {
        switch (orderItem.order) {
          case 'FIRST_NAME':
            sort.firstName = orderItem.direction === 'ASC' ? 1 : -1
            break;
          case 'LAST_NAME':
            sort.lastName = orderItem.direction === 'ASC' ? 1 : -1
            break;
          case 'CREATED_AT':
            sort.createdAt = orderItem.direction === 'ASC' ? 1 : -1
            break;
          case 'UPDATED_AT':
            sort.updatedAt = orderItem.direction === 'ASC' ? 1 : -1
            break;
          default:
            break;
        }
      })
      resolve({ where, sort })
    })
  }

}

module.exports = UserModel
