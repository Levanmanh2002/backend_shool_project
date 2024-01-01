const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
    },
    message: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const NotificationModel = mongoose.model('Notification', notificationSchema);

module.exports = NotificationModel;
