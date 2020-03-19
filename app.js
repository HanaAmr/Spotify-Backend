const express = require('express')
const app = express()
app.use(express.json()) // to have body to requests specially for post methods
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')

app.get('/', (req, res) => {
  res.status(200).json({ message: 'get is successful el7', app: 'spotifycufe' })
})

const userRouter = require('./routes/users')
const artistRouter = require('./routes/artistRouters')
const categoryRouter = require('./routes/categoryRoutes')
const playlistRouter = require('./routes/playlistRoutes')
const trackRouter = require('./routes/trackRoutes')
const albumRouter = require('./routes/albumRoutes.js')

// Mounting the Routers
app.use('/', userRouter)
app.use('Artists', artistRouter)
app.use('/api/v1/browse/categories', categoryRouter) //   act as middleware for this route only
app.use('/api/v1/playlists', playlistRouter)
app.use('/api/v1/tracks', trackRouter)
app.use('/api/v1/albums', albumRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

module.exports = app
