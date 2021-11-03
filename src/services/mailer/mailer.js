const dotenv = require('dotenv')
dotenv.config({path: __dirname + '/../../.env'});

const nodemailer = require("nodemailer");
console.log("Mailer User", process.env.FASTGO_USER)
console.log("Mailer PASSWORD", process.env.FASTGO_PW)
const transporter = nodemailer.createTransport({
  host: process.env.FASTGO_HOST,
  port: 465,
  secure: true,
  pool: true,
  maxConnections: 5,
  maxMessages: 5,
  auth: {
    user: process.env.FASTGO_USER, 
    pass: process.env.FASTGO_PW
  },
});

module.exports = {transporter}