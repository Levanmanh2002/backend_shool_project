const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subFeeSchema = new Schema({
    searchCode: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    issuedAmount: {
        type: Number,
        required: true,
    },
    paidAmount: {
        type: Number,
        required: true,
    },
    remainingAmount: {
        type: Number,
        required: true,
    },
    debtAmount: {
        type: Number,
        required: true,
    },
    dueDate: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

const feeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    subFees: [subFeeSchema],
});

const Fee = mongoose.model('Fee', feeSchema);

module.exports = Fee;
