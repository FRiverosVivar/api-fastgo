const mongoose = require('mongoose')
const dotenv = require('dotenv')

const URI = process.env.FASTGO_DB_URL ? process.env.FASTGO_DB_URL : 'mongodb://186.67.250.198:27071'

mongoose.connect(URI);

const connection = mongoose.connection
module.exports = connection;