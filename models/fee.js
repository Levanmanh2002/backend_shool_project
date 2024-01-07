const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subFeeSchema = new Schema({
    // Mã duy nhất để tìm kiếm
    searchCode: {
        type: String,
        required: true,
    },
    // Nội dung hoặc mô tả của học phí
    content: {
        type: String,
        required: true,
    },
    // Số tiền phát hành ban đầu
    issuedAmount: {
        type: Number,
        required: true,
    },
    // Số tiền đã đóng
    paidAmount: {
        type: Number,
        required: true,
    },
    // Số tiền còn lại phải đóng
    remainingAmount: {
        type: Number,
        required: true,
    },
    // Ghi nợ học phí
    debtAmount: {
        type: Number,
        required: true,
    },
    // Hạn đóng học phí
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
