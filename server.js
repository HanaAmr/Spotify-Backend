const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

//dotenv.config({ path: './config.env' });

mongoose.connect('mongodb://localhost:27017/spotify', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(con => {
    //console.log(con.connections);
    console.log('DB is connected successfuly!');
});

app.listen(3000, () => {
    console.log(`App is running on port 3000`);
})