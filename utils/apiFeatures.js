class APIFeatures {
  constructor (query, queryString) {
    this.query = query
    this.queryString = queryString
  }
  
  filter(){
        const queryObj={...this.queryString};
        const excludedFields=['page','sort','limit','fields'];
        excludedFields.forEach(el=> delete queryObj[el]);

        let queryStr=JSON.stringify(queryObj);
        
        //using regular expression
        queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=> `$${match}`);
        console.log(queryStr);
        this.query=this.query.find(JSON.parse(queryStr));
        console.log(this.query);

         //to be able to chain methods!!
        return this;
    }

    sort(){
        if(this.queryString.sort)
        {
            const sortBy=this.queryString.sort.split(',').join(' ');
            this.query=this.query.sort(sortBy);
        } else{
            this.query=this.query.sort('-createdAt');
        }
        return this;
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
