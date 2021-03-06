const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema
const model = mongoose.model
const User = require('../../models/User/User')

const RequestsSchema = new Schema({
    Cliente:{
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Haulier:{
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    Phone: String,
    Status: {type: Number, default: 0},
    LatDirFrom: Number,
    LngDirFrom: Number,
    LatDirTo: Number,
    LngDirTo: Number,
    DirFrom: String,
    DirTo: String,
    Load: String,
    Description: String,
    Value: Number,
    DateFrom: Date,
    DateFromString: String,
    DateTo: Date,
    DateToString: String,
    // HaulierName: {type: String, required: false},
    // HaulierDni: {type: String, required: false},
    // HaulierPhone: {type: String, required: false}
  },{
    timestamps: true,
    collection: "Request"
});

module.exports = model('Request',RequestsSchema);