const mongoose = require('mongoose');
const Schema = mongoose.Schema
const model = mongoose.model

const VerificationSchema = new Schema({

  rut:{
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    default: function () {
      return (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    }
  },
  dateCreated: {
    type: Date,
    default: Date.now()
}

},{
  timestamps: true,
  collection: "Verification"
});

module.exports = model('Verification',VerificationSchema);