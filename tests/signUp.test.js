/** Jest unit testing for siging up 
 * @module routes/users
 * @requires express
 */

/**
 * mocking requests
 * @const
 */
const httpMocks = require('node-mocks-http');

/**
 * dotenv for environment variables
 * @const
 */
const dotenv = require('dotenv');
/**
 * mongoose for db management
 * @const
 */
const mongoose = require('mongoose');

/**
 * express module
 * User model from the database
 * @const
 */
const user = require('./../models/user');

/**
 * express module
 * User controller
 * @const
 */
const authController = require('./../controllers/authController')

dotenv.config({ path: '.env' });

mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(console.log('DB is connected successfuly!'));


// Testing authController send signing up user
describe('authController send signing up user', () => {
    // Drop the whole users collection before testing and add a simple user to test with
    beforeEach(async () => {
      //sinon.restore()
      await mongoose.connection.dropCollection('users', () => {
      })
    })
  
    // Drop the whole users collection after finishing testing
    afterAll(async () => {
      //sinon.restore()
      await mongoose.connection.dropCollection('users', () => {
      })
    })
     
    // Testing signing up user with no problem
    it('Should sign up successfully', done => {
        const request = httpMocks.createRequest({
          method: 'POST',
          url: '/signUp',
          body: {
            id: 'idvalid',
            name: 'ahmed',
            email: 'ahmed@gmail.com',
            password: 'password' 
          }
        })
  
      const response = httpMocks.createResponse();

      authController.signUp(request, response, done);

      expect(response.statusCode).toBe(200);

      done();
    });
});  
