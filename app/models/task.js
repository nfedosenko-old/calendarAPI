const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  dateStarted: {type: Date, default: new Date()},
  userId: mongoose.Schema.Types.ObjectId,
  description: String
});

export default mongoose.model('Task', taskSchema);
