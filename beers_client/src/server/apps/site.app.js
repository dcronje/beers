import '../includes/env'
import express from 'express'
import React from 'react'
import { renderToNodeStream } from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'
import { StaticRouter } from 'react-router-dom'
import Html from '../../client/components/html'
import App from '../../client/app'

let siteApp = express()

let envOptions = {
  'FACEBOOK_APP_ID': process.env.FACEBOOK_APP_ID || '',
  'ENVIRONMENT': process.env.NODE_ENV,
  'GA_KEY': process.env.GA_KEY || false,
  'GA_CAMPAIGN_KEY': process.env.GA_CAMPAIGN_KEY || false,
  'API_PORT': process.env.API_PORT || false,
  'API_PROTOCOL': process.env.API_PROTOCOL,
  'API_DOMAIN': process.env.API_DOMAIN,
  'API_ENDPOINT': process.env.API_ENDPOINT,
}

siteApp.get('/*', (req, res, next) => {
  let context = {}
  const sheet = new ServerStyleSheet()
  const jsx = sheet.collectStyles(
    <Html>
      <StaticRouter
        location={req.url}
        context={context}>
        <App />
      </StaticRouter>
    </Html>
  )
  const stream = sheet.interleaveWithNodeStream(renderToNodeStream(jsx))
  stream.pipe(res)
})

module.exports = siteApp
