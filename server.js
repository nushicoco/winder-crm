/* eslint-disable no-console */
console.log('Starting Server......')

// Config
require('dotenv-safe').load() // Load env vars from ./.env
console.log(`NODE_ENV =${process.env.NODE_ENV}`)
const port = process.env.PORT
console.log(`Port = ${port}`)

const express = require('express')
const app = express()
module.exports = app // for testing

// POST Body Parsing:
const bodyParser = require('body-parser')
app.use(bodyParser.json())

// DB:
const { sequelize } = require('./models')

// Session
const expressSession = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(expressSession.Store)
app.use(expressSession({
  name: 'winder-session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  store: new SequelizeStore({
    db: sequelize
  }),
  proxy: true // using SSL outside of node
}))

// Authentication:
const passport = require('./passportAuthentication')
app.use(passport.initialize())
app.use(passport.session())

// socket.io
var chatServer = require('http').Server(app)
chatServer.listen(process.env.CHAT_PORT, process.env.CHAT_HOST)

var io = require('socket.io')(chatServer, {origins: '*:*'})
require('./io')(app, io)

// Routes:
app.use(express.static('client/build'))
require('./routes')(app, passport, __dirname)

// All set!
app.listen(port)
