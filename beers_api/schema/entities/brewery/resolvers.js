let _ = require('underscore')
let BreweryModel = require('./model')
let ClassRegistry = require('../../lib/classregistry')

let allBreweries = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { skip = 0, limit = 1000, filters = {}, order = [] } = args
    BreweryModel.list(skip, limit, filters, order, ctx)
    .then((breweryList) => {
      breweryList.list = _.map(breweryList.list, (brewery) => {
        return ClassRegistry.shared().get('Brewery').create(brewery)
      })
      resolve(breweryList)
    })
    .catch(reject)
  })
}

let oneBrewery = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { _id } = args
    BreweryModel.one({ _id }, ctx)
    .then((brewery) => resolve(ClassRegistry.shared().get('Brewery').create(brewery)))
    .catch(reject)
  })
}

let breweryCount = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { filters = {} } = args
    BreweryModel.count(filters, ctx)
    .then((breweryCount) => resolve(breweryCount))
    .catch(reject)
  })
}

let addBrewery = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { input } = args
    BreweryModel.add(input, ctx)
    .then((brewery) => resolve(ClassRegistry.shared().get('Brewery').create(brewery)))
    .catch(reject)
  })
}

let updateBrewery = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { _id, input } = args
    BreweryModel.update({ _id }, input, ctx)
    .then((brewery) => resolve(ClassRegistry.shared().get('Brewery').create(brewery)))
    .catch(reject)
  })
}

let removeBrewery = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { _id } = args
    BreweryModel.remove({ _id }, ctx)
    .then((_id) => resolve(_id))
    .catch(reject)
  })
}

module.exports = {
  allBreweries,
  oneBrewery,
  breweryCount,
  addBrewery,
  updateBrewery,
  removeBrewery,
  breweryQueryResolvers: () => ({
    allBreweries,
    oneBrewery,
    breweryCount,
  }),
  breweryMutationResolvers: () => ({
    addBrewery,
    updateBrewery,
    removeBrewery,
  }),
}
