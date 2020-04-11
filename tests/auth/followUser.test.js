const supertest = require('supertest')
const app = require('./../../app')
const httpMocks = require('node-mocks-http')
const mongoose = require('mongoose')
const User = require('./../../models/userModel')
const authContoller = require('./../../controllers/authController')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config({ path: '.env' })
const mongoDB = process.env.DATABASE_LOCAL

jest.setTimeout(10000)

if (process.env.TEST === '1') {
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
} else {
  throw new Error('Can\'t connect to db, make sure you run in test environment!')
}


describe('Follow user functionality', () => {
    let authToken = 'token'
    let id = 'testid'
    let id2 = ''
    // Drop the whole users collection before testing and add a simple user to test with
    beforeEach(async () => {
      await mongoose.connection.collection('users').deleteMany({})
  
      // Creating a user to follow another user
      const firstUser = new User({
        name: 'ahmed',
        email: 'ahmed@email.com',
        password: 'password',
        dateOfBirth: '1999-7-14',
        gender: 'male'
      })
      await firstUser.save()
      // get the id of the document in the db to use it to get authorization token
      await User.findOne({}, (err, user) => {
        id = user._id
        authToken = 'Bearer ' + jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
      })

      
      // Creating a user to be followed
       const secondUser = new User({
        name: 'omar',
        email: 'omar@email.com',
        password: 'password',
      })
      await secondUser.save()

      id2 = secondUser._id

    })
  
    //Drop the whole users collection after finishing testing
    afterAll(async () => {
      await mongoose.connection.collection('users').deleteMany({})
    })
  
    
    // Testing follow user successfully
    it('Should follow user successfully', async () => {
        const response = await supertest(app).put('/me/following').send({
            id: id2
        }).set('Authorization', authToken)
  
        expect(response.status).toBe(204)
    })


   
})