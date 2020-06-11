/**
 * Artist Service module.
 * For simplicity, this module is based on the assumption that the server's time zone is UTC timezone
 * Therefore, all the statitics gathering and calculations are based on UTC time
 * @module services/artistService
 * @requires express
 */

/**
 * Mongoose package
 * @const
 */
const mongoose = require('mongoose')

/**
 * Class reprensenting the player services needed to handle artist Functionalities
 */
exports.artistService = class artistService {
  /**
  * A function that increments number of litens for the current date. in track or album object when a user listens to a track it
  * @function
  * @param {object} trackOrAlbumObject - The  album or track object
  */
  async altertrackOrAlbumObjectListens (trackOrAlbumObject) {
    const todayDate = new Date(Date.now())
    todayDate.setUTCHours(0, 0, 0, 0)
    // Call alter album listens since it's not the same function
    let lastDate = 0
    // Getting the last date that was added in the listens history of the trackOrAlbumObject
    if (trackOrAlbumObject.listensHistory.length != 0) { lastDate = trackOrAlbumObject.listensHistory[trackOrAlbumObject.listensHistory.length - 1].day }

    // If there were previous listens for the trackOrAlbumObject on the same day
    if (lastDate && lastDate.getTime() == todayDate.getTime()) {
      trackOrAlbumObject.listensHistory[trackOrAlbumObject.listensHistory.length - 1].numberOfListens++
      await trackOrAlbumObject.save()
    }
    // if there were not any listens before or this is the first listen for today
    else {
      const listensObject = new Object()
      listensObject.day = new Date(todayDate)
      listensObject.numberOfListens = 1
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
  async alterTrackorAlbumObjectLikes (trackOrAlbumObject, userID) {
    const length = trackOrAlbumObject.likesHistory.length
    var index = 0
    for (index; index < length; index++) {
      if (userID == trackOrAlbumObject.likesHistory[index].userID.toString()) { break }
    }
    if (index == length) {
      const likesObject = new Object()
      const date = new Date(Date.now())
      date.setUTCHours(0, 0, 0, 0)
      likesObject.day = new Date(date)
      likesObject.userID = new mongoose.Types.ObjectId(userID)
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
  async getDailyListensStats (trackOrAlbumObject) {
    const listensDailyStats = []

    let DateToBeRetrieved = new Date(Date.now())
    DateToBeRetrieved.setUTCHours(0, 0, 0)
    let lastCheckedIndex = -1
    if (trackOrAlbumObject.listensHistory.length != 0) {
      // getting index of last element and date to be compared to when starting loop
      lastCheckedIndex = trackOrAlbumObject.listensHistory.length - 1
      DateToBeRetrieved = new Date(trackOrAlbumObject.listensHistory[lastCheckedIndex].day)
    }

    // Getting statistic of 30 consecutive days starting from the last element and adding a new elements at the begining
    for (var i = 0; i < 30; i++) {
      const listensObject = new Object()
      // If there are elements in the trackOrAlbumObject object check them
      if (lastCheckedIndex > -1 && DateToBeRetrieved.getTime() == trackOrAlbumObject.listensHistory[lastCheckedIndex].day.getTime()) {
        listensObject.day = new Date(trackOrAlbumObject.listensHistory[lastCheckedIndex].day)
        listensObject.numberOfListens = trackOrAlbumObject.listensHistory[lastCheckedIndex].numberOfListens
        lastCheckedIndex--
      } else {
        listensObject.day = new Date(DateToBeRetrieved)
        listensObject.numberOfListens = 0
      }
      listensDailyStats.unshift(listensObject)
      // Decrement date by 1 in order to view consecutive stats
      DateToBeRetrieved.setDate(DateToBeRetrieved.getDate() - 1)
    }
    return listensDailyStats
  }

  /**
  * A function that calculates the Yearly or monthly listens stats of album or track
  * If stats are monthly, it calculates the stats for the last 12 months
  * if stats is yearly, it calculates the stats for the last 5 years
  * @function
  * @param {object}  trackOrAlbumObject- The album or track object since they both store the same data
  * @param {String}  monthlyOrYearly - a string that tells whether required stats are monthly or yearly
  * @return {object} -An array of daily listens object
  */
  async getMonthlyOrYearlyStats (trackOrAlbumObject, monthlyOrYearly, likesOrListens) {
    const statsObjectsArray = []
    let requiredNumberOfStatsObjects
    let currentNumberOfStatsObjects = 0

    // intializations of date in case album/track has no listens/ likes yet
    const DateToBeRetrieved = new Date(Date.now())
    if (monthlyOrYearly == 'monthly') {
      intializeDateForMonthStats(DateToBeRetrieved)
      requiredNumberOfStatsObjects = 12
    } else {
      intializeDateForYearStats(DateToBeRetrieved)
      requiredNumberOfStatsObjects = 5
    }

    let nextDate = new Date(Date.now())
    let index = -1

    let length
    if (likesOrListens == 'listens') { length = trackOrAlbumObject.listensHistory.length } else { length = trackOrAlbumObject.likesHistory.length }

    // get last date of listens/likes from track or album object if it has listens/likes
    if (length != 0) {
      nextDate = new Date(intializeDateLimits(likesOrListens, monthlyOrYearly, length, trackOrAlbumObject, DateToBeRetrieved))
      index = length - 1
    }

    // intializing listens object
    let statsObject = new Object()
    statsObject.day = new Date(DateToBeRetrieved)

    if (likesOrListens == 'listens') { statsObject.numberOfListens = 0 } else { statsObject.numberOfLikes = 0 }

    // Checking if date t e retrieved has stats object in album/track object
    while (index > -1 && currentNumberOfStatsObjects < requiredNumberOfStatsObjects) {
      let isBigger
      let isSmaller
      if (likesOrListens == 'listens') {
        isBigger = trackOrAlbumObject.listensHistory[index].day.getTime() >= DateToBeRetrieved.getTime()
        isSmaller = trackOrAlbumObject.listensHistory[index].day.getTime() < nextDate.getTime()
      } else {
        isBigger = trackOrAlbumObject.likesHistory[index].day.getTime() >= DateToBeRetrieved.getTime()
        isSmaller = trackOrAlbumObject.likesHistory[index].day.getTime() < nextDate.getTime()
      }

      // if date is in range, add number of likes to total number of likes and decrement index (since dates are arranged sequentially)
      if (isBigger && isSmaller) {
        if (likesOrListens == 'listens') { statsObject.numberOfListens += trackOrAlbumObject.listensHistory[index].numberOfListens } else { statsObject.numberOfLikes++ }
        index--
      } else {
        // Insert new object
        statsObjectsArray.unshift(statsObject)
        // update the range of date to check
        statsObject = new Object()
        intializeStatsObject(likesOrListens, monthlyOrYearly, statsObject, DateToBeRetrieved, nextDate)

        currentNumberOfStatsObjects++
      }
    }
    // if data didn't get 12 month(if monthly) or 5 years(if yearly) fill the rest stats with zeros
    while (currentNumberOfStatsObjects < requiredNumberOfStatsObjects) {
      statsObjectsArray.unshift(statsObject)
      statsObject = new Object()
      intializeStatsObject(likesOrListens, monthlyOrYearly, statsObject, DateToBeRetrieved, nextDate)
      currentNumberOfStatsObjects++
    }
    return statsObjectsArray
  }

  /**
  * A function that calculates the daily likes stats of album or track for 30 days
  * @function
  * @param {String}  trackOrAlbumObject- The album or track object since they both store the same data
  * @return {object} -An array of daily listens object
  */
  async getDalyLikesStats (trackOrAlbumObject) {
    const likesDailyStatus = []

    let DateToBeRetrieved = new Date(Date.now())
    DateToBeRetrieved.setUTCHours(0, 0, 0, 0)
    let lastCheckedIndex = -1
    let currentNumberOfStatsObjects = 0

    const length = trackOrAlbumObject.likesHistory.length
    if (length != 0) {
      DateToBeRetrieved = trackOrAlbumObject.likesHistory[length - 1].day
      lastCheckedIndex = length - 1
    }

    // intializing object
    let likesObject = new Object()
    likesObject.day = new Date(DateToBeRetrieved)
    likesObject.numberOfLikes = 0

    // Getting statistic of 30 consecutive days starting from the last element and adding a new elements at the begining
    while (lastCheckedIndex > -1 && currentNumberOfStatsObjects < 30) {
      if (trackOrAlbumObject.likesHistory[lastCheckedIndex].day.getTime() == DateToBeRetrieved.getTime()) {
        likesObject.numberOfLikes++
        lastCheckedIndex--
      } else {
        likesDailyStatus.unshift(likesObject)
        DateToBeRetrieved.setUTCDate(DateToBeRetrieved.getUTCDate() - 1)
        likesObject = new Object()
        likesObject.day = new Date(DateToBeRetrieved)
        likesObject.numberOfLikes = 0
        currentNumberOfStatsObjects++
      }
    }

    // Filling in empty objects
    while (currentNumberOfStatsObjects < 30) {
      likesDailyStatus.unshift(likesObject)
      likesObject = new Object()
      DateToBeRetrieved.setUTCDate(DateToBeRetrieved.getUTCDate() - 1)
      likesObject.day = new Date(DateToBeRetrieved)
      likesObject.numberOfLikes = 0
      currentNumberOfStatsObjects++
    }

    return likesDailyStatus
  }
}

// utility functions that are exported only for testing

/**
  * A function that intializes date for calulating yearly stats
  * @function
  * @param {object} DateToBeRetrieved -The date to be adjusted
  */
intializeDateForYearStats = function (DateToBeRetrieved) {
  DateToBeRetrieved.setUTCMilliseconds(0)
  DateToBeRetrieved.setUTCHours(0, 0, 0)
  DateToBeRetrieved.setUTCDate(1)
  DateToBeRetrieved.setUTCMonth(0)
}

/**
  * A function that intializes date for calulating monthly stats
  * @function
  * @param {object} DateToBeRetrieved -The date to be adjusted
  */
intializeDateForMonthStats = function (DateToBeRetrieved) {
  DateToBeRetrieved.setUTCMilliseconds(0)
  DateToBeRetrieved.setUTCHours(0, 0, 0)
  DateToBeRetrieved.setUTCDate(1)
}

/**
  * A function that intializes Date liits from rack or album object last pushed lkes/listen stats history
  * @function
  * @param {likesOrListens} string - a string that tells us whether the required stats is likes or listens
  *  @param {monthlyOrYearly} string - a string that tells us the type os statistics monthly/yearly
  * @param {object} listensObject - an empty object that needs adjustment
  * @param {DateToBeRetrieved} Date - The date to be retieved which will be adjusted
  * @return {Date} -he upper limit of checking for date
  */
intializeDateLimits = function (likesOrListens, monthlyOrYearly, length, trackOrAlbumObject, DateToBeRetrieved) {
  let lastDate

  if (likesOrListens == 'listens') { lastDate = new Date(trackOrAlbumObject.listensHistory[length - 1].day) } else { lastDate = new Date(trackOrAlbumObject.likesHistory[length - 1].day) }

  DateToBeRetrieved.setUTCDate(lastDate.getUTCDate())
  DateToBeRetrieved.setUTCMonth(lastDate.getUTCMonth())

  if (monthlyOrYearly == 'monthly') { intializeDateForMonthStats(DateToBeRetrieved) } else { intializeDateForYearStats(DateToBeRetrieved) }

  nextDate = new Date(DateToBeRetrieved)
  if (monthlyOrYearly == 'monthly') { nextDate.setMonth(nextDate.getMonth() + 1) } else { nextDate.setFullYear(nextDate.getFullYear() + 1) }

  return nextDate
}

/**
  * A function that intializes a stats object by adjusting its date and setting likes or listens to zero
  * @function
  * @param {likesOrListens} string - a string that tells us whether the required stats is likes or listens
  *  @param {monthlyOrYearly} string - a string that tells us the type os statistics monthly/yearly
  * @param {object} listensObject - an empty object that needs adjustment
  * @param {DateToBeRetrieved} Date - The date to be retieved which will be adjusted
  * @param {nextDate} Date - the upper limit of checking for date which will be adjusted
  */
intializeStatsObject = function (likesOrListens, monthlyOrYearly, listensObject, DateToBeRetrieved, nextDate) {
  // update the range of date to check
  if (monthlyOrYearly == 'monthly') {
    DateToBeRetrieved.setMonth(DateToBeRetrieved.getMonth() - 1)
    nextDate.setMonth(nextDate.getMonth() - 1)
  } else {
    DateToBeRetrieved.setFullYear(DateToBeRetrieved.getFullYear() - 1)
    nextDate.setFullYear(nextDate.getFullYear() - 1)
  }

  // filling the data of new listens object
  listensObject.day = new Date(DateToBeRetrieved)
  if (likesOrListens == 'listens') { listensObject.numberOfListens = 0 } else { listensObject.numberOfLikes = 0 }
}

// exporting utility functions:
exports.intializeDateForMonthStats = intializeDateForMonthStats
exports.intializeDateForYearStats = intializeDateForYearStats
exports.intializeDateLimits = intializeDateLimits
exports.intializeStatsObject = intializeStatsObject
