const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const otherSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    money: {
        type: String,
        required: true,
    },
    quantity: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    note: {
        type: String,
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

const Other = mongoose.model('Other', otherSchema);

module.exports = Other;