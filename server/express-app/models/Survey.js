var mongoose = require('mongoose');

var surveySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  createDate: {
    type: Number,
    default: Date.now
  },
  updateDate: {
    type: Number,
    default: Date.now
  },
  surveyCount: {
    type: Number,
    default: 0
  },
  coms: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  }
});

surveySchema.pre('save', function () {
  this.updateDate = Date.now();
});

module.exports = mongoose.model('Survey', surveySchema);
