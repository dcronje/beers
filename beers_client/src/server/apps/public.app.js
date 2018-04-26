import path from 'path'
import express from 'express'

let appDir = path.dirname(require.main.filename)

let publicApp = express.static(path.join(appDir, './public'))

module.exports = publicApp
