const mongoose = require('mongoose')
console.log(process.env.FASTGO_DB_CERT)
const URI = 'mongodb+srv://doadmin:'+process.env.FASTGO_DB_PW+'\
@db-mongodb-nyc1-66135-7d3baa74.mongo.ondigitalocean.com/\
admin1?authSource=admin&replicaSet=db-mongodb-nyc1-66135&tls=true&tlsCAFile='+process.env.FASTGO_DB_CERT
try {
    mongoose.connect(URI);
}catch(err){
    console.log(err)
}

const connection = mongoose.connection
module.exports = connection;