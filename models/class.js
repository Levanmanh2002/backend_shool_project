const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classSchema = new Schema({
    classId: String,
    className: String,
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    job: String,
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
