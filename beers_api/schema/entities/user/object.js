let _ = require('underscore')
let ApiObject = require('../../lib/apiobject')
let ClassRegistry = require('../../lib/classregistry')
let RatingModel = require('../rating/model')

class User extends ApiObject {

  static create(data) {
    return new User(data)
  }

  constructor(data) {
    super(data)
    let { firstName = null, lastName = null, profileImage = null, createdAt = null, updatedAt = null } = data
    this.firstName = firstName
    this.lastName = lastName
    this.profileImage = profileImage
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  allRatings(args, ctx, info) {
    return new Promise((resolve, reject) => {
      let { skip = 0, limit = 1000, filters = {}, order = [] } = args
      filters.users = [this._id]
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
      filters.users = [this._id]
      RatingModel.count(filters, ctx)
      .then((ratings) => {
        resolve(_.map(ratings, (rating) => {
          return this.cr.get('Rating').create(rating)
        }))
      })
      .catch(reject)
    })
  }

}

module.exports = User
