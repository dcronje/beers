let _ = require('underscore')
let ApiObject = require('../../lib/apiobject')
let ClassRegistry = require('../../lib/classregistry')
let BarBeerModel = require('../barbeer/model')

class Bar extends ApiObject {

  static create(data) {
    return new Bar(data)
  }

  constructor(data) {
    super(data)
    let { name = null, logo = null, email = null, contact = null, description = null, address = null, building = null, createdAt = null, updatedAt = null } = data
    this.name = name
    this.logo = this.getImageURL(logo)
    this.email = email
    this.contact = contact
    this.description = description
    this.address = address
    this.building = building
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  allBeers(args, ctx, info) {
    return new Promise((resolve, reject) => {
      let { skip = 0, limit = 1000, filters = {}, order = [] } = args
      filters.bars = [this._id]
      BarBeerModel.list(skip, limit, filters, order, ctx)
      .then((barBeersList) => {
        barBeersList.list = _.map(barBeersList.list, (barBeer) => {
          return this.cr.get('BarBeer').create(barBeer)
        })
        resolve(barBeersList)
      })
      .catch(reject)
    })
  }

  oneBeer(args, ctx, info) {
    return new Promise((resolve, reject) => {
      let { _id } = args
      BarBeerModel.one({ _id }, ctx)
      .then((barBeer) => resolve(this.cr.get('BarBeer').create(barBeer)))
      .catch(reject)
    })
  }

  beerCount(args, ctx, info) {
    return new Promise((resolve, reject) => {
      let { filters = {} } = args
      filters.bars = [this._id]
      BarBeerModel.count(filters, ctx)
      .then((barBeerCount) => resolve(barBeerCount))
      .catch(reject)
    })
  }

}

module.exports = Bar
