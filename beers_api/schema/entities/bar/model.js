let Promise = require('bluebird')
let _ = require('underscore')
let { ObjectID } = require('mongodb')
let Model = require('../../lib/model')
let ClassRegistry = require('../../lib/classregistry')

class BarModel extends Model {

  static add(input, ctx) {
    return new Promise((resolve, reject) => {
      BarModel.connect()
      .then((db) => {
        let collection = db.collection('bars')
        collection.insertOne(Object.assign(input, { createdAt: new Date() }))
        .then((result) => {
          return BarModel.one({ _id: result.insertedId })
        })
        .then((bar) => resolve(bar))
        .catch(reject)
      })
      .catch(reject)
    })
  }

  static update({ _id }, input, ctx) {
    return new Promise((resolve, reject) => {
      BarModel.connect()
      .then((db) => {
        let collection = db.collection('bars')
        collection.findOne({ _id: ObjectID(_id) })
        .then((bar) => {
          if (!bar) {
            throw new Error(JSON.stringify({ message: `Bar with _id: ${_id} not found.`, code: 404 }))
          }
          return collection.updateOne({ _id: ObjectID(_id) }, { $set: Object.assign(input, { updatedAt: new Date() }) })
        })
        .then(() => {
          if (input.name) {
            return db.collection('barBeverages').update({ _barId: ObjectID(_id) }, { $set: { barName: input.name } })
          } else {
            return Promise.resolve()
          }
        })
        .then((result) => {
          return BarModel.one({ _id: ObjectID(_id) })
        })
        .then((bar) => resolve(bar))
        .catch(reject)
      })
      .catch(reject)
    })
  }

  static remove({ _id }, ctx) {
    return new Promise((resolve, reject) => {
      BarModel.connect()
      .then((db) => {
        let collection = db.collection('bars')
        collection.findOne({ _id: ObjectID(_id) })
        .then((bar) => {
          if (!bar) {
            throw new Error(JSON.stringify({ message: `Bar with _id: ${_id} not found.`, code: 404 }))
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
      BarModel.connect()
      .then((db) => {
        let collection = db.collection('bars')
        collection.findOne({ _id: ObjectID(_id) })
        .then((bar) => {
          if (!bar) {
            throw new Error(JSON.stringify({ message: `Bar with _id: ${_id} not found.`, code: 404 }))
          }
          resolve(bar)
        })
        .catch(reject)
      })
      .catch(reject)
    })
  }

  static list(skip, limit, filters, order, ctx) {
    return new Promise((resolve, reject) => {
      BarModel.connect()
      .then((db) => {
        let collection = db.collection('bars')
        return BarModel.getFiltersAndOrder(db, filters, order)
        .then(({where, sort}) => {
          return [
            collection.find(where).sort(sort).skip(skip).limit(limit).toArray(),
            collection.count(where),
          ]
        })
        .spread((bars, count) => {
          resolve({
            list: bars,
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

  static count({ filters }, ctx) {
    return new Promise((resolve, reject) => {
    BarModel.connect()
      .then((db) => {
        return BarModel.getFiltersAndOrder(db, filters, [])
        .then(({ where, sort }) => {
          let collection = db.collection('bars')
          return collection.count(where)
        })
        .then((count) => resolve(count))
        .catch(reject)
      })
    })
  }

  static getFiltersAndOrder(db, filters, order) {
    return new Promise((resolve, reject) => {
      let where = {}
      if (filters.name) {
        where.name = new RegExp(filters.name, 'gi')
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
          case 'NAME':
            sort.name = orderItem.direction === 'ASC' ? 1 : -1
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
      Promise.resolve()
      .then(() => {
        if (filters.beers && filters.beers.length) {
          return db.collection('barBeverages').find({ _beverageId: { $in: _.map(filters.beers, (beer) => ObjectID(beer)) } }).toArray()
            .then((beers) => {
              where._id = { $in: _.map(beers, (beer) => ObjectID(beer._barId)) }
            })
        } else {
          return Promise.resolve()
        }
      })
      .then(() => {
        resolve({ where, sort })
      })
    })
  }

}

module.exports = BarModel
