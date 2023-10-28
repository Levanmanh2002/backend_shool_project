const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feeSchema = new Schema({
    name: String,
    money: Number,
    description: String,
    quantity_credits: Number,
    type: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Fee = mongoose.model('Fee', feeSchema);

module.exports = Fee;
