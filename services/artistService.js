/**
 * Service module.
 * @module services/artistService
 * @requires express
 */

 /**
 * Mongoose package
 * @const
 */
const mongoose = require('mongoose')

/**
 * Album model from the database
 * @const
 */
const Album = require('../models/albumModel')

/**
 * Track model from the database
 * @const
 */
const Track = require('../models/trackModel')


/**
 * Class reprensenting the player services needed to handle artist Functionalities
 */
class artistService {

  /**
  * A function that increments number of litens for the current date. in track or album object when a user listens to a track it 
  * @function
  * @param {object} trackOrAlbumObject - The  album or track object
  */
 async altertrackOrAlbumObjectListens(trackOrAlbumObject)
 {
   let todayDate=new Date(Date.now()) 
   todayDate.setHours(0,0,0,0)
   console.log(todayDate.getTime())
   console.log(todayDate)
   console.log(`Today's date is: ${todayDate}`)
   //Call alter album listens since it's not the same function
   let lastDate=0
   //Getting the last date that was added in the listens history of the trackOrAlbumObject
   if(trackOrAlbumObject.listensHistory.length!=0)
   {
     lastDate=trackOrAlbumObject.listensHistory[trackOrAlbumObject.listensHistory.length-1].day
     console.log("Last day is: ",lastDate)
   }

   //If there were previous listens for the trackOrAlbumObject on the same day
   if(lastDate && lastDate.getTime()==todayDate.getTime())
   {
     console.log("same date")
     trackOrAlbumObject.listensHistory[trackOrAlbumObject.listensHistory.length-1].numberOfListens++
     await trackOrAlbumObject.save()
   }
   //if there were not any listens before or this is the first listen for today
   else
   {
     console.log("new date")
     let listensObject= new Object()
     listensObject.day=new Date(todayDate)
     listensObject.numberOfListens=1
     trackOrAlbumObject.listensHistory.push(listensObject)
     await trackOrAlbumObject.save()
   }
 }

  /**
  * A function that adds the user to the list of likes history only if the user haven't liked the track before
  * @function
  * @param {object} trackOrAlbumObject - The  album or track object
  * @param {string} userID - The ID of the user
  */
 async alterTrackortrackOrAlbumObjectLikes(trackOrAlbumObject,userID)
 {
  const length=trackOrAlbumObject.likesHistory.length
  var index=0
  for(index;index<length;index++)
  {
    if(userID==trackOrAlbumObject.likesHistory[index].userID.toString())
      break;
  }
  if(index==length)
  {
    let likesObject=new Object()
    likesObject.day=new Date(Date.now())
    likesObject.userID=new  mongoose.Types.ObjectId(userID)
    trackOrAlbumObject.likesHistory.push(likesObject)
    await trackOrAlbumObject.save()
  }

}

  /**
  * A function that calculates the daily listens stats of albu or track for 30 days
  * @function
  * @param {String}  trackOrAlbumObject- The album or track object since they both store the same data
  * @return {object} -An array of daily listens object
  */
  async calculateNumberOfDailyLikes(trackOrAlbumObject)
  {
    let listensDailyStats=[]

    let DateToBeRetrieved=new Date(Date.now())
    console.log(DateToBeRetrieved)
    let lastCheckedIndex=-1
    if(trackOrAlbumObject.listensHistory.length!=0)
    {
      //getting index of last element and date to be compared to when starting loop
      lastCheckedIndex=trackOrAlbumObject.listensHistory.length-1
      DateToBeRetrieved=new Date(trackOrAlbumObject.listensHistory[lastCheckedIndex].day)
      console.log("date after adjustement",DateToBeRetrieved)
    }
    
    //Getting statistic of 30 consecutive days starting from the last element and adding a new elements at the begining
    for(var i=0;i<30;i++)
    {
      console.log(`At iteration ${i+1} the value of date is:${DateToBeRetrieved}`)
      let listensObject=new Object()
      //If there are elements in the trackOrAlbumObject object check them
      if(lastCheckedIndex>-1 && DateToBeRetrieved.getTime()==trackOrAlbumObject.listensHistory[lastCheckedIndex].day.getTime())
      {
        listensObject.day=new Date(trackOrAlbumObject.listensHistory[lastCheckedIndex].day)
        listensObject.numberOfListens=trackOrAlbumObject.listensHistory[lastCheckedIndex].numberOfListens
        lastCheckedIndex--
      }  
      else
      {
        listensObject.day=new Date(DateToBeRetrieved)
        listensObject.numberOfListens=0
      }
      listensDailyStats.unshift(listensObject)
      //Decrement date by 1 in order to view consecutive stats
      DateToBeRetrieved.setDate(DateToBeRetrieved.getDate()-1)
    }
    return listensDailyStats
  }



}

module.exports = artistService