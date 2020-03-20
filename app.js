const express = require('express')
const app = express()
app.use(express.json()) // to have body to requests specially for post methods
const AppError = require('./utils/appError')
const errorController = require('./controllers/errorController');

app.get('/', (req, res) => {
  res.status(200).json({ message: 'get is successful el7', app: 'spotifycufe' })
})

const userRouter = require('./routes/userRouters')
const artistRouter = require('./routes/artistRouters')
const categoryRouter = require('./routes/categoryRoutes')
const playlistRouter = require('./routes/playlistRoutes')
const trackRouter = require('./routes/trackRoutes')
const albumRouter = require('./routes/albumRoutes.js')


// Mounting the Routers
app.use('/api/v1/', userRouter)
app.use('/api/v1/artists', artistRouter)
app.use('/api/v1/browse/categories', categoryRouter) //   act as middleware for this route only
app.use('/api/v1/playlists', playlistRouter)
app.use('/api/v1/tracks', trackRouter)
app.use('/api/v1/albums', albumRouter)

//Middlewares
//after all handeled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

//handled undefined routes
app.use(errorController);

module.exports = app
