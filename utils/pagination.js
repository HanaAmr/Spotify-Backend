/**
* For making a paging objct
* @function
* @memberof module:utils/pagination
* @param {req} - The request sent
* @param {count} - The number of documents that can be returned
* @param {Async function}  - the async function to paginate.
* @return {results} The results object containing next,prev,limit,offset,total,and href .
*/
module.exports = async function (req, count) {
  const page = parseInt(req.query.page * 1 || 1)
  const limit = parseInt(req.query.limit * 1 || 2)

  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  let Url = req.originalUrl
  if (req.originalUrl.includes('limit')) {
    const end = req.originalUrl.indexOf('limit')
    Url = req.originalUrl.substring(0, end - 1)
  }
  console.log('Inside pagination')

  const results = {}
  if (endIndex < count) {
    results.next = `${process.env.API_URL}${Url}?limit=${limit}&page=${page + 1}`
  } else {
    results.next = null
  }

  if (startIndex > 0) {
    results.previous = `${process.env.API_URL}${Url}?limit=${limit}&page=${page - 1}`
  } else {
    results.previous = null
  }

  results.href = `${process.env.API_URL}${process.env.PORT}${Url}`
  results.limit = limit
  results.offset = page
  results.total = count
  return results
}
