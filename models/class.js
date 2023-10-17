const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classSchema = new Schema({
    className: String,
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    }
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
