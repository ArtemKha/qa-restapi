const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/sandbox')
const db = mongoose.connection

db.on('error', err => {
  console.error('connection error:', err)
})

db.once('open', () => {
  console.log('db connection successful')
  
  const Schema = mongoose.Schema
  const AnimalSchema = new Schema({
    type: { type: String, default: 'Star Sea' },
    size: String,
    color: { type: String, default: 'red' },
    mass: { type: Number, default: 500 },
    name: { type: String, default: 'NaN' },
  })

  AnimalSchema.pre('save', function(next) {
    if (this.mass >= 100)
      this.size = 'big'
    else if (this.mass >= 5)
      this.size = 'medium'
    else
      this.size = 'small'
    next()
  })

  AnimalSchema.statics.findSize = function(size, callback) {
    return this.find({ size: size }, callback)
  }
  const Animal = mongoose.model('Animal', AnimalSchema)

  const elephant = new Animal({
    type: 'fly',
    color: 'grey',
    mass: 0.5,
    name: 'Fedor',
  })

  const animal = new Animal({})

  const whale = new Animal({
    name: 'Fedor',
    type: 'whale',
  })

  const animalData = [
    {
      type: 'elephant',
      color: 'String',
      mass: 10202,
      name: 'Ivan',
    },
    {
      type: 'nutria',
      color: 'black',
      mass: 0.12,
      name: 'Chalasari',
    },
    {
      type: 'mouse',
      color: 'blue',
      mass: 12,
      name: 'Bred',
    },
    elephant,
    whale,
    animal
  ]

  Animal.remove({}, err => {
    err && console.log('Save Failed', err)
    Animal.create(animalData, (err, animals) => {
      err && console.log('Save Failed', err)
      Animal.findSize('big', (err, animals) => {
        animals.forEach(animal => {
          const { name, color, type, size } = animal
          console.log(`${name} ${color} ${type} ${size}`)
        })
        db.close(() => {
          console.log('db connection closed')
        })
      })
    })
  })
})