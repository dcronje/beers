let _ = require('underscore')
let ApiObject = require('../../lib/apiobject')
let ClassRegistry = require('../../lib/classregistry')
let BarModel = require('../bar/model')
let BeerModel = require('../beer/model')

class BarBeer extends ApiObject {

  static create(data) {
    return new BarBeer(data)
  }

  constructor(data) {
    super(data)
    let { price = null, stock = null, _barId = null, _beverageId = null, createdAt = null, updatedAt = null } = data
    this.price = price
    this.stock = stock
    this._barId = _barId
    this._beverageId = _beverageId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  bar(args, ctx, info) {
    return new Promise((resolve, reject) => {
      BarModel.one({ _id: this._barId }, ctx)
      .then((bar) => resolve(this.cr.get('Bar').create(bar)))
      .catch(reject)
    })
  }

  beer(args, ctx, info) {
    return new Promise((resolve, reject) => {
      BeerModel.one({ _id: this._beverageId }, ctx)
      .then((beer) => resolve(this.cr.get('Beer').create(beer)))
      .catch(reject)
    })
  }

}

module.exports = BarBeer
