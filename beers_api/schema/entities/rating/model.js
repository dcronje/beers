let Promise = require('bluebird')
let _ = require('underscore')
let { ObjectID } = require('mongodb')
let Model = require('../../lib/model')
let ClassRegistry = require('../../lib/classregistry')

class RatingModel extends Model {

  static add(input, ctx) {
    return new Promise((resolve, reject) => {
      let ratingId = null
      RatingModel.connect()
      .then((db) => {
        Promise.resolve()
        .then(() => {
          return [
            db.collection('beverages').findOne({ _id: ObjectID(input._beerId) }),
            db.collection('users').findOne({ _id: ObjectID(input._userId) }),
          ]
        })
        .spread((beverage, user) => {
          let collection = db.collection('ratings')
          return collection.insertOne(Object.assign(input, { 
            createdAt: new Date(), 
            beverageName: beverage.name, 
            userName: `${user.firstName} ${user.lastName}`, 
            _userId: user._id,
            _beverageId: beverage._id,
          }))
        })
        .then((result) => {
          ratingId = result.insertedId
          return db.collection('ratings').aggregate([{ $match: { _beverageId: ObjectID(input._beerId) } }, { $group: { _id: null, avg: { $avg: "$value" } } }]).toArray()
        })
        .then((result) => {
          return db.collection('beverages').updateOne({ _id: ObjectID(input._beerId) }, { $set: { rating: result[0].avg } })
        })
        .then((result) => {
          return RatingModel.one({ _id: ratingId })
        })
        .then((rating) => resolve(rating))
        .catch(reject)
      })
      .catch(reject)
    })
  }

  static update({ _id }, input, ctx) {
    return new Promise((resolve, reject) => {
      RatingModel.connect()
      .then((db) => {
        let collection = db.collection('ratings')
        collection.findOne({ _id: ObjectID(_id) })
        .then((rating) => {
          if (!rating) {
            throw new Error(JSON.stringify({ message: `Rating with _id: ${_id} not found.`, code: 404 }))
          }
          return collection.updateOne({ _id: ObjectID(_id) }, { $set: Object.assign(input, { updatedAt: new Date() }) })
        })
        .then((result) => {
          return RatingModel.one({ _id: ObjectID(_id) })
        })
        .then((rating) => resolve(rating))
        .catch(reject)
      })
      .catch(reject)
    })
  }

  static remove({ _id }, ctx) {
    return new Promise((resolve, reject) => {
      RatingModel.connect()
      .then((db) => {
        let collection = db.collection('ratings')
        collection.findOne({ _id: ObjectID(_id) })
        .then((rating) => {
          if (!rating) {
            throw new Error(JSON.stringify({ message: `Rating with _id: ${_id} not found.`, code: 404 }))
          }
          return collection.deleteOne({ _id })
        })
        .then((result) => resolve(_id))
        .catch(reject)
      })
      .catch(reject)
    })
  }

  static one({ _id }, ctx) {
    return new Promise((resolve, reject) => {
      RatingModel.connect()
      .then((db) => {
        let collection = db.collection('ratings')
        collection.findOne({ _id: ObjectID(_id) })
        .then((rating) => {
          if (!rating) {
            throw new Error(JSON.stringify({ message: `Rating with _id: ${_id} not found.`, code: 404 }))
          }
          resolve(rating)
        })
        .catch(reject)
      })
      .catch(reject)
    })
  }

  static list(skip, limit, filters, order, ctx) {
    return new Promise((resolve, reject) => {
      RatingModel.connect()
      .then((db) => {
        let collection = db.collection('ratings')
        return RatingModel.getFiltersAndOrder(db, filters, order)
        .then(({ where, sort }) => {
          return [
            collection.find(where).sort(sort).skip(skip).limit(limit).toArray(),
            collection.count(where),
          ]
        })
        .spread((ratings, count) => {
          resolve({
            list: ratings,
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
      RatingModel.connect()
      .then((db) => {
        return RatingModel.getFiltersAndOrder(db, filters, [])
        .then(({ where, sort }) => {
          let collection = db.collection('ratings')
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
      if (filters.userName) {
        where.userName = new RegExp(filters.userName, 'gi')
      }
      if (filters.beerName) {
        where.beverageName = new RegExp(filters.beerName, 'gi')
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
          case 'USER_NAME':
            sort.userName = orderItem.direction === 'ASC' ? 1 : -1
            break;
          case 'BEER_NAME':
            sort.beverageName = orderItem.direction === 'ASC' ? 1 : -1
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

module.exports = RatingModel
