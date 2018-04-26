let _ = require('underscore')
let ApiObject = require('../../lib/apiobject')
let ClassRegistry = require('../../lib/classregistry')
let BeerModel = require('../beer/model')

class Brewery extends ApiObject {

  static create(data) {
    return new Brewery(data)
  }

  constructor(data) {
    super(data)
    let { name = null, logo = null, description = null, createdAt = null, updatedAt = null } = data
    this.name = name
    this.logo = this.getImageURL(logo)
    this.description = description
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  allBeers(args, ctx, info) {
    return new Promise((resolve, reject) => {
      let { skip = 0, limit = 1000, filters = {}, order = [] } = args
      filters.breweries = [this._id]
      BeerModel.list(skip, limit, filters, order, ctx)
      .then((beersList) => {
        beersList.list = _.map(beersList.list, (beer) => {
          return this.cr.get('Beer').create(beer)
        })
        resolve(beersList)
      })
      .catch(reject)
    })
  }

  oneBeer(args, ctx, info) {
    return new Promise((resolve, reject) => {
      let { _id } = args
      BeerModel.one({ _id }, ctx)
      .then((beer) => resolve(this.cr.get('Beer').create(beer)))
      .catch(reject)
    })
  }

  beerCount(args, ctx, info) {
    return new Promise((resolve, reject) => {
      let { filters = {} } = args
      filters.breweries = [this._id]
      BeerModel.count(filters, ctx)
      .then((beerCount) => resolve(beerCount))
      .catch(reject)
    })
  }

}

module.exports = Brewery
