let Promise = require('bluebird')
let _ = require('underscore')
let { ObjectID } = require('mongodb')
let Model = require('../../lib/model')
let ClassRegistry = require('../../lib/classregistry')

class BarBeerModel extends Model {

  static add(input, ctx) {
    return new Promise((resolve, reject) => {
      BarBeerModel.connect()
      .then((db) => {
        Promise.resolve()
        .then(() => {
          return [
            db.collection('beverages').findOne({ _id: ObjectID(input._beerId) }),
            db.collection('bars').findOne({ _id: ObjectID(input._barId) }),
          ]
        })
        .spread((beverage, bar) => {
          let collection = db.collection('barBeverages')
          return collection.insertOne(Object.assign(input, { createdAt: new Date(), beverageName: beverage.name, barName: bar.name }))
        })
        .then((result) => {
          return BarBeerModel.one(result.insertedId)
        })
        .then((barBeer) => resolve(barBeer))
        .catch(reject)
      })
      .catch(reject)
    })
  }

  static update({ _id }, input, ctx) {
    return new Promise((resolve, reject) => {
      BarBeerModel.connect()
      .then((db) => {
        let collection = db.collection('barBeverages')
        collection.findOne({ _id: ObjectID(_id) })
        .then((barBeer) => {
          if (!barBeer) {
            throw new Error(JSON.stringify({ message: `BarBeer with _id: ${_id} not found.`, code: 404 }))
          }
          return collection.updateOne({ _id: ObjectID(_id) }, { $set: Object.assign(input, { updatedAt: new Date() }) })
        })
        .then((result) => {
          return BarBeerModel.one({ _id: ObjectID(_id) })
        })
        .then((barBeer) => resolve(barBeer))
        .catch(reject)
      })
      .catch(reject)
    })
  }

  static remove({ _id }, ctx) {
    return new Promise((resolve, reject) => {
      BarBeerModel.connect()
      .then((db) => {
        let collection = db.collection('barBeverages')
        collection.findOne({ _id: ObjectID(_id) })
        .then((barBeer) => {
          if (!barBeer) {
            throw new Error(JSON.stringify({ message: `BarBeer with _id: ${_id} not found.`, code: 404 }))
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
      BarBeerModel.connect()
      .then((db) => {
        let collection = db.collection('barBeverages')
        collection.findOne({ _id: ObjectID(_id) })
        .then((barBeer) => {
          if (!barBeer) {
            throw new Error(JSON.stringify({ message: `BarBeer with _id: ${_id} not found.`, code: 404 }))
          }
          resolve(barBeer)
        })
        .catch(reject)
      })
      .catch(reject)
    })
  }

  static list(skip, limit, filters, order, ctx) {
    return new Promise((resolve, reject) => {
      BarBeerModel.connect()
      .then((db) => {
        let collection = db.collection('barBeverages')
        return BarBeerModel.getFiltersAndOrder(db, filters, order)
        .then(({ where, sort }) => {
          return [
            collection.find(where).sort(sort).skip(skip).limit(limit).toArray(),
            collection.count(where),
          ]
        })
        .spread((barBeers, count) => {
          resolve({
            list: barBeers,
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
      BarBeerModel.connect()
      .then((db) => {
        return BarBeerModel.getFiltersAndOrder(db, filters, [])
        .then(({ where, sort }) => {
          let collection = db.collection('barBeverages')
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
      let where = { _beverageTypeEnum: 'BEER' }
      if (filters.beers) {
        where._beverageId = { $in: filters.beers }
      }
      if (filters.bars) {
        where._barId = { $in: filters.bars }
      }
      if (filters.barName) {
        where.barName = new RegExp(filters.barName, 'gi')
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
          case 'BAR_NAME':
            sort.barName = orderItem.direction === 'ASC' ? 1 : -1
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

module.exports = BarBeerModel
