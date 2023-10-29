const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentPaySchema = new Schema({
    student_id: String,
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student' 
    },
    student_fee_id: String,
    student_fee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentFee' 
    },
    money_paid: Number,
    pay_type: String, // Kiểu thanh toán (CK, TM)
    pay_date: {
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

const StudentFee = mongoose.model('StudentFee', studentPaySchema);

module.exports = StudentFee;
