import './includes/env'
import express from 'express'
import chalk from 'chalk'
import { siteApp, publicApp } from './apps/'

console.log(`\n\n ***   [${chalk.blue(`STARTING WEB SERVER`)}]   ***\n`)
let app = express()

app.use(publicApp)
app.use(siteApp)

app.listen(process.env.PORT)
