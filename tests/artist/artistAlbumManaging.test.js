/**
 * sinon
 * @const
 */
const sinon = require('sinon')
const httpMocks = require('node-mocks-http')
const app = require('./../../app')
const artistAlbumController = require('../../controllers/artistAlbumsController')
/**
 * mongoose for db management
 * @const
 */
const mongoose = require('mongoose')

/**
 * express module
 * User model from the database
 * @const
 */
const User = require('../../models/userModel')

/**
 * Album model from the database
 * @const
 */
const Album = require('../../models/albumModel')

/**
 * Track model from the database
 * @const
 */
const Track = require('../../models/trackModel')

const jwt = require('jsonwebtoken')
const supertest = require('supertest')
/**
 * dotenv for environment variables
 * @const
 */
const dotenv = require('dotenv')
// Configuring environment variables to use them
dotenv.config()
const mongoDB = process.env.TEST_DATABASE
// Connecting to the database
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

describe('Testing artist album managmenet module', () => {
  let authToken
  // Add a simple user to test with
  beforeEach(async () => {
    await mongoose.connection.collection('users').deleteMany({})
    await mongoose.connection.collection('albums').deleteMany({})
    await mongoose.connection.collection('tracks').deleteMany({})
    sinon.restore()

    const artist = new User({
      _id: '5edeec8390345d81372ea819',
      name: 'Amr Diab',
      email: 'amr@email.com',
      password: 'password3',
      gender: 'male',
      dateOfBirth: '1952-1-8',
      role: 'artist',
      artistInfo: {
        biography: 'Amr Diab (Amr Abd-Albaset Abd-Alaziz Diab), born on the 11th of October 1961 in Port Said, Egypt, he is an Egyptian Singer, he is known as the Father of Mediterranean Music. ... Amr Diab has earned his bachelor degree in Arabic Music and graduated from the Cairo Academy of Arts in 1986.',
        popularity: 1000000,
        genres: ['Arabic pop', 'pop rock']
      }
    })

    await artist.save()
    const id = '5edeec8390345d81372ea819'
    authToken = 'Bearer ' + jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })

    const album = new Album({
      _id: '5edefb5fd1537f3f33f91340',
      name: 'Sahran',
      image: `${process.env.API_URL}/public/imgs/albums/Sahran.jpg`,
      albumType: 'album',
      externalUrls: 'this should be an externalUrl',
      type: 'album',
      genre: 'Arabic',
      label: 'Amr Diab',
      copyrights: '© 2020 Nay',
      releaseDate: '2020-01-01',
      totalTracks: 14,
      popularity: 400000
    })
    await album.save()
    album.artists.push('5edeec8390345d81372ea819')
    await album.save()

    const albums = await Album.find({})
    const track = new Track({
      _id: '5edefb60f3962c3f4257708f',
      name: 'Ana Gheir',
      type: 'track',
      externalUrl: 'this should be an externalUrl',
      externalId: 'this should be an externalId',
      trackNumber: 4,
      durationMs: 222000,
      popularity: 600000,
      album: '5edefb5fd1537f3f33f91340',
      audioFilePath: 'tracks/track10.mp3',
      artists: []

    })
    await track.save()
    track.artists.push(artist._id)
    await track.save()
  })

  // Drop the whole users, playHistory collection after finishing testing
  afterEach(async () => {
    await mongoose.connection.collection('users').deleteMany({})
    await mongoose.connection.collection('tracks').deleteMany({})
  })

  // Integration testing for edit track
  it('Testing edit track endpoint', async () => {
    const response = await supertest(app).patch('/me/albums/5edefb5fd1537f3f33f91340/tracks/5edefb60f3962c3f4257708f').send({
      name: 'ana ghir'
    }).set('Authorization', authToken)

    expect(response.status).toBe(200)
    const trackAfterEdit = await Track.findById('5edefb60f3962c3f4257708f')
    expect(trackAfterEdit.name).toMatch('ana ghir')
  })

  // Integration testing for edit album
  it('Testing edit album endpoint', async () => {
    const response = await supertest(app).patch('/me/albums/5edefb5fd1537f3f33f91340').send({
      name: 'Sahran2',
      albumType: 'pop'
    }).set('Authorization', authToken)

    expect(response.status).toBe(200)
    const albumAfterEdit = await Album.findById('5edefb5fd1537f3f33f91340')
    expect(albumAfterEdit.name).toMatch('Sahran2')
    expect(albumAfterEdit.albumType).toMatch('pop')
  })

  it('Testing delete album endpoint', async () => {
    const response = await supertest(app).delete('/me/albums/5edefb5fd1537f3f33f91340').set('Authorization', authToken)

    expect(response.status).toBe(204)
    const albumAfterEdit = await Album.findById('5edefb5fd1537f3f33f91340')
    expect(albumAfterEdit).toEqual(null)
    const tracks = await Track.find({ album: '5edefb5fd1537f3f33f91340' })
    expect(tracks.length).toEqual(0)
  })

  it('Testing delete track endpoint', done => {
    const request = httpMocks.createRequest({
      method: 'DELETE',
      url: '/me/albums/5edefb5fd1537f3f33f91340/tracks/5edefb60f3962c3f4257708f',
      params: {
        albumId: '5edefb5fd1537f3f33f91340',
        id: '5edefb60f3962c3f4257708f'
      },
      headers: {
        Authorization: authToken
      }
    })

    const response = httpMocks.createResponse()

    try {
      expect(response.statusCode).toEqual(200)
      done()
    } catch (error) {
      done(error)
    }
  })

  it('Testing uploading album with no image, album should not be uploaded', done => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/me/albums',
      body: {
        name: 'new Album',
        genre: 'pop',
        albumType: 'single'
      },
      headers: {
        Authorization: authToken
      }
    })

    const response = httpMocks.createResponse()
    artistAlbumController.addAlbum(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).toEqual(484)
        expect(err.status).toEqual('fail')
        expect(err.message).toEqual("No file received, can\'t add album without an image")

        done()
      } catch (error) {
        done(error)
      }
    })
  })

  it('Testing uploading track with no audio file, track should not be uploaded', done => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/me/albums/5edefb5fd1537f3f33f91340/tracks',
      params: { id: '5edefb5fd1537f3f33f91340' },
      body: {
        name: 'new track'
      },
      headers: {
        Authorization: authToken
      }

    })

    const response = httpMocks.createResponse()
    artistAlbumController.addTracktoAlbum(request, response, (err) => {
      try {
        expect(err).toEqual(expect.anything())
        expect(err.statusCode).toEqual(484)
        expect(err.status).toEqual('fail')
        expect(err.message).toEqual('No audio file received, can\'t add track without mp3 file')
        done()
      } catch (error) {
        done(error)
      }
    })
  })

  it('Testing getting artist albums endpoint', async () => {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/me/albums',
      headers: {
        Authorization: authToken
      }
    })

    const response = httpMocks.createResponse()
    artistAlbumController.getArtistAlbums(request, response, (err) => {
      response.on('end', async () => {
        try {
          expect(response.status).toBe(204)
          expect(response.body).not.toEqual(null)
          expect(response.body.status).toEqual('success')
          expect(response.body.data._id).toEqual('5edefb5fd1537f3f33f91340')

          done()
        } catch (error) {
          done(error)
        }
      })
    })
  })
})
