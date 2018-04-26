let _ = require('underscore')
let ApiObject = require('../../lib/apiobject')
let ClassRegistry = require('../../lib/classregistry')
let BeerModel = require('../beer/model')
let UserModel = require('../user/model')

class Rating extends ApiObject {

  static create(data) {
    return new Rating(data)
  }

  constructor(data) {
    super(data)
    let { value = null, review = null, _beverageId = null, _userId = null, createdAt = null, updatedAt = null } = data
    this.value = value
    this.review = review
    this._beverageId = _beverageId
    this._userId = _userId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  beer(args, ctx, info) {
    return new Promise((resolve, reject) => {
      BeerModel.one({ _id: this._beverageId }, ctx)
        .then((beer) => resolve(this.cr.get('Beer').create(beer)))
        .catch(reject)
    })
  }

  user(args, ctx, info) {
    return new Promise((resolve, reject) => {
      UserModel.one({ _id: this._userId }, ctx)
        .then((user) => resolve(this.cr.get('User').create(user)))
        .catch(reject)
    })
  }

}

module.exports = Rating
