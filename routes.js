const express = require('express')
const router = express.Router()
const Question = require('./models').Question

router.param('qID', (req, res, next, id) => {
  Question.findById(id, (err, doc) => {
    if (err) return next(err)
    if (!doc) {
      const error = new Error('Not Found')
      error.status = 404
      return next(error)
    }
    req.question = doc
    return next() 
  })
})

router.param('aID', (req, res, next, id) => {
  req.answer = req.question.answers.id(id)
  if (!req.answer) {
    const error = new Error('Not Found')
    error.status = 404
    return next(error)
  }
  return next()
})


// GET /questions
router.get('/', (req,res) => {
  Question.find({})
    .sort({sort: {createdAt: -1}})
    .exec((err, questions, next) => {
            if (err) return next(err)
            res.json(questions)
          })
  res.json({response: "You sent me a GET request"})
})

// POST /questions
router.post('/', (req, res, next) => {
  const qusetion = new Question(req.body)
  qusetion.save((err, question) => {
    if (err) return next(err)
    res.status(201)
    res.json(question)
  })
})

// POST /questions:id
router.get('/:qID', (req, res) => {
  res.json(req.question)
})


// POST /questions/:id/answers
router.post('/:qID/answers', (req, res, next) => {
  req.question.answers.push(req.body)
  req.qusetion.save((err, question) => {
    if (err) return next(err)
    res.status(201)
    res.json(question)
  })
})

// POST /questions/:id/answers/:aID
router.put('/:qID/answers/:aID', (req, res) => {
  req.answer.update(req.body, (err, result) => {
    if (err) return next(err)
    req.json(result)
  })
})

// DELETE /questions/:id/answers/:aID
router.delete('/:qID/answers/:aID', (req, res) => {
  req.answer.remove(err => {
    req.question.save((err, question) => {
      res.json(question)
    })
  })
})

// POST /questions/:id/answers/:aID/vote-up 
// POST /questions/:id/answers/:aID/vote-down 
router.post('/:qID/answers/:aID/vote-:dir', (req, res, next) => {
  if (req.params.dir.search(/^(up|down)$/) === -1) {
    const err = new Error('Not found')
    err.status = 404
    return next(err)
  } else {
    next()
  }
},(req, res, next) => {
  req.answer.vote(req.vote, (err, question) => {
    if (err) return next(err)
    res.json(question)
  })
})


module.exports = router