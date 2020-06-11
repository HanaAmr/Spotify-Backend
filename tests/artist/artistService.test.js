/**
 * sinon
 * @const
 */
const sinon = require('sinon')



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


/**
 * artist service: module to be tested
 * @const
 */
const artistService=require('../../services/artistService')


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

  //Some dates that will be used later on in testing
  //Dates for daily stats
  let todayDate=new Date(Date.now())
  todayDate.setUTCHours(0,0,0,0)
  let date1=new Date(todayDate)
  date1.setUTCDate(date1.getUTCDate()+1)
  let date2=new Date(date1)
  date2.setUTCDate(date2.getUTCDate()+1)

  //Dates for monthly stats
  let dateFeb=new Date(2020,1,13)
  dateFeb.setUTCHours(0,0,0,0)
  let date2Feb=new Date(2020,1,15)
  date2Feb.setUTCHours(0,0,0,0)
  let dateJan=new Date(2020,0,5)
  dateJan.setUTCHours(0,0,0,0)
  let dateDec=new Date(2019,11,24)
  dateDec.setUTCHours(0,0,0,0)

  //Dates for yearly stats
  let date2020=new Date(2020,3,6)
  date2020.setUTCHours(0,0,0,0)
  let date2019=new Date(2019,5,4)
  date2019.setUTCHours(0,0,0,0)
  let date2017=new Date(2017,0,10)
  date2017.setUTCHours(0,0,0,0)
  
  

  // Testing shufflng queue list for a user.
describe('Testing adding user to empty likes/ listens object of a track or album', () => {
    // Add a simple user to test with
    beforeAll(async () => {
      await mongoose.connection.collection('users').deleteMany({})
      await mongoose.connection.collection('albums').deleteMany({})
      await mongoose.connection.collection('tracks').deleteMany({})
      sinon.restore()
      // Creating the valid user to assign the token to him
      const user = new User({
        _id:'5edeec8390345d81372ea819',
        name: 'nada',
        email: 'nada_@email.com',
        password: 'password'
      })
      await user.save()

      //adding album without any listens or likes history
      const album = new Album({
        _id:"5edefb5fd1537f3f33f91340",
        name: 'Sahran',
        image: `${process.env.API_URL}/public/imgs/albums/Sahran.jpg`,
        albumType: 'album',
        externalUrls: 'this should be an externalUrl',
        type: 'album',
        genre: 'Arabic',
        totalTracks: 14,
        popularity: 400000
    })
    await album.save()

    //adding track without any likes or listens
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
        audioFilePath: 'tracks/track10.mp3'
    
      })
      await track.save()
    })

    // Drop the whole users, playHistory collection after finishing testing
    afterAll(async () => {
      await mongoose.connection.collection('users').deleteMany({})
      await mongoose.connection.collection('albums').deleteMany({})
      await mongoose.connection.collection('tracks').deleteMany({})
    })
    
    

    // Testing adding like whe user haven't likes album before
    it('Should add the user id and cuurent date to 1st object in album likes array', async () => {
      //expect.hasAssertions()
      artistServiceClass = new artistService.artistService()
      let albumObject=await Album.findById("5edefb5fd1537f3f33f91340")
      await artistServiceClass.alterTrackorAlbumObjectLikes(albumObject,'5edeec8390345d81372ea819')
      albumObject=await Album.findById("5edefb5fd1537f3f33f91340")
      expect(albumObject.likesHistory[0].userID.toString()).toMatch('5edeec8390345d81372ea819')
      expect(albumObject.likesHistory[0].day.getTime()).toEqual(todayDate.getTime())
      
    })

    
    it('Should add cuurent date to 1st object in track listens array, and number of likes =1', async () => {
        artistServiceClass = new artistService.artistService()
        let track=await Track.findById("5edefb60f3962c3f4257708f")
        await artistServiceClass.altertrackOrAlbumObjectListens(track,'5edeec8390345d81372ea819')
        track=await Track.findById("5edefb60f3962c3f4257708f")
        expect(track.listensHistory[0].numberOfListens).toEqual(1)
        expect(track.listensHistory[0].day.getTime()).toEqual(todayDate.getTime())
        
      })
  })
  

    //Testing adding Like of user for a non empty likes/listens object in track or album
describe('Testing adding user to likes object of a track or album', () => {
    // Add a simple user to test with
    beforeAll(async () => {
      await mongoose.connection.collection('users').deleteMany({})
      await mongoose.connection.collection('albums').deleteMany({})
      await mongoose.connection.collection('tracks').deleteMany({})
      sinon.restore()
      // Creating the valid user to assign the token to him
      const user = new User({
        _id:'5edeec8390345d81372ea819',
        name: 'nada',
        email: 'nada_@email.com',
        password: 'password'
      })
      await user.save()

    //adding track with 1 one likes object of user
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
              day: todayDate,
              numberOfListens: 99
            }],
            likesHistory:[
                {
                  day: todayDate,
                  userID: new mongoose.Types.ObjectId('5edeec8390345d81372ea819')
                }]
    
      })
      await track.save()
    })

    // Drop the whole users, playHistory collection after finishing testing
    afterAll(async () => {
      await mongoose.connection.collection('users').deleteMany({})
      await mongoose.connection.collection('tracks').deleteMany({})
    })
    
    //Testing alter likes object in track with the user already liking it, so length of likes array should equal 1
    it('Testing ater likes for a track when user liked the track before, should not add a new likes object to like history array', async () => {
        artistServiceClass = new artistService.artistService()
        let track=await Track.findById("5edefb60f3962c3f4257708f")
        await artistServiceClass.alterTrackorAlbumObjectLikes(track,'5edeec8390345d81372ea819')
        track=await Track.findById("5edefb60f3962c3f4257708f")
        expect(track.likesHistory.length).toEqual(1)
      })
   
      //Testing alter listens object in track where date already exists in listensHistory, should add number of listens instead of creating a new listens object
    it('Testing ater listens for a track when date already exists in listensHistory, number of listens should be incremented', async () => {
        artistServiceClass = new artistService.artistService()
        let track=await Track.findById("5edefb60f3962c3f4257708f")
        await artistServiceClass.altertrackOrAlbumObjectListens(track,'5edeec8390345d81372ea819')
        track=await Track.findById("5edefb60f3962c3f4257708f")
        expect(track.listensHistory[0].numberOfListens).toEqual(100)
      })
  })


    //Testing Getting track and album getting daily likes stats
describe('Testing calculating daily listens and likes statitics for albums and tracks', () => {
    // Add a simple user to test with
    beforeAll(async () => {
      await mongoose.connection.collection('albums').deleteMany({})
      await mongoose.connection.collection('tracks').deleteMany({})
      sinon.restore()
    
      

    //adding track with 1 one likes object of user
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
              day: todayDate,
              numberOfListens: 99
            }],
            likesHistory:[
                {
                  day: todayDate,
                  userID: new mongoose.Types.ObjectId('5edeec8390345d81372ea819')
                },
                {
                    day: todayDate,
                    userID: new mongoose.Types.ObjectId('5edd8e684739973be7409f8d')
                  },
                  {
                    day: todayDate,
                    userID: new mongoose.Types.ObjectId('5edd0d2b97aa101fa834e42e')
                  },
                  {
                    day: todayDate,
                    userID: new mongoose.Types.ObjectId('5ed158909065d5711e3caf13')
                  },
                  {
                    day: date2,
                    userID: new mongoose.Types.ObjectId('5edcf97b98403513f44d2da6')
                  }
                ]
      })
      await track.save()

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
        listensHistory:[
            {
              day: todayDate,
              numberOfListens: 60000
            },
            {
              day: date1,
              numberOfListens: 50000
            },
            {
              day: date2,
              numberOfListens: 230
            }
            ]
    })
    await album.save()

    })

    afterAll(async () => {
      await mongoose.connection.collection('albums').deleteMany({})
      await mongoose.connection.collection('tracks').deleteMany({})
    })
    
    it('Testing getting intial date checking limit from an album object for yearly stats', async () => {
      let lowerLimitDate=new Date(todayDate)
      const album=await Album.findById("5edefb5fd1537f3f33f91340")
      const length=album.listensHistory.length
      let upperLimitDate=new Date(intializeDateLimits("listens","yearly",length,album,lowerLimitDate))

      expect(lowerLimitDate.getUTCDate()).toEqual(1)
      expect(lowerLimitDate.getUTCMonth()).toEqual(0)
      expect(lowerLimitDate.getUTCFullYear()).toEqual(date2.getUTCFullYear())
      expect(upperLimitDate.getUTCFullYear()).toEqual(lowerLimitDate.getUTCFullYear()+1)
      expect(upperLimitDate.getUTCDate()).toEqual(1)
      expect(upperLimitDate.getUTCMonth()).toEqual(0)
    })

    //Testing getting daily likes statistics for track, dates should be sequential
    it('Testing getting daily likes stats for track, likes object should have sequential ', async () => {
        artistServiceClass = new artistService.artistService()
        let track=await Track.findById("5edefb60f3962c3f4257708f")
        const dailyStats=await artistServiceClass.getDalyLikesStats(track)
        let dateTobeChecked= new Date(date2)
        expect(dailyStats[29].numberOfLikes).toEqual(1)
        expect(dailyStats[27].numberOfLikes).toEqual(4)
        expect(dailyStats.length).toEqual(30)
        for(var i=29;i>-1;i--)
        {
            expect(dailyStats[i].day.getTime()).toEqual(dateTobeChecked.getTime())
            dateTobeChecked.setUTCDate(dateTobeChecked.getUTCDate()-1)
        }
      })

      
     //Testing getting daily listens statistics for album, dates should be sequential
    it('Testing getting daily listens stats for album, likes object should have sequential dates', async () => {
        artistServiceClass = new artistService.artistService()
        album=await Album.findById("5edefb5fd1537f3f33f91340")
        const dailyStats=await artistServiceClass.getDailyListensStats(album)
        expect(dailyStats.length).toEqual(30)
        let dateTobeChecked= new Date(date2)
        for(var i=29;i>-1;i--)
        {
            expect(dailyStats[i].day.getTime()).toEqual(dateTobeChecked.getTime())
            dateTobeChecked.setUTCDate(dateTobeChecked.getUTCDate()-1)
        }
      })
  })


    //Testing get Monthly and yealy likes/listens stats for album and track
describe('Testing get Monthly and yearly likes/listens stats for album and track', () => {

  beforeAll(async () => {
    await mongoose.connection.collection('albums').deleteMany({})
    await mongoose.connection.collection('tracks').deleteMany({})
    sinon.restore()

    const track = new Track({
      _id:"5edefb60f3962c3f4257708f",
      name: 'Youm Talat',
      type: 'track',
      externalUrl: 'this should be an externalUrl',
      externalId: 'this should be an externalId',
      trackNumber: 1,
      durationMs: 212000,
      popularity: 200000,
      audioFilePath: 'tracks/track3.mp3',
      listensHistory:[
        {
          day: date2017,
          numberOfListens: 30000
        },
        {
          day: date2019,
          numberOfListens: 25000
        },
        {
          day: date2020,
          numberOfListens: 750
        }]
  
    })
    await track.save()

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
          day: dateDec,
          userID: new mongoose.Types.ObjectId('5edeec8390345d81372ea819')
        },
        {
            day: dateJan,
            userID: new mongoose.Types.ObjectId('5edd8e684739973be7409f8d')
          },
          {
            day: dateJan,
            userID: new mongoose.Types.ObjectId('5edd0d2b97aa101fa834e42e')
          },
          {
            day: dateFeb,
            userID: new mongoose.Types.ObjectId('5ed158909065d5711e3caf13')
          },
          {
            day: date2Feb,
            userID: new mongoose.Types.ObjectId('5edcf97b98403513f44d2da6')
          }
        ]
    })
  await album.save()
  })
  afterAll(async () => {
    await mongoose.connection.collection('albums').deleteMany({})
    await mongoose.connection.collection('tracks').deleteMany({})
  })

  //Testing getting yearly listens stats for track
  it('Testing getting yearly listens stats for track, stats object should have sequential dates', async () => {
    artistServiceClass = new artistService.artistService()
    let track=await Track.findById("5edefb60f3962c3f4257708f")
    const yearlyStats=await artistServiceClass.getMonthlyOrYearlyStats(track,"yearly","listens")
    let dateTobeChecked= new Date(date2020)
    dateTobeChecked.setUTCDate(1)
    dateTobeChecked.setUTCMonth(0)
    //expect yearly listens to be with entered values
    expect(yearlyStats.length).toEqual(5)
    expect(yearlyStats[4].numberOfListens).toEqual(750)
    expect(yearlyStats[3].numberOfListens).toEqual(25000)
    expect(yearlyStats[1].numberOfListens).toEqual(30000)

    for(var i=4;i>-1;i--)
    {
        expect(yearlyStats[i].day.getTime()).toEqual(dateTobeChecked.getTime())
        dateTobeChecked.setUTCFullYear(dateTobeChecked.getUTCFullYear()-1)
    }
  })

  //Testing getting monthly likes stats for album
  it('Testing getting monthly likes stats for album, stats object should have sequential dates', async () => {

    artistServiceClass = new artistService.artistService()
    album=await Album.findById("5edefb5fd1537f3f33f91340")
    const monthlyStats=await artistServiceClass.getMonthlyOrYearlyStats(album,"monthly","likes")
    expect(monthlyStats.length).toEqual(12)
    expect(monthlyStats[11].numberOfLikes).toEqual(2)
    expect(monthlyStats[9].numberOfLikes).toEqual(1)
    expect(monthlyStats[10].numberOfLikes).toEqual(2)

    let dateTobeChecked= new Date(date2Feb)
    dateTobeChecked.setUTCDate(1)

    for(var i=11;i>-1;i--)
    {
        expect(monthlyStats[i].day.getTime()).toEqual(dateTobeChecked.getTime())
        dateTobeChecked.setUTCMonth(dateTobeChecked.getUTCMonth()-1)
    }
  })


})


  //Testing Date related functions & intializing new empty objects
describe('Testing intializing dates', () => {

    beforeAll(async () => {
      sinon.restore()
    })

    
    it('Testing intializing date for monnthly stats, should return day a date with same month, and day =1', async () => {
        let date=new Date(2020,4,5)
        let prevMonth=date.getUTCMonth()
        let prevYear=date.getUTCFullYear()
        artistService.intializeDateForMonthStats(date)
        expect(date.getUTCDate()).toEqual(1)
        expect(date.getUTCMonth()).toEqual(prevMonth)
        expect(date.getUTCFullYear()).toEqual(prevYear)
        expect(date.getUTCHours()).toEqual(0)
      })

      it('Testing intializing date for yearly stats, should return day a date with same year, month=0, and day =1', async () => {
        let date=new Date(2020,4,5)
        let prevYear=date.getUTCFullYear()
        artistService.intializeDateForYearStats(date)
        expect(date.getUTCDate()).toEqual(1)
        expect(date.getUTCMonth()).toEqual(0)
        expect(date.getUTCFullYear()).toEqual(prevYear)
        expect(date.getUTCHours()).toEqual(0)
      })
      
      it('Testing intializing empty object that returns object with nuber of likes/listen=0 and day=date to be retrieved then adjusts dates', async () => {
        let lowerLimitDate=new Date(2020,4,1)
        let prevYearLowerLimt=lowerLimitDate.getUTCFullYear()
        let prevMonthLowerLimt=lowerLimitDate.getUTCMonth()
        let upperLimitDate= new Date(2020,5,1)
        let prevYearupperLimit=upperLimitDate.getUTCFullYear()
        let prevMonthupperLimit=upperLimitDate.getUTCMonth()
        let listensObject=new Object()

        artistService.intializeStatsObject("listens","monthly",listensObject,lowerLimitDate,upperLimitDate)
        expect(lowerLimitDate.getUTCMonth()).toEqual(prevMonthLowerLimt-1)
        expect(lowerLimitDate.getUTCFullYear()).toEqual(prevYearLowerLimt)
        expect(upperLimitDate.getUTCMonth()).toEqual(prevMonthupperLimit-1)
        expect(upperLimitDate.getUTCFullYear()).toEqual(prevYearupperLimit)
        expect(listensObject.numberOfListens).toEqual(0)
        expect(listensObject.day.getDate()).toEqual(lowerLimitDate.getDate())
      })
  })

