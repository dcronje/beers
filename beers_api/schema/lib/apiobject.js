let ClassRegistry = require('./classregistry')

class APIObject {

  // cr = null

  constructor(data) {
    let { _id = 'NO_SET' } = data
    this._id = _id
    this.cr = ClassRegistry.shared()
  }

  getImageURL(path) {
    if (path) {
      if (process.env.API_PORT) {
        return `${process.env.API_PROTOCOL}://${process.env.API_DOMAIN}:${process.env.API_PORT}${path}`
      }
      return `${process.env.API_PROTOCOL}://${process.env.API_DOMAIN}${path}`
    }
    return path
  }
}

module.exports = APIObject
