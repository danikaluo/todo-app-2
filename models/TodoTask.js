// make collection schema 
const mongoose = require('mongoose');
const todoTaskSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
// export so we can use it in index.js file
module.exports = mongoose.model('TodoTask',todoTaskSchema);