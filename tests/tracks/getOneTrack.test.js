
// const trackController = require('./../../controllers/trackController')
// const mongoose = require('mongoose')
// const dotenv = require('dotenv') //  we write the cofigurations we need i.e. the environment variables in config.env file
// dotenv.config({ path: '.env' }) 
// mongoose.connect(process.env.DATABASE_LOCAL, { useNewUrlParser: true, useUnifiedTopology: true })
// const Track = require('./../../models/trackModel')
// const Album = require('./../../models/albumModel')

// //getOneTrack.test.js

// test("test1", async() => {
//   //const track= await Track.find()
//   //console.log(track)
  
//   const req={}
//   req.query={}
//   req.params={}
//   req.params.trackId='5e89d88ba9cbd307641a53b4'

//   console.log(trackController.getOneTrack)
//   let res={json:{},status:0}
//   let next
//   await trackController.getOneTrack(req,res,next).then((r)=>{console.log('abc');})

//   //trackController.getOneTrack(req,res,next)

//   console.log( await trackController.getOneTrack(req,res,next))

//   expect(res.status).toBe(200)
//   expect(res.data.track._id).toBe(req.params.trackId)
//   });


const dotenv = require('dotenv') //  we write the cofigurations we need i.e. the environment variables in config.env file
dotenv.config({ path: '.env' })
var app = require('../../app');
const request = require('supertest');
let server, agent;


describe('Test Sample', () => {
  beforeEach((done) => {
    server = app.listen(4000, (err) => {
      if (err) return done(err);

      agent = request.agent(server); // since the application is already listening, it should use the allocated port
      done();
    });
  });

  afterEach((done) => {
    return server && server.close(done);
  });

  it('gets the test endpoint', async () => {
    const response = await agent.get('/tracks/5e8a60b2d5556d3c04ba0c48')
    expect(response.status).toBe(200)
    expect(response.body.data.track._id).toBe('5e8a60b2d5556d3c04ba0c48')
    // done()
  })
});


