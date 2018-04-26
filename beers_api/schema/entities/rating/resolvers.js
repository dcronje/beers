let _ = require('underscore')
let RatingModel = require('./model')
let ClassRegistry = require('../../lib/classregistry')

let allRatings = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { skip = 0, limit = 1000, filters = {}, order = [] } = args
    RatingModel.list(skip, limit, filters, order, ctx)
    .then((ratingList) => {
      ratingList.list = _.map(ratingList.list, (rating) => {
        return ClassRegistry.shared().get('Rating').create(rating)
      })
      resolve(ratingList)
    })
    .catch(reject)
  })
}

let oneRating = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { _id } = args
    RatingModel.one({ _id }, ctx)
    .then((rating) => resolve(ClassRegistry.shared().get('Rating').create(rating)))
    .catch(reject)
  })
}

let ratingCount = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { filters = {} } = args
    RatingModel.count(filters, ctx)
    .then((ratingCount) => resolve(ratingCount))
    .catch(reject)
  })
}

let addRating = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { input } = args
    RatingModel.add(input, ctx)
    .then((rating) => resolve(ClassRegistry.shared().get('Rating').create(rating)))
    .catch(reject)
  })
}

let updateRating = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { _id, input } = args
    RatingModel.update({ _id }, input, ctx)
    .then((rating) => resolve(ClassRegistry.shared().get('Rating').create(rating)))
    .catch(reject)
  })
}

let removeRating = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { _id } = args
    RatingModel.remove({ _id }, ctx)
    .then((_id) => resolve(_id))
    .catch(reject)
  })
}

module.exports = {
  allRatings,
  oneRating,
  ratingCount,
  addRating,
  updateRating,
  removeRating,
  ratingQueryResolvers: () => ({
    allRatings,
    oneRating,
    ratingCount,
  }),
  ratingMutationResolvers: () => ({
    addRating,
    updateRating,
    removeRating,
  }),
}
