const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const majorSchema = new Schema({
    name: String,
    description: String
});

const Major = mongoose.model('Major', majorSchema);

module.exports = Major;
