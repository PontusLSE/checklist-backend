const mongoose = require('mongoose');

const checklistSchema = new mongoose.Schema({
  title: String,
  items: [{
    text: String,
    completed: Boolean,
    comments: String
  }]
});

module.exports = mongoose.model('Checklist', checklistSchema);
