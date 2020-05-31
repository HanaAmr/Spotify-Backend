/**
 * For searching for a query
 * @module services/search
 * @requires express
 */


/**
 * API features utils file
 * @const
 */
const APIFeatures = require('./../utils/apiFeatures')

/**
 * Track model from the database
 * @const
 */
const Track = require('./../models/trackModel')

/**
* For searching for a query
* @function
* @memberof module:services/search
* @param {searchQuery} - The keywords to search with
* @return {tracksArray} The results object containing the ids of the tracks found.
*/
module.exports = async function (searchQuery) {
    let search=searchQuery;
    search.replace("%20"," ")

    let tracksArray = await Track.find({ name:{$regex: `^${search}`, $options: 'i'}}).select("_id")
    if(tracksArray.length==0) 
    {
        tracksArray = await Track.find({ name:{$regex: `${search}`, $options: 'i'}}).select("_id")
    }

    return tracksArray

}