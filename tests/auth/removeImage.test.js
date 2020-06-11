const supertest = require('supertest')
const app = require('../../app')
const httpMocks = require('node-mocks-http')
const mongoose = require('mongoose')
const User = require('../../models/userModel')
const authContoller = require('../../controllers/authController')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config({ path: '.env' })
const mongoDB = process.env.TEST_DATABASE

jest.setTimeout(10000)

if (process.env.TEST === '1') {
  mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
} else {
  throw new Error('Can\'t connect to db, make sure you run in test environment!')
}


describe('Get remove image functionality', () => {
    let authToken = ''
    let id = ''
    let id2 = ''
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


      const secondUser = new User({
        name: 'omar',
        email: 'omar@email.com',
        password: 'password',
      })
      await secondUser.save()
      id2 = secondUser._id
      secondUser.images = []
      await secondUser.save()
      

    })
  
    // Drop the whole users collection after finishing testing
    afterAll(async () => {
      await mongoose.connection.collection('users').deleteMany({})
    })
  
    // Testing getting remove image successfully.
    it('Should get remove image successfully', async () => {

      const response = await supertest(app).delete('/me/image').set('Authorization', authToken)

      expect(response.status).toBe(200)
      expect(response.body.status).toBe('Image removed successfully')
    })



    it('Should not remove image', done => {
    
      const request = httpMocks.createRequest({
        method: 'DELETE',
        url: '/me/image',
        user: {
          id2
        }
      })
  
      const response = httpMocks.createResponse()
      authContoller.removeImage(request, response, (err) => {
        try {
         expect(err).toEqual(expect.anything())

          done()
        } catch (error) {
          done(error)
        }
      })
    })

    
})