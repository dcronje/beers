let _ = require('underscore')
let ApiObject = require('../../lib/apiobject')
let ClassRegistry = require('../../lib/classregistry')
let BreweryModel = require('../brewery/model')
let BarBeerModel = require('../barbeer/model')
let RatingModel = require('../rating/model')

class Beer extends ApiObject {

  static create(data) {
    return new Beer(data)
  }

  constructor(data) {
    super(data)
    let { beerType = null, name = null, label = null, description = null, alcoholContent = null, rating = null, _breweryId = null, createdAt = null, updatedAt = null } = data
    this.beerType = beerType
    this.name = name
    this.label = this.getImageURL(label)
    this.description = description
    this.alcoholContent = alcoholContent
    this.rating = Math.round(rating * 100) / 100
    this._breweryId = _breweryId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  brewery(args, ctx, info) {
    return new Promise((resolve, reject) => {
      BreweryModel.one({ _id: this._breweryId }, ctx)
      .then((brewery) => resolve(this.cr.get('Brewery').create(brewery)))
      .catch(reject)
    })
  }

  allBars(args, ctx, info) {
    return new Promise((resolve, reject) => {
      let { skip = 0, limit = 1000, filters = {}, order = [] } = args
      filters.beverages = [this._id]
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

  oneBar(args, ctx, info) {
    return new Promise((resolve, reject) => {
      let { _id } = args
      BarBeerModel.one({ _id }, ctx)
      .then((barBeer) => resolve(this.cr.get('BarBeer').create(barBeer)))
      .catch(reject)
    })
  }

  barCount(args, ctx, info) {
    return new Promise((resolve, reject) => {
      let { filters = {} } = args
      filters.beverages = [this._id]
      BarBeerModel.count(filters, ctx)
      .then((barBeerCount) => resolve(barBeerCount))
      .catch(reject)
    })
  }

  allRatings(args, ctx, info) {
    return new Promise((resolve, reject) => {
      let { skip = 0, limit = 1000, filters = {}, order = [] } = args
      filters.beverages = [this._id]
      RatingModel.list(skip, limit, filters, order, ctx)
      .then((ratingsList) => {
        ratingsList.list = _.map(ratingsList.list, (rating) => {
          return this.cr.get('Rating').create(rating)
        })
        resolve(ratingsList)
      })
      .catch(reject)
    })
  }

  oneRating(args, ctx, info) {
    return new Promise((resolve, reject) => {
      let { _id } = args
      RatingModel.one({ _id }, ctx)
      .then((rating) => resolve(this.cr.get('Rating').create(rating)))
      .catch(reject)
    })
  }

  ratingCount(args, ctx, info) {
    return new Promise((resolve, reject) => {
      let { filters = {} } = args
      filters.beverages = [this._id]
      RatingModel.count(filters, ctx)
      .then((ratingCount) => resolve(ratingCount))
      .catch(reject)
    })
  }

}

module.exports = Beer
