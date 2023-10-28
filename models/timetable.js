const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timeTable = new Schema({
    classId: String,
    teacherId: String,
    majorId: String,
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    major: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Major'
    },
    duration: {
        type: Number,
        default: 1,
    },
    status: String,
    startTime: {
        type: Date,
        default: Date.now,
    },
    endTime: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const TimeTable = mongoose.model('TimeTable', timeTable);

module.exports = TimeTable;