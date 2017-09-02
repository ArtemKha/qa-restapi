const express = require('express')
const router = express.Router()

// GET /questions
router.get('/', (req,res) => {
  res.json({response: "You sent me a GET request"})
})

// POST /questions
router.post('/', (req,res) => {
  res.json({
    response: "You sent me a POST request",
    body: req.body 
  })
})

// POST /questions:id
router.get('/:id', (req,res) => {
  res.json({
    response: "You sent me a GET request for ID: " + req.params.id 
  })
})


// POST /questions/:id/answers
router.post('/:qID/answers', (req, res) => {
  res.json({
    response: "You sent me a POST request to /answers",
    qusetionqId: req.params.qID,
    body: req.body
  })
})

// POST /questions/:id/answers/:aID
router.put('/:qID/answers/:aID', (req, res) => {
  res.json({
    response: "You sent me a PUT request to /answers",
    qusetionId: req.params.qID,
    answerId: req.params.aID,
    body: req.body
  })
})

// DELETE /questions/:id/answers/:aID
router.delete('/:qID/answers/:aID', (req, res) => {
  res.json({
    response: "You sent me a DELETE request to /answers",
    qusetionId: req.params.qID,
    answerId: req.params.aID,
  })
})

// POST /questions/:id/answers/:aID/vote-up 
// POST /questions/:id/answers/:aID/vote-down 
router.post('/:qID/answers/:aID/vote-:dir', (req, res, next) => {
  if (req.params.dir.search(/^(up|down)$/) === -1) {
    const err = new Error('Not found')
    err.status = 404
    next(err)
  } else {
    next()
  }
},(req, res) => {
  res.json({
    response: "You sent me a POST request to /vote-" + req.params.dir,
    qusetionId: req.params.qID,
    answerId: req.params.aID,
    vote: req.params.dir,
  })
})


module.exports = router