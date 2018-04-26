let Promise = require('bluebird')
let _ = require('underscore')
let { ObjectID } = require('mongodb')
let Model = require('../../lib/model')
let ClassRegistry = require('../../lib/classregistry')

class BeerModel extends Model {

  static add(input, ctx) {
    return new Promise((resolve, reject) => {
      BeerModel.connect()
      .then((db) => {
        let collection = db.collection('beverages')
        collection.insertOne(Object.assign(input, { _beverageTypeEnum: 'BEER', createdAt: new Date() }))
        .then((result) => {
          return BeerModel.one({ _id: result.insertedId })
        })
        .then((beer) => resolve(beer))
        .catch(reject)
      })
      .catch(reject)
    })
  }

  static update({ _id }, input, ctx) {
    return new Promise((resolve, reject) => {
      BeerModel.connect()
      .then((db) => {
        let collection = db.collection('beverages')
        collection.findOne({ _id: ObjectID(_id) })
        .then((beer) => {
          if (!beer) {
            throw new Error(JSON.stringify({ message: `Beer with _id: ${_id} not found.`, code: 404 }))
          }
          return collection.updateOne({ _id: ObjectID(_id) }, { $set: Object.assign(input, { updatedAt: new Date() }) })
        })
        .then(() => {
          if (input.name) {
            return db.collection('barBeverages').update({ _beverageId: ObjectID(_id) }, { $set: { beverageName: input.name } })
          } else {
            return Promise.resolve()
          }
        })
        .then(() => {
          if (input.name) {
            return db.collection('rating').update({ _beverageId: ObjectID(_id) }, { $set: { beverageName: input.name } })
          } else {
            return Promise.resolve()
          }
        })
        .then((result) => {
          return BeerModel.one({ _id: ObjectID(_id) })
        })
        .then((beer) => resolve(beer))
        .catch(reject)
      })
      .catch(reject)
    })
  }

  static remove({ _id }, ctx) {
    return new Promise((resolve, reject) => {
      BeerModel.connect()
      .then((db) => {
        let collection = db.collection('beverages')
        collection.findOne({ _id: ObjectID(_id) })
        .then((beer) => {
          if (!beer) {
            throw new Error(JSON.stringify({ message: `Beer with _id: ${_id} not found.`, code: 404 }))
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
      BeerModel.connect()
      .then((db) => {
        let collection = db.collection('beverages')
        collection.findOne({ _id: ObjectID(_id) })
        .then((beer) => {
          if (!beer) {
            throw new Error(JSON.stringify({ message: `Beer with _id: ${_id} not found.`, code: 404 }))
          }
          resolve(beer)
        })
        .catch(reject)
      })
      .catch(reject)
    })
  }

  static list(skip, limit, filters, order, ctx) {
    return new Promise((resolve, reject) => {
      BeerModel.connect()
      .then((db) => {
        let collection = db.collection('beverages')
        return BeerModel.getFiltersAndOrder(db, filters, order)
        .then(({ where, sort }) => {
          return [
            collection.find(where).sort(sort).skip(skip).limit(limit).toArray(),
            collection.count(where),
          ]
        })
        .spread((beers, count) => {
          resolve({
            list: beers,
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
      BeerModel.connect()
      .then((db) => {
        return BeerModel.getFiltersAndOrder(db, filters, [])
        .then(({ where, sort }) => {
          let collection = db.collection('beverages')
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
      if (filters.name) {
        where.name = new RegExp(filters.name, 'gi')
      }
      if (filters.breweries && filters.breweries.length) {
        where._breweryId = { $in: _.map(filters.breweries, (brewery) => ObjectID(brewery)) }
      }
      if (filters.beerTypes && filters.beerTypes.length) {
        where.beerType = { $in: filters.beerTypes }
      }
      if (filters.alcoholContent) {
        where.alcoholContent = filters.alcoholContent
      }
      if (filters.maxAlcoholContent) {
        where.alcoholContent = { $lt: filters.maxAlcoholContent }
      }
      if (filters.minAlcoholContent) {
        where.alcoholContent = { $gt: filters.minAlcoholContent }
      }
      if (filters.rating) {
        where.rating = filters.rating
      }
      if (filters.maxRating) {
        where.rating = { $lt: filters.maxRating }
      }
      if (filters.minRating) {
        where.rating = { $gt: filters.minRating }
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
          case 'BEER_TYPE':
            sort.beerType = orderItem.direction === 'ASC' ? 1 : -1
            break;
          case 'ALCOHOL_CONTENT':
            sort.alcoholContent = orderItem.direction === 'ASC' ? 1 : -1
            break;
          case 'RATING':
            sort.rating = orderItem.direction === 'ASC' ? 1 : -1
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
        if (filters.bars && filters.bars.length) {
          return db.collection('barBeverages').find({ _barId: { $in: _.map(filters.bars, (bar) => ObjectID(bar)) } }).toArray()
          .then((bars) => {
            where._id = { $in: _.map(bars, (bar) => ObjectID(bar._beverageId)) }
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

module.exports = BeerModel
