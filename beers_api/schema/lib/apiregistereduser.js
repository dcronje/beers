let Promise = require('bluebird')
let APIUser = require('./apiuser')
let _ = require('underscore')

class APIRegisteredUser extends APIUser {

  loadPermissions(token) {
    return new Promise((resolve, reject) => {
      _.each(this.permissions, (permission, key) => {
        this.permissions.push({
          permission: permission,
          id: null,
        })
      })
      resolve(this)
    })
  }

}

module.exports = APIRegisteredUser
