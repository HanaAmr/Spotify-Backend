
class APIFeatures {
  // query is the actual query os mongoose
  // querty string => el fl request
  constructor (query, queryString) {
    this.query = query
    this.queryString = queryString
  }

  filter () {
    const queryObj = { ...this.queryString }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach(el => delete queryObj[el])

    let queryStr = JSON.stringify(queryObj)

    // using regular expression
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    this.query = this.query.find(JSON.parse(queryStr))

    // to be able to chain methods!!
    return this
  }

  sort () {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy)
    }
    return this
  }

   

  limitFields(){
      if(this.queryString.fields)
      {
          const fields= this.queryString.fields.split(',').join(' ');
          this.query=this.query.select(fields);
      } else{
          this.query=this.query.select('-__v');
      }
      return this; 
  }

  limitFieldsPlaylist () {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ')
      if (fields.includes('owner')) {
        this.query = this.query.select(fields)
        this.query.populate({
          path: 'owner',
          //select: '_id name uri href externalUrls images type followers userStats userArtist' // user public data
          select: 'name'
        })
      } else {
        this.query = this.query.select(fields)
      }
    } else {
      this.query = this.query.select('-__v -trackObjects')
      this.query.populate({
        path: 'owner',
        //select: '_id name uri href externalUrls images type followers userStats userArtist' // user public data
        select: 'name'
      })
      console.log('here')
    }
    return this
  }

  limitFieldsTracks () {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ')

      if (fields.includes('album') || fields.includes('artists')) {
        if (fields.includes('album')) {
          const start = fields.indexOf('album')
          const end = fields.indexOf(')')
          const fieldsPopulated = fields.substring(start + 6, end)
          const trackFields = fields.substring(0, start)

          if (fieldsPopulated !== '') {
            this.query.populate({
              path: 'album',
              select: fieldsPopulated
            })
          } else {
            this.query.populate({
              path: 'album',
              select: '-artists'
            })
          }
          this.query = this.query.select(trackFields)
        }

        if (fields.includes('artists')) {
          this.query.populate({
            path: 'artists',
            select: '_id name uri href externalUrls images type followers userStats userArtist' // user public data

          })
        }
      } else {
        this.query = this.query.select(fields)
      }
    } else {
      this.query = this.query.select('-__v')
      this.query.populate({ path: 'album' , select: '-artists'})
      this.query.populate({ path: 'artists' })
    }
    return this
  }

  paginate () {
    const page = this.queryString.page * 1 || 1
    const limit = this.queryString.limit * 1 || 100
    const skip = (page - 1) * limit

        this.query=this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports=APIFeatures;