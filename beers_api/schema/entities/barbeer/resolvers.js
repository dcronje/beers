let _ = require('underscore')
let BarBeerModel = require('./model')
let ClassRegistry = require('../../lib/classregistry')

let allBarBeers = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { skip = 0, limit = 1000, filters = {}, order = [] } = args
    BarBeerModel.list(skip, limit, filters, order, ctx)
    .then((barBeerList) => {
      barBeerList.list = _.map(barBeerList.list, (barBeer) => {
        return ClassRegistry.shared().get('BarBeer').create(barBeer)
      })
      resolve(barBeerList)
    })
    .catch(reject)
  })
}

let oneBarBeer = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { _id } = args
    BarBeerModel.one({ _id }, ctx)
    .then((barBeer) => resolve(ClassRegistry.shared().get('BarBeer').create(barBeer)))
    .catch(reject)
  })
}

let barBeerCount = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { filters = {} } = args
    BarBeerModel.count(filters, ctx)
    .then((barBeerCount) => resolve(barBeerCount))
    .catch(reject)
  })
}

let addBarBeer = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { input } = args
    BarBeerModel.add(input, ctx)
    .then((barBeer) => resolve(ClassRegistry.shared().get('BarBeer').create(barBeer)))
    .catch(reject)
  })
}

let updateBarBeer = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { _id, input } = args
    BarBeerModel.update({ _id }, input, ctx)
    .then((barBeer) => resolve(ClassRegistry.shared().get('BarBeer').create(barBeer)))
    .catch(reject)
  })
}

let removeBarBeer = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { _id } = args
    BarBeerModel.remove({ _id }, ctx)
    .then((_id) => resolve(_id))
    .catch(reject)
  })
}

module.exports = {
  allBarBeers,
  oneBarBeer,
  barBeerCount,
  addBarBeer,
  updateBarBeer,
  removeBarBeer,
  barBeerQueryResolvers: () => ({
    allBarBeers,
    oneBarBeer,
    barBeerCount,
  }),
  barBeerMutationResolvers: () => ({
    addBarBeer,
    updateBarBeer,
    removeBarBeer,
  }),
}
