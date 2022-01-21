const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()

// Connect DB
mongoose
  .connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('mongoDB is connected'))
  .catch((err) => console.log(err))

// Middleware
app.use(express.static('public'))

app.set('view engine', 'ejs')

app.use(express.json())
app.use(cors())

// Route
app.use('/art', require('./routes/arts'))

const port = process.env.PORT || 3000

app.listen(port, () => console.log('Server is running'))
