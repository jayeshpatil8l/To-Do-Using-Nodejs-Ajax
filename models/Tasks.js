const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },

    completed: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Task', taskSchema);