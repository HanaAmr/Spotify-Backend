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


describe('Update profile functionality', () => {
    let authToken = 'token'
    let id = 'testid'
    // Drop the whole users collection before testing and add a simple user to test with
    beforeEach(async () => {
      await mongoose.connection.collection('users').deleteMany({})
  
      // Creating the valid user to assign the token to him
      const validUser = new User({
        name: 'ahmed',
        email: 'ahmed@email.com',
        password: 'password',
        dateOfBirth: '1999-7-14',
        gender: 'male'
      })
      await validUser.save()
      // get the id of the document in the db to use it to get authorization token
      await User.findOne({}, (err, user) => {
        id = user._id
        authToken = 'Bearer ' + jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
      })
    })
  
    // Drop the whole users collection after finishing testing
    afterAll(async () => {
      await mongoose.connection.collection('users').deleteMany({})
    })
  
    
    // Testing update profile successfully
    it('Should update profile successfully', async () => {
        const response = await supertest(app).put('/me').send({
            name: 'mohamed',
            email: 'mohamed@email.com',
            dateOfBirth: '1990-4-10',
            gender: 'male'
        }).set('Authorization', authToken)
  
        expect(response.status).toBe(200)
        expect(response.body.status).toBe('Success')
        expect(response.body.user.name).toBe('mohamed')
        expect(response.body.user.email).toBe('mohamed@email.com')
        expect(response.body.user.gender).toBe('male')
        expect(response.body.user.dateOfBirth).toBe('1990-4-10')
    })


    it('Should not update profile due to validation errors done before', done => {

        const request = httpMocks.createRequest({
          method: 'PUT',
          url: '/me',
          user: {
              id
          },
          body: {
            
          }
        })
    
        const response = httpMocks.createResponse()
        authContoller.updateProfile(request, response, (err) => {
          try {
            expect(err).toEqual(expect.anything())
            expect(err.name).toEqual('ValidationError')
            done()

          } catch (error) {
            done(error)
          }
        })
    })

    
})