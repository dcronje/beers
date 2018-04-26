let Promise = require('bluebird')
let _ = require('underscore')
let { ObjectID } = require('mongodb')
let Model = require('../../lib/model')
let ClassRegistry = require('../../lib/classregistry')

class BreweryModel extends Model {

  static add(input, ctx) {
    return new Promise((resolve, reject) => {
      BreweryModel.connect()
        .then((db) => {
          let collection = db.collection('breweries')
          collection.insertOne(Object.assign(input, { createdAt: new Date() }))
            .then((result) => {
              return BreweryModel.one({ _id: result.insertedId })
            })
            .then((brewery) => resolve(brewery))
            .catch(reject)
        })
        .catch(reject)
    })
  }

  static update({ _id }, input, ctx) {
    return new Promise((resolve, reject) => {
      BreweryModel.connect()
        .then((db) => {
          let collection = db.collection('breweries')
          collection.findOne({ _id: ObjectID(_id) })
            .then((brewery) => {
              if (!brewery) {
                throw new Error(JSON.stringify({ message: `Brewery with _id: ${_id} not found.`, code: 404 }))
              }
              return collection.updateOne({ _id: ObjectID(_id) }, { $set: Object.assign(input, { updatedAt: new Date() }) })
            })
            .then((result) => {
              return BreweryModel.one({ _id: ObjectID(_id) })
            })
            .then((brewery) => resolve(brewery))
            .catch(reject)
        })
        .catch(reject)
    })
  }

  static remove({ _id }, ctx) {
    return new Promise((resolve, reject) => {
      BreweryModel.connect()
        .then((db) => {
          let collection = db.collection('breweries')
          collection.findOne({ _id: ObjectID(_id) })
            .then((brewery) => {
              if (!brewery) {
                throw new Error(JSON.stringify({ message: `Brewery with _id: ${_id} not found.`, code: 404 }))
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
      BreweryModel.connect()
        .then((db) => {
          let collection = db.collection('breweries')
          collection.findOne({ _id: ObjectID(_id) })
            .then((brewery) => {
              if (!brewery) {
                throw new Error(JSON.stringify({ message: `Brewery with _id: ${_id} not found.`, code: 404 }))
              }
              resolve(brewery)
            })
            .catch(reject)
        })
        .catch(reject)
    })
  }

  static list(skip, limit, filters, order, ctx) {
    return new Promise((resolve, reject) => {
      BreweryModel.connect()
      .then((db) => {
        let collection = db.collection('breweries')
        return BreweryModel.getFiltersAndOrder(db, filters, order)
        .then(({ where, sort }) => {
          return [
            collection.find(where).sort(sort).skip(skip).limit(limit).toArray(),
            collection.count(where),
          ]
        })
        .spread((breweries, count) => {
          resolve({
            list: breweries,
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
      BreweryModel.connect()
      .then((db) => {
        return BreweryModel.getFiltersAndOrder(db, filters, [])
        .then(({ where, sort }) => {
          let collection = db.collection('breweries')
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
      resolve({ where, sort })
    })
  }

}

module.exports = BreweryModel
