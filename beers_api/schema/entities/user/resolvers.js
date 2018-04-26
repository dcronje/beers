let _ = require('underscore')
let UserModel = require('./model')
let ClassRegistry = require('../../lib/classregistry')

let allUsers = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { skip = 0, limit = 1000, filters = {}, order = [] } = args
    UserModel.list(skip, limit, filters, order, ctx)
    .then((userList) => {
      userList.list = _.map(userList.list, (user) => {
        return ClassRegistry.shared().get('User').create(user)
      })
      resolve(userList)
    })
    .catch(reject)
  })
}

let oneUser = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { _id } = args
    UserModel.one({ _id }, ctx)
    .then((user) => resolve(ClassRegistry.shared().get('User').create(user)))
    .catch(reject)
  })
}

let userCount = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { filters = {} } = args
    UserModel.count(filters, ctx)
    .then((userCount) => resolve(userCount))
    .catch(reject)
  })
}

let addUser = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { input } = args
    UserModel.add(input, ctx)
    .then((user) => resolve(ClassRegistry.shared().get('User').create(user)))
    .catch(reject)
  })
}

let updateUser = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { _id, input } = args
    UserModel.update({ _id }, input, ctx)
    .then((user) => resolve(ClassRegistry.shared().get('User').create(user)))
    .catch(reject)
  })
}

let removeUser = (obj, args, ctx, info) => {
  return new Promise((resolve, reject) => {
    let { _id } = args
    UserModel.remove({ _id }, ctx)
    .then((_id) => resolve(_id))
    .catch(reject)
  })
}

module.exports = {
  allUsers,
  oneUser,
  userCount,
  addUser,
  updateUser,
  removeUser,
  userQueryResolvers: () => ({
    allUsers,
    oneUser,
    userCount,
  }),
  userMutationResolvers: () => ({
    addUser,
    updateUser,
    removeUser,
  }),
}
