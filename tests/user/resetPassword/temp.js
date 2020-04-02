//Checking reset password post endpoints
describe('User resetPassword Post Endpoints', () => {  
  
    // Testing emailing the user if email is valid
    it('Should send email as email provided is valid', async () => {
    // Creating the valid user to send him the email
      const validUser = new User({
        id: "idvalid",
        name: "omar",
        email: "omar@email.com",
        password: "password",
    })
    await validUser.save()
    // Calling the resetPassword endpoint.
      const res = await request.post('/resetPassword')
        .send({
          email: "omar@email.com"
        })
      expect(res.status).toEqual(204)
      // Drop the collection
      mongoose.connection.dropCollection('users')
    })
    
    // Testing emailing a user with an invalid email
    it('Shouldn\'t send email as email provided is invalid', async () => {
      // Creating the valid user to send him the email
        const validUser = new User({
          id: "idvalid",
          name: "omar",
          email: "omar@email.com",
          password: "password",
      })
      await validUser.save()
      // Calling the resetPassword endpoint.
        const res = await request.post('/resetPassword')
          .send({
            email: "omar22@email.com"
          })
        expect(res.status).toEqual(404)
        // Drop the collection
        mongoose.connection.dropCollection('users')
      })
  
      // Testing emailing a user with an empty email
    it('Shouldn\'t send email as no email is sent in body', async () => {
      // Creating the valid user to send him the email
        const validUser = new User({
          id: "idvalid",
          name: "omar",
          email: "omar@email.com",
          password: "password",
      })
      await validUser.save()
      // Calling the resetPassword endpoint.
        const res = await request.post('/resetPassword')
          .send()
        expect(res.status).toEqual(404)
        // Drop the collection
        mongoose.connection.dropCollection('users')
      })
  
  
      // Testing resetting password with a valid token
    it('Should be able to change password as token is valid and passwords match', async () => {
      // Creating the valid user to send him the email
        const validUser = new User({
          id: "idvalid",
          name: "omar",
          email: "omar@email.com",
          password: "password",
          resetPasswordToken: "12345678901234567890",
          resetPasswordExpires: Date.now() + 360000
      })
      await validUser.save()
      // Calling the resetPassword endpoint.
        const res = await request.post('/resetPassword/12345678901234567890')
          .send({
            newPassword: "passwordnew",
            passwordConfirmation: "passwordnew"
          })
        expect(res.status).toEqual(204)
        // Drop the collection
        mongoose.connection.dropCollection('users')
      })
  
       // Testing resetting password with a valid token but mismatching passwords
    it('Shouldn\'t be able to change password as token is valid but passwords mismatch', async () => {
      // Creating the valid user to send him the email
        const validUser = new User({
          id: "idvalid",
          name: "omar",
          email: "omar@email.com",
          password: "password",
          resetPasswordToken: "12345678901234567890",
          resetPasswordExpires: Date.now() + 360000
      })
      await validUser.save()
      // Calling the resetPassword endpoint.
        const res = await request.post('/resetPassword/12345678901234567890')
          .send({
            newPassword: "passwordnew",
            passwordConfirmation: "passwoasrdnew"
          })
        expect(res.status).toEqual(403)
        // Drop the collection
        mongoose.connection.dropCollection('users')
      })
  
      // Testing resetting password with an expired token
    it('Shouldn\'t be able to change password as token is expired', async () => {
      // Creating the valid user to send him the email
        const validUser = new User({
          id: "idvalid",
          name: "omar",
          email: "omar@email.com",
          password: "password",
          resetPasswordToken: "12345678901234567890",
          resetPasswordExpires: Date.now() - 360000
      })
      await validUser.save()
      // Calling the resetPassword endpoint.
        const res = await request.post('/resetPassword/12345678901234567890')
          .send({
            newPassword: "passwordnew",
            passwordConfirmation: "passwordnew"
          })
        expect(res.status).toEqual(404)
        // Drop the collection
        mongoose.connection.dropCollection('users')
      })
  
      
  
      //Testing throwing error of findOne
      it('Fakes server error for invalid request to send email to reset password', async () => {
        sinon.restore()
        sinon.stub(User, 'findOne').yields({})
  
        const res = await request.post('/resetPassword')
        .send()
        expect(res.status).toEqual(500)
  
      })
  
  
      //Testing throwing error when sending token to reset password
      it('Fakes server error for not finding user with token', async () => {
        sinon.restore()
        // Creating the valid user to send him the email
        const validUser = new User({
          id: "idvalid",
          name: "omar",
          email: "omar@email.com",
          password: "password",
          resetPasswordToken: "12345678901234567890",
          resetPasswordExpires: Date.now() + 360000
      })
      await validUser.save()
      // Calling the resetPassword endpoint.
      
      sinon.stub(User, 'findOne').yields({})
  
        const res = await request.post('/resetPassword/12345678901234567890')
          .send({
            newPassword: "passwordnew",
            passwordConfirmation: "passwordnew"
          })
        .send()
        expect(res.status).toEqual(500)
        // Drop the collection
        mongoose.connection.dropCollection('users') 
      })
  
     //Testing throwing error when sending to confirm resettin password
     it('Fakes server error for not being able to send email confirming resetting password', async () => {
      sinon.restore()
      // Creating the valid user to send him the email
      const validUser = new User({
        id: "idvalid",
        name: "omar",
        email: "omar@email.com",
        password: "password",
        resetPasswordToken: "12345678901234567890",
        resetPasswordExpires: Date.now() + 360000
    })
    await validUser.save()
    userController.nodemailer.createTransport({}).sendMail = jest.fn()
  
    // Calling the resetPassword endpoint.
      const res = await request.post('/resetPassword/12345678901234567890')
        .send({
          newPassword: "passwordnew",
          passwordConfirmation: "passwordnew"
        })
      expect(res.status).toEqual(502)
      // Drop the collection
      mongoose.connection.dropCollection('users') 
    })
  
  
      //Disconnecting from the db when we're done
      afterAll(async () => {
      await mongoose.disconnect()
      await app.close()
    })
  })