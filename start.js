//This file runs the server and starts it.
const app = require('./app.js')
app.listen(process.env.PORT, () => {
    console.log(`Server started on port : ` + process.env.PORT);
})
