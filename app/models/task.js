import config from '../config/config';
const mongoose = require('mongoose');
const moment = require('moment');

const taskSchema = mongoose.Schema({
  dateStarted: {type: Date, default: new Date()},
  userId: mongoose.Schema.Types.ObjectId,
  description: String
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});

taskSchema
  .virtual('date')
  .get(function customDateGet() {
    return moment(this.dateStarted).format(config.dateFormat);
  })
  .set(function customDateSet(dateToSet) {
    this.set('dateStarted', moment(dateToSet, config.dateFormat).toDate());
  });

export default mongoose.model('Task', taskSchema);
