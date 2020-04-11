// const supertest = require('supertest')
// const app = require('../../app')
// const mongoose = require('mongoose')
// const Album = require('../../models/albumModel')
// const User=require('../../models/userModel')
// const artistAlbumsController=require('../../controllers/artistAlbumsController')
// const sinon = require('sinon')
// const dotenv = require('dotenv')
// dotenv.config({ path: '.env' })
// const mongoDB = process.env.TEST_DATABASE
// let server, agent;

// if (process.env.TEST === '1') {
//     mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
//   } else {
//     throw new Error('Can\'t connect to db, make sure you run in test environment!')
//   }

//   let testartistViewing
// describe('test getting artist albums', () => {
//   beforeEach(async (done) => {
    
//     sinon.restore()

//     await mongoose.connection.collection('user').deleteMany({})
//     testArtist = new User({
//       _id: '5e8cfa4ffbfe6a5764b4238c',
//       name: 'Queen',
//       email: 'Queen@gmail.com',
//       href: 'http://127.0.0.1:7000/users/5e8cfa4ffbfe6a5764b4238c',
//       uri: 'spotify:users:5e8cfa4ffbfe6a5764b4238c',
//       role: 'artist',
//       password: '12378211'
//     })

//     await testArtist.save()

//     testUser = new User({
//         _id: '5e8cc89b2749544e1cdf62f0',
//         name: 'ahmed',
//         email: 'ahmedWael@gmail.com',
//         href: 'http://127.0.0.1:7000/users/5e8cc89b2749544e1cdf62f0',
//         uri: 'spotify:users:5e8cc89b2749544e1cdf62f0',
//         role: 'user',
//         password: '12378211'
//       })
  
//       await testUser.save()

//     await mongoose.connection.collection('albums').deleteMany({})
//     testAlbum = new Album({
//       _id: '5e8cfa4b1493ec60bc89c970',
//       name: 'A Night at the Opera',
//       href: 'http://127.0.0.1:7000/albums/5e8cfa4b1493ec60bc89c970',
//       uri: 'spotify:albums:5e8cfa4b1493ec60bc89c970',
//       popularity: 6089,
//       releaseDate: '2015-01-01',
//       type: 'album',
//       albumType: 'single',
//       releaseDate: '2018-01-01',
//       totalTracks:12,
//       artists: ['5e8cfa4ffbfe6a5764b4238c']
//     })

//     await testAlbum.save()

//     testAlbum2 = new Album({
//         _id: '5e8cfa4c1493ec60bc89c971',
//         name: 'Hot Space',
//         href: 'http://127.0.0.1:7000/albums/5e8cfa4c1493ec60bc89c971',
//         uri: 'spotify:albums:5e8cfa4c1493ec60bc89c971',
//         popularity: 2000,
//         releaseDate: '2015-01-01',
//         type: 'album',
//         albumType: 'single',
//         releaseDate: '2020-01-01',
//         totalTracks: 11,
//         artists: ['5e8cfa4ffbfe6a5764b4238c']
//       })
  
//       await testAlbum2.save()

//       testAlbum3 = new Album({
//         _id: '5e8cfa4c1493ec60bc89c971',
//         name: 'Oldies',
//         href: 'http://127.0.0.1:7000/albums/5e8cfa4c1493ec60bc89c971',
//         uri: 'spotify:albums:5e8cfa4c1493ec60bc89c971',
//         popularity: 2000,
//         releaseDate: '2015-01-01',
//         type: 'album',
//         albumType: 'single',
//         releaseDate: '2020-01-01',
//         totalTracks: 0,
//         artists: ['5e8cfa4ffbfe6a5764b4238c']
//       })
  
//       await testAlbum3.save()

      
//       testAlbum4 = new Album({
//         _id: '5e8d0d2fa5f7907240ef4b8f',
//         name: 'Breath',
//         href: 'http://127.0.0.1:7000/albums/5e8d0d2fa5f7907240ef4b8f',
//         uri: 'spotify:albums:5e8d0d2fa5f7907240ef4b8f',
//         popularity: 2000,
//         releaseDate: '2015-01-01',
//         type: 'album',
//         albumType: 'single',
//         releaseDate: '2020-01-01',
//         totalTracks: 5
//       })
  
//       await testAlbum4.save()

//     server = app.listen(5010, (err) => {
//     if (err) return done(err);

//     agent = supertest.agent(server); 
//     done();
//     });
   
//   })


//   afterEach(async (done) => {
//     sinon.restore()
//     //await mongoose.connection.collection('albums').deleteMany({})
//     await mongoose.connection.collection('albums').deleteMany({})
//     return server && server.close(done);
//   })

//   it('tests the get artist endpoint and have the artist of same id returned', async () => {
//     const response = await agent.get('/artists?_id=5e8cfa4ffbfe6a5764b4238c')
//     expect(response.status).toBe(200)
//     expect(response.body.status).toBe('success')
//     expect(response.body.data).not.toEqual(null)
//     expect(response.body.data._id.toString()).toMatch(testArtist._id.toString())
//   })

// })
