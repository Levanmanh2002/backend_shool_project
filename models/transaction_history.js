const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionHistorySchema = new Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    tuitionFeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TuitionFee',
        required: true
    },
    maTraCuu: {
        type: String,
        required: true,
    },
    tenHocPhi: {
        type: String,
        required: true,
    },
    soTienDong: {
        type: Number,
        required: true,
    },
    amountPaid: {
        type: Number,
        required: true
    },
    outstandingAmount: {
        type: Number,
        required: true
    },
    transactionDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    paymentMethod: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
});

const TransactionHistory = mongoose.model('TransactionHistory', transactionHistorySchema);

module.exports = TransactionHistory;
