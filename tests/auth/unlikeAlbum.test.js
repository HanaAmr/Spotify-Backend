const supertest = require('supertest')
const app = require('./../../app')
const httpMocks = require('node-mocks-http')
const mongoose = require('mongoose')
const User = require('./../../models/userModel')
const Album = require('./../../models/albumModel')
const authContoller = require('./../../controllers/authController')
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


describe('Unike album functionaly', () => {
    let authToken = ''
    let id = ''
    let albumId = ''
    let albumId2 = ''
    // Drop the whole users collection before testing and add a simple user to test with
    beforeEach(async () => {
      await mongoose.connection.collection('users').deleteMany({})
      await mongoose.connection.collection('albums').deleteMany({})

      // Creating a user 
      const user = new User({
        name: 'ahmed',
        email: 'ahmed@email.com',
        password: 'password',
        dateOfBirth: '1999-7-14',
        gender: 'male'
      })
      await user.save()
      // get the id of the document in the db to use it to get authorization token
      await User.findOne({}, (err, user) => {
        id = user._id
        authToken = 'Bearer ' + jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })
      })

      
      
       const album = new Album({
        name: 'Divide',
        image: `${process.env.API_URL}/public/imgs/albums/Divide.jpg`,
        albumType: 'album',
        genre: 'Pop-rock'
      })
      await album.save()
      albumId = album._id

      user.likedAlbums.push(album._id)
      await user.save()


      const album2 = new Album({
        name: 'album2',
        image: `${process.env.API_URL}/public/imgs/albums/Divide.jpg`,
        albumType: 'album',
        genre: 'Pop-rock'
      })
      await album2.save()
      albumId2 = album2._id

    })

    //Drop the whole collections
    afterAll(async () => {
      await mongoose.connection.collection('users').deleteMany({})
      await mongoose.connection.collection('albums').deleteMany({})
    })
  
    
    // Testing unlike album successfully
    it('Should unlike album successfully', async () => {
        const response = await supertest(app).delete('/me/unlikeAlbum').send({
            id: albumId
        }).set('Authorization', authToken)
  
        expect(response.status).toBe(204)
    })


    it('Should not unlike album', done => {
    
      const request = httpMocks.createRequest({
        method: 'DELETE',
        url: '/me/unlikeAlbum',
        user: {
          id
      },
        body: {
            "id": id
        }
      })
  
      const response = httpMocks.createResponse()
      authContoller.unlikeAlbum(request, response, (err) => {
        try {
          expect(err).toEqual(expect.anything())
          expect(err.statusCode).toEqual(400)
          expect(err.status).toEqual('fail')
  
          done()
        } catch (error) {
          done(error)
        }
      })
    })


    it('Should not unlike album', done => {
    
      const request = httpMocks.createRequest({
        method: 'DELETE',
        url: '/me/unlikeAlbum',
        user: {
          id
      },
        body: {
            "id": albumId2
        }
      })
  
      const response = httpMocks.createResponse()
      authContoller.unlikeAlbum(request, response, (err) => {
        try {
          expect(err).toEqual(expect.anything())
          expect(err.statusCode).toEqual(400)
          expect(err.status).toEqual('fail')
  
          done()
        } catch (error) {
          done(error)
        }
      })
    })

   
})