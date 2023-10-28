const mongoose = require('mongoose');
const Fee = require('./fee');
const Schema = mongoose.Schema;

const studentFeeSchema = new Schema({
    classId: String,
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    },
    studentId: String,
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    fees: [Fee],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const StudentFee = mongoose.model('StudentFee', studentFeeSchema);

module.exports = StudentFee;
