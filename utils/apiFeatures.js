class APIFeatures {
  constructor (query, queryString) {
    this.query = query
    this.queryString = queryString
  }

  limitField () {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ')
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select('-_v')
    }

    return this
  }

  paginate () {
    const page = this.queryString.offset * 1 || 1
    const limit = this.queryString.limit * 1 || 20
    const skip = (page - 1) * limit

    this.query = this.query.skip(skip).limit(limit)

    return this
  }
}

module.exports = APIFeatures
