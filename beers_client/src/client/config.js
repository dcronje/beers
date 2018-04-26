let GOOGL_API_KEY = ''
let LANGUAGE = 'en'
let API = {
  PROTOCOL: 'http',
  DOMAIN: 'localhost',
  PORT: false,
  ENDPOINT: 'api',
}

try {
  let GOOGL_API_KEY = window.env.GOOGL_API_KEY
  let API = {
    PROTOCOL: window.env.API_PROTOCOL | 'http',
    DOMAIN: window.env.API_DOMAIN | 'localhost',
    PORT: window.env.API_PORT | false,
    ENDPOINT: window.env.API_ENDPOINT | 'api',
  }
} catch (e) {
  console.log('Running on server')
}

class Config {

  static getApi() {
    if (!API.PORT) {
      return `${API.PROTOCOL}://${API.DOMAIN}/${API.ENDPOINT}`
    }
    return `${API.PROTOCOL}://${API.DOMAIN}:${API.PORT}/${API.ENDPOINT}`
  }

  static getUrl() {
    if (!API.PORT) {
      return `${API.PROTOCOL}://${API.DOMAIN}`
    }
    return `${API.PROTOCOL}://${API.DOMAIN}:${API.PORT}`
  }

  static getDefaultsUrl() {
    return `/public/images/defaults`
  }

  static getLoginURL() {
    if (!API.PORT) {
      return `${API.PROTOCOL}://${API.DOMAIN}/auth/login`
    }
    return `${API.PROTOCOL}://${API.DOMAIN}:${API.PORT}/auth/login`
  }

  static getLogoutURL() {
    if (!API.PORT) {
      return `${API.PROTOCOL}://${API.DOMAIN}/auth/logout`
    }
    return `${API.PROTOCOL}://${API.DOMAIN}:${API.PORT}/auth/logout`
  }

  static tokenValidateURL(token) {
    if (!API.PORT) {
      return `${API.PROTOCOL}://${API.DOMAIN}/auth/validate/${token}`
    }
    return `${API.PROTOCOL}://${API.DOMAIN}:${API.PORT}/auth/validate/${token}`
  }

  static tokenResetURL(token) {
    if (!API.PORT) {
      return `${API.PROTOCOL}://${API.DOMAIN}/auth/reset/${token}`
    }
    return `${API.PROTOCOL}://${API.DOMAIN}:${API.PORT}/auth/reset/${token}`
  }

  static tokenRegisterURL(token) {
    if (!API.PORT) {
      return `${API.PROTOCOL}://${API.DOMAIN}/auth/register/${token}`
    }
    return `${API.PROTOCOL}://${API.DOMAIN}:${API.PORT}/auth/register/${token}`
  }

};

export default Config
