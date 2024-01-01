const express = require('express');
const router = express.Router();
const schedule = require('node-schedule');

const Teacher = require('../../models/teacher');
const NotificationModel = require('../../models/notification');


const job = schedule.scheduleJob('0 0 */3 * *', async () => {
    // const job = schedule.scheduleJob('* * * * * *', async () => {
    // console.log('Đã kích hoạt công việc kiểm tra thông tin và gửi thông báo.');

    try {
        const teachers = await Teacher.find({ isWorking: true });

        teachers.forEach(async (teacher) => {
            if (!teacher.fullName) {
                const message = 'Vui lòng điền thông tin họ và tên vào hồ sơ.';
                sendNotification(teacher._id, message);
            }

            if (!teacher.email) {
                const message = 'Vui lòng điền thông tin email vào hồ sơ.';
                sendNotification(teacher._id, message);
            }

            if (!teacher.phoneNumber) {
                const message = 'Vui lòng điền thông tin số điện thoại vào hồ sơ.';
                sendNotification(teacher._id, message);
            }

            if (!teacher.gender) {
                const message = 'Vui lòng điền thông tin giới tính vào hồ sơ.';
                sendNotification(teacher._id, message);
            }

            if (!teacher.cccd) {
                const message = 'Vui lòng điền thông tin số CCCD vào hồ sơ.';
                sendNotification(teacher._id, message);
            }

            if (!teacher.birthDate) {
                const message = 'Vui lòng điền thông tin ngày sinh vào hồ sơ.';
                sendNotification(teacher._id, message);
            }

            if (!teacher.ethnicity) {
                const message = 'Vui lòng điền thông tin tôn giáo vào hồ sơ.';
                sendNotification(teacher._id, message);
            }

            if (!teacher.teachingLevel) {
                const message = 'Vui lòng điền thông tin trình độ giảng dạy vào hồ sơ.';
                sendNotification(teacher._id, message);
            }

            if (!teacher.position) {
                const message = 'Vui lòng điền thông tin chức vụ vào hồ sơ.';
                sendNotification(teacher._id, message);
            }

            if (!teacher.experience) {
                const message = 'Vui lòng điền thông tin kinh nghiệm làm việc vào hồ sơ.';
                sendNotification(teacher._id, message);
            }

            if (!teacher.role) {
                const message = 'Vui lòng điền thông tin vai trò làm việc vào hồ sơ.';
                sendNotification(teacher._id, message);
            }

            if (!teacher.joinDate) {
                const message = 'Vui lòng điền thông tin ngày tham gia làm việc vào hồ sơ.';
                sendNotification(teacher._id, message);
            }

            if (!teacher.avatarUrl) {
                const message = 'Vui lòng thêm hình đại diện vào hồ sơ.';
                sendNotification(teacher._id, message);
            }

        });
    } catch (error) {
        console.error('Lỗi khi kiểm tra thông tin giáo viên:', error);
    }
});

async function sendNotification(teacherId, message) {
    try {
        const notification = new NotificationModel({
            teacherId: teacherId,
            message: message,
        });

        await notification.save();

        const teacher = await Teacher.findById(teacherId);
        console.log(`Đã gửi thông báo tới giáo viên ${teacher.fullName}: ${message}`);
    } catch (error) {
        console.error('Lỗi khi gửi thông báo:', error);
    }
}

router.get('/send_notification', async (req, res) => {
    try {
        const teachers = await Teacher.find({ isWorking: true });
        const notifications = [];

        teachers.forEach((teacher) => {
            if (!teacher.fullName) {
                const notification = {
                    teacherId: teacher._id,
                    message: 'Vui lòng điền thông tin họ và tên vào hồ sơ.',
                };
                notifications.push(notification);
            }

            if (!teacher.email) {
                const notification = {
                    teacherId: teacher._id,
                    message: 'Vui lòng điền thông tin email vào hồ sơ.',
                };
                notifications.push(notification);
            }

            if (!teacher.phoneNumber) {
                const notification = {
                    teacherId: teacher._id,
                    message: 'Vui lòng điền thông tin số điện thoại vào hồ sơ.',
                };
                notifications.push(notification);
            }

            if (!teacher.gender) {
                const notification = {
                    teacherId: teacher._id,
                    message: 'Vui lòng điền thông tin giới tính vào hồ sơ.',
                };
                notifications.push(notification);
            }

            if (!teacher.cccd) {
                const notification = {
                    teacherId: teacher._id,
                    message: 'Vui lòng điền thông tin số CCCD vào hồ sơ.',
                };
                notifications.push(notification);
            }

            if (!teacher.birthDate) {
                const notification = {
                    teacherId: teacher._id,
                    message: 'Vui lòng điền thông tin ngày sinh vào hồ sơ.',
                };
                notifications.push(notification);
            }

            if (!teacher.ethnicity) {
                const notification = {
                    teacherId: teacher._id,
                    message: 'Vui lòng điền thông tin tôn giáo vào hồ sơ.',
                };
                notifications.push(notification);
            }

            if (!teacher.teachingLevel) {
                const notification = {
                    teacherId: teacher._id,
                    message: 'Vui lòng điền thông tin trình độ giảng dạy vào hồ sơ.',
                };
                notifications.push(notification);
            }

            if (!teacher.position) {
                const notification = {
                    teacherId: teacher._id,
                    message: 'Vui lòng điền thông tin chức vụ vào hồ sơ.',
                };
                notifications.push(notification);
            }

            if (!teacher.experience) {
                const notification = {
                    teacherId: teacher._id,
                    message: 'Vui lòng điền thông tin kinh nghiệm làm việc vào hồ sơ.',
                };
                notifications.push(notification);
            }

            if (!teacher.role) {
                const notification = {
                    teacherId: teacher._id,
                    message: 'Vui lòng điền thông tin vai trò làm việc vào hồ sơ.',
                };
                notifications.push(notification);
            }

            if (!teacher.joinDate) {
                const notification = {
                    teacherId: teacher._id,
                    message: 'Vui lòng điền thông tin ngày tham gia làm việc vào hồ sơ.',
                };
                notifications.push(notification);
            }

            if (!teacher.avatarUrl) {
                const notification = {
                    teacherId: teacher._id,
                    message: 'Vui lòng thêm hình đại diện vào hồ sơ.',
                };
                notifications.push(notification);
            }
        });

        res.status(201).json({
            status: 'SUCCESS',
            data: notifications,
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông báo:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

router.get('/notifications', async (req, res) => {
    try {
        const allNotifications = await NotificationModel.find().populate('teacherId');
        res.status(201).json({
            status: 'SUCCESS',
            notifications: allNotifications,
        });
    } catch (error) {
        console.error('Lỗi khi lấy tất cả thông báo:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
