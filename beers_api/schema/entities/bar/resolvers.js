let _ = require('underscore')
let BarModel = require('./model')
let ClassRegistry = require('../../lib/classregistry')

let allBars = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { skip = 0, limit = 1000, filters = {}, order = [] } = args
    BarModel.list(skip, limit, filters, order, ctx)
    .then((barList) => {
      barList.list = _.map(barList.list, (bar) => {
        return ClassRegistry.shared().get('Bar').create(bar)
      })
      resolve(barList)
    })
    .catch(reject)
  })
}

let oneBar = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { _id } = args
    BarModel.one({ _id }, ctx)
    .then((bar) => resolve(ClassRegistry.shared().get('Bar').create(bar)))
    .catch(reject)
  })
}

let barCount = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { filters = {} } = args
    BarModel.count(filters, ctx)
    .then((barCount) => resolve(barCount))
    .catch(reject)
  })
}

let addBar = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { input } = args
    BarModel.add(input, ctx)
    .then((bar) => resolve(ClassRegistry.shared().get('Bar').create(bar)))
    .catch(reject)
  })
}

let updateBar = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { _id, input } = args
    BarModel.update({ _id }, input, ctx)
    .then((bar) => resolve(ClassRegistry.shared().get('Bar').create(bar)))
    .catch(reject)
  })
}

let removeBar = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { _id } = args
    BarModel.remove({ _id }, ctx)
    .then((_id) => resolve(_id))
    .catch(reject)
  })
}

module.exports = {
  allBars,
  oneBar,
  barCount,
  addBar,
  updateBar,
  removeBar,
  barQueryResolvers: () => ({
    allBars,
    oneBar,
    barCount,
  }),
  barMutationResolvers: () => ({
    addBar,
    updateBar,
    removeBar,
  }),
}
