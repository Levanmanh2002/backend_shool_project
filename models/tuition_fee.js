const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tuitionFeeSchema = new Schema({
    maTraCuu: {
        type: String,
        required: true,
    },
    tenHocPhi: {
        type: String,
        required: true,
    },
    noiDungHocPhi: {
        type: String,
        required: true,
    },
    soTienPhatHanh: {
        type: Number,
        required: true,
    },
    soTienDong: {
        type: Number,
        required: true,
    },
    hanDongTien: {
        type: Date,
        required: true,
    },
    soTienNo: {
        type: Number,
        required: true,
    },
    soTienThanhToan: {
        type: Number,
    },
    status: {
        type: Boolean,
        default: false,
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

const TuitionFee = mongoose.model('TuitionFee', tuitionFeeSchema);

module.exports = TuitionFee;