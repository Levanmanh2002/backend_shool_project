const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: false // Không bắt buộc
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: false // Không bắt buộc
    },
    feesIds: {
        type: String,
        required: false // Không bắt buộc
    },
    majorIds: {
        type: String,
        required: false // Không bắt buộc
    },
    uniformIds: {
        type: String,
        required: false // Không bắt buộc
    },
    classIds: {
        type: String,
        required: false // Không bắt buộc
    },
    systemIds: {
        type: String,
        required: false // Không bắt buộc
    },
    isRead: {
        type: Boolean,
        default: false  // Mặc định là false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
