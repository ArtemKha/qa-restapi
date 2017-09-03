const express = require('express')
const app = express()
const routes = require('./routes')

const jsonParser = require('body-parser').json
const logger = require('morgan')

app.use(logger('dev'))
app.use(jsonParser())

const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/qa')
const db = mongoose.connection

db.on('error', err => {
  console.error('connection error:', err)
})

db.once('open', () => {
  console.log('db connection successful')
})

app.use("/questions", routes)

app.use((req, res, next) => {
  const err = new Error('Not found')
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  res.status(err.staus || 500)
  res.json({
    error: {
      message: err.message
    }
  })
})
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('Express server is listening on port', port)
})