
module.exports = async function (model,req,count) {
    const page = parseInt(req.query.page* 1 || 1)
    const limit = parseInt(req.query.limit* 1 || 2)

    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    let Url = req.originalUrl
    if(req.originalUrl.includes('limit')){

        const end = req.originalUrl.indexOf('limit')
        Url = req.originalUrl.substring(0, end)
        
    }
        

    const results = {}
    if (endIndex < count) {
     results.next = `http://127.0.0.1:${process.env.PORT}${Url}?limit=${limit}&page=${page + 1}`
    } else {
        results.next=null
    }
    
    if (startIndex > 0) {
      results.previous = `http://127.0.0.1:${process.env.PORT}${Url}?limit=${limit}&page=${page - 1}`
    } else {
        results.previous=null
    }

    results.href=`http://127.0.0.1:${process.env.PORT}${Url}`
    results.limit=limit
    results.offset=page
    results.total=count
    return results
  }

  