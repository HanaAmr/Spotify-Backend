/**
 * sinon
 * @const
 */
const sinon = require('sinon')
/**
 * express module
 * User model from the database
 * @const
 */

 /**
 * mongoose for db management
 * @const
 */
const mongoose = require('mongoose')

 /**
 * the app
 * @const
 */
const app = require('./../../app')

/**
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

/**
 * jwt package to get token
 * @const
 */
const jwt = require('jsonwebtoken')

/**
 * supertest package for integration testing
 * @const
 */
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

  let server, agent;
  //Dates for stats objects
  let dateApril2020=new Date(2020,3,6)
  dateApril2020.setUTCHours(0,0,0,0)
  let dateFeb2020=new Date(2020,1,13)
  dateFeb2020.setUTCHours(0,0,0,0)
  let date2Feb2020=new Date(2020,1,15)
  date2Feb2020.setUTCHours(0,0,0,0)
  let dateJan2020=new Date(2020,0,5)
  dateJan2020.setUTCHours(0,0,0,0)
  let dateDec2019=new Date(2019,11,24)
  dateDec2019.setUTCHours(0,0,0,0)
  let dateJune2019=new Date(2019,5,4)
  dateJune2019.setUTCHours(0,0,0,0)
  let dateJan2017=new Date(2017,0,10)
  dateJan2017.setUTCHours(0,0,0,0)

  describe('Testing artist stats  controller', () => {
    let authToken
  // Add a simple user to test with
  beforeAll( async (done) => {
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
     let id="5edeec8390345d81372ea819"
    authToken = 'Bearer ' + jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN })


     const album = new Album({
        _id:"5edefb5fd1537f3f33f91340",
        name: 'Sahran',
        image: `${process.env.API_URL}/public/imgs/albums/Sahran.jpg`,
        albumType: 'album',
        externalUrls: 'this should be an externalUrl',
        type: 'album',
        genre: 'Arabic',
        totalTracks: 14,
        popularity: 400000,
            likesHistory:[
                {
                    day: dateJan2017,
                    userID: new mongoose.Types.ObjectId('5e8cfa4b1493ec60bc89c970')
                },
                {
                    day: dateDec2019,
                    userID: new mongoose.Types.ObjectId('5e8cfa4c1493ec60bc89c971')
                },
                {
                  day: dateJune2019,
                  userID: new mongoose.Types.ObjectId('5edeec8390345d81372ea819')
                },
                {
                    day: dateFeb2020,
                    userID: new mongoose.Types.ObjectId('5edd8e684739973be7409f8d')
                  },
                  {
                    day: date2Feb2020,
                    userID: new mongoose.Types.ObjectId('5edd0d2b97aa101fa834e42e')
                  },
                  {
                    day: dateApril2020,
                    userID: new mongoose.Types.ObjectId('5ed158909065d5711e3caf13')
                  },
                  {
                    day: dateApril2020,
                    userID: new mongoose.Types.ObjectId('5edcf97b98403513f44d2da6')
                  }
                ],
                listensHistory:[
                    {
                      day: dateDec2019,
                      numberOfListens: 25000
                    },
                    {
                      day: dateDec2019,
                      numberOfListens: 7000
                    },
                    {
                      day: dateJan2020,
                      numberOfListens: 5555
                    },
                    {
                      day: date2Feb2020,
                      numberOfListens: 1000
                    },
                    {
                      day: dateApril2020,
                      numberOfListens: 750
                    }]
        })

        await album.save()
        album.artists.push("5edeec8390345d81372ea819")
        await album.save()

     const track= new Track({
        _id:"5edefb60f3962c3f4257708f",
        name: 'Ana Gheir',
        type: 'track',
        externalUrl: 'this should be an externalUrl',
        externalId: 'this should be an externalId',
        trackNumber: 4,
        durationMs: 222000,
        popularity: 600000,
        album: "5edefb5fd1537f3f33f91340",
        audioFilePath: 'tracks/track10.mp3',
        listensHistory:[
            {
              day: dateDec2019,
              numberOfListens: 25000
            },
            {
              day: dateDec2019,
              numberOfListens: 7000
            },
            {
              day: dateJan2020,
              numberOfListens: 5555
            },
            {
              day: date2Feb2020,
              numberOfListens: 1000
            },
            {
              day: dateApril2020,
              numberOfListens: 750
            }],
            likesHistory:[
                {
                    day: dateJan2017,
                    userID: new mongoose.Types.ObjectId('5e8cfa4b1493ec60bc89c970')
                },
                {
                    day: dateDec2019,
                    userID: new mongoose.Types.ObjectId('5e8cfa4c1493ec60bc89c971')
                },
                {
                  day: dateJune2019,
                  userID: new mongoose.Types.ObjectId('5edeec8390345d81372ea819')
                },
                {
                    day: dateFeb2020,
                    userID: new mongoose.Types.ObjectId('5edd8e684739973be7409f8d')
                  },
                  {
                    day: date2Feb2020,
                    userID: new mongoose.Types.ObjectId('5edd0d2b97aa101fa834e42e')
                  },
                  {
                    day: dateApril2020,
                    userID: new mongoose.Types.ObjectId('5ed158909065d5711e3caf13')
                  },
                  {
                    day: dateApril2020,
                    userID: new mongoose.Types.ObjectId('5edcf97b98403513f44d2da6')
                  }
                ],
                listensHistory:[
                    {
                      day: dateDec2019,
                      numberOfListens: 25000
                    },
                    {
                      day: dateDec2019,
                      numberOfListens: 7000
                    },
                    {
                      day: dateJan2020,
                      numberOfListens: 5555
                    },
                    {
                      day: date2Feb2020,
                      numberOfListens: 1000
                    },
                    {
                      day: dateApril2020,
                      numberOfListens: 750
                    }]
      })
        await track.save()
        track.artists.push("5edeec8390345d81372ea819")
        await track.save()

        server = app.listen(5010, (err) => {
            if (err) return done(err);
            agent = supertest.agent(server); 
            done();
        });
  })  

  afterAll(async (done) => {
    await mongoose.connection.collection('users').deleteMany({})
    await mongoose.connection.collection('tracks').deleteMany({})
    await mongoose.connection.collection('albums').deleteMany({})
    return server && server.close(done);
  })
  
  it('Testing get daily likes stats for album, returns data of length 30', async () => {

    const response = await agent.get('/me/stats/likes/daily/albums/5edefb5fd1537f3f33f91340').set('Authorization', authToken)
    expect(response.status).toBe(200)
    expect(response.body.data.length).toEqual(30)
    expect(response.body.status).toEqual("success")
  })

  it('Testing get daily listens stats for album, returns data of length 30 ', async () => {

    const response = await agent.get('/me/stats/listens/daily/albums/5edefb5fd1537f3f33f91340').set('Authorization', authToken)
    expect(response.status).toBe(200)
    expect(response.body.data.length).toEqual(30)
    expect(response.body.status).toEqual("success")
  })

  it('Testing get monthly likes stats for album, returns data of length 12 ', async () => {

    const response = await agent.get('/me/stats/likes/monthly/albums/5edefb5fd1537f3f33f91340').set('Authorization', authToken)
    expect(response.status).toBe(200)
    expect(response.body.data.length).toEqual(12)
    expect(response.body.status).toEqual("success")
  })

  it('Testing get monthly listens stats for album, returns data of length 12 ', async () => {

    const response = await agent.get('/me/stats/listens/monthly/albums/5edefb5fd1537f3f33f91340').set('Authorization', authToken)
    expect(response.status).toBe(200)
    expect(response.body.data.length).toEqual(12)
    expect(response.body.status).toEqual("success")
  })

  it('Testing get yearly likes stats for album, returns data of length 5 ', async () => {

    const response = await agent.get('/me/stats/likes/yearly/albums/5edefb5fd1537f3f33f91340').set('Authorization', authToken)
    expect(response.status).toBe(200)
    expect(response.body.data.length).toEqual(5)
    expect(response.body.status).toEqual("success")
  })

  it('Testing get yearly likes stats for album, returns data of length 5 ', async () => {

    const response = await agent.get('/me/stats/listens/yearly/albums/5edefb5fd1537f3f33f91340').set('Authorization', authToken)
    expect(response.status).toBe(200)
    expect(response.body.data.length).toEqual(5)
    expect(response.body.status).toEqual("success")
  })

  it('Testing get daily likes stats for track, returns data of length 30 ', async () => {

    const response = await agent.get('/me/stats/likes/daily/tracks/5edefb60f3962c3f4257708f').set('Authorization', authToken)
    expect(response.status).toBe(200)
    expect(response.body.data.length).toEqual(30)
    expect(response.body.status).toEqual("success")
  })

  it('Testing get daily listens stats for track, returns data of length 30 ', async () => {

    const response = await agent.get('/me/stats/listens/daily/tracks/5edefb60f3962c3f4257708f').set('Authorization', authToken)
    expect(response.status).toBe(200)
    expect(response.body.data.length).toEqual(30)
    expect(response.body.status).toEqual("success")
  })

  it('Testing get monthly likes stats for track, returns data of length 12 ', async () => {

    const response = await agent.get('/me/stats/likes/monthly/tracks/5edefb60f3962c3f4257708f').set('Authorization', authToken)
    expect(response.status).toBe(200)
    expect(response.body.data.length).toEqual(12)
    expect(response.body.status).toEqual("success")
  })

  it('Testing get monthly listens stats for track, returns data of length 12 ', async () => {

    const response = await agent.get('/me/stats/listens/monthly/tracks/5edefb60f3962c3f4257708f').set('Authorization', authToken)
    expect(response.status).toBe(200)
    expect(response.body.data.length).toEqual(12)
    expect(response.body.status).toEqual("success")
  })

  it('Testing get yearly likes stats for track, returns data of length 12 ', async () => {

    const response = await agent.get('/me/stats/likes/yearly/tracks/5edefb60f3962c3f4257708f').set('Authorization', authToken)
    expect(response.status).toBe(200)
    expect(response.body.data.length).toEqual(5)
    expect(response.body.status).toEqual("success")
  })

  it('Testing get yearly listens stats for track, returns data of length 12 ', async () => {

    const response = await agent.get('/me/stats/listens/yearly/tracks/5edefb60f3962c3f4257708f').set('Authorization', authToken)
    expect(response.status).toBe(200)
    expect(response.body.data.length).toEqual(5)
    expect(response.body.status).toEqual("success")
  })
})