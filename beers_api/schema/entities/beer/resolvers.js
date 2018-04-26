let _ = require('underscore')
let BeerModel = require('./model')
let ClassRegistry = require('../../lib/classregistry')

let allBeers = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { skip = 0, limit = 1000, filters = {}, order = [] } = args
    BeerModel.list(skip, limit, filters, order, ctx)
    .then((beerList) => {
      beerList.list = _.map(beerList.list, (beer) => {
        return ClassRegistry.shared().get('Beer').create(beer)
      })
      resolve(beerList)
    })
    .catch(reject)
  })
}

let oneBeer = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { _id } = args
    BeerModel.one({ _id }, ctx)
    .then((beer) => resolve(ClassRegistry.shared().get('Beer').create(beer)))
    .catch(reject)
  })
}

let beerCount = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { filters = {} } = args
    BeerModel.count(filters, ctx)
    .then((beerCount) => resolve(beerCount))
    .catch(reject)
  })
}

let addBeer = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { input } = args
    BeerModel.add(input, ctx)
    .then((beer) => resolve(ClassRegistry.shared().get('Beer').create(beer)))
    .catch(reject)
  })
}

let updateBeer = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { _id, input } = args
    BeerModel.update({ _id }, input, ctx)
    .then((beer) => resolve(ClassRegistry.shared().get('Beer').create(beer)))
    .catch(reject)
  })
}

let removeBeer = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { _id } = args
    BeerModel.remove({ _id }, ctx)
    .then((_id) => resolve(_id))
    .catch(reject)
  })
}

module.exports = {
  allBeers,
  oneBeer,
  beerCount,
  addBeer,
  updateBeer,
  removeBeer,
  beerQueryResolvers: () => ({
    allBeers,
    oneBeer,
    beerCount,
  }),
  beerMutationResolvers: () => ({
    addBeer,
    updateBeer,
    removeBeer,
  }),
}
