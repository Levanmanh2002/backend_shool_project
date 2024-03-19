const express = require('express');
const router = express.Router();
const schedule = require('node-schedule');

const Notification = require('../../models/notification');


// const job = schedule.scheduleJob('0 0 */3 * *', async () => {
//     // const job = schedule.scheduleJob('* * * * * *', async () => {
//     // console.log('Đã kích hoạt công việc kiểm tra thông tin và gửi thông báo.');

//     try {
//         const teachers = await Teacher.find({ isWorking: true });

//         teachers.forEach(async (teacher) => {
//             if (!teacher.fullName) {
//                 const message = 'Vui lòng điền thông tin họ và tên vào hồ sơ.';
//                 sendNotification(teacher._id, message);
//             }

//             if (!teacher.email) {
//                 const message = 'Vui lòng điền thông tin email vào hồ sơ.';
//                 sendNotification(teacher._id, message);
//             }

//             if (!teacher.phoneNumber) {
//                 const message = 'Vui lòng điền thông tin số điện thoại vào hồ sơ.';
//                 sendNotification(teacher._id, message);
//             }

//             if (!teacher.gender) {
//                 const message = 'Vui lòng điền thông tin giới tính vào hồ sơ.';
//                 sendNotification(teacher._id, message);
//             }

//             if (!teacher.cccd) {
//                 const message = 'Vui lòng điền thông tin số CCCD vào hồ sơ.';
//                 sendNotification(teacher._id, message);
//             }

//             if (!teacher.birthDate) {
//                 const message = 'Vui lòng điền thông tin ngày sinh vào hồ sơ.';
//                 sendNotification(teacher._id, message);
//             }

//             if (!teacher.ethnicity) {
//                 const message = 'Vui lòng điền thông tin tôn giáo vào hồ sơ.';
//                 sendNotification(teacher._id, message);
//             }

//             if (!teacher.teachingLevel) {
//                 const message = 'Vui lòng điền thông tin trình độ giảng dạy vào hồ sơ.';
//                 sendNotification(teacher._id, message);
//             }

//             if (!teacher.position) {
//                 const message = 'Vui lòng điền thông tin chức vụ vào hồ sơ.';
//                 sendNotification(teacher._id, message);
//             }

//             if (!teacher.experience) {
//                 const message = 'Vui lòng điền thông tin kinh nghiệm làm việc vào hồ sơ.';
//                 sendNotification(teacher._id, message);
//             }

//             if (!teacher.role) {
//                 const message = 'Vui lòng điền thông tin vai trò làm việc vào hồ sơ.';
//                 sendNotification(teacher._id, message);
//             }

//             if (!teacher.joinDate) {
//                 const message = 'Vui lòng điền thông tin ngày tham gia làm việc vào hồ sơ.';
//                 sendNotification(teacher._id, message);
//             }

//             if (!teacher.avatarUrl) {
//                 const message = 'Vui lòng thêm hình đại diện vào hồ sơ.';
//                 sendNotification(teacher._id, message);
//             }

//         });
//     } catch (error) {
//         console.error('Lỗi khi kiểm tra thông tin giáo viên:', error);
//     }
// });

// async function sendNotification(teacherId, message) {
//     try {
//         const notification = new NotificationModel({
//             teacherId: teacherId,
//             message: message,
//         });

//         await notification.save();

//         const teacher = await Teacher.findById(teacherId);
//         console.log(`Đã gửi thông báo tới giáo viên ${teacher.fullName}: ${message}`);
//     } catch (error) {
//         console.error('Lỗi khi gửi thông báo:', error);
//     }
// }

// router.get('/send_notification', async (req, res) => {
//     try {
//         const teachers = await Teacher.find({ isWorking: true });
//         const notifications = [];

//         teachers.forEach((teacher) => {
//             if (!teacher.fullName) {
//                 const notification = {
//                     teacherId: teacher._id,
//                     message: 'Vui lòng điền thông tin họ và tên vào hồ sơ.',
//                 };
//                 notifications.push(notification);
//             }

//             if (!teacher.email) {
//                 const notification = {
//                     teacherId: teacher._id,
//                     message: 'Vui lòng điền thông tin email vào hồ sơ.',
//                 };
//                 notifications.push(notification);
//             }

//             if (!teacher.phoneNumber) {
//                 const notification = {
//                     teacherId: teacher._id,
//                     message: 'Vui lòng điền thông tin số điện thoại vào hồ sơ.',
//                 };
//                 notifications.push(notification);
//             }

//             if (!teacher.gender) {
//                 const notification = {
//                     teacherId: teacher._id,
//                     message: 'Vui lòng điền thông tin giới tính vào hồ sơ.',
//                 };
//                 notifications.push(notification);
//             }

//             if (!teacher.cccd) {
//                 const notification = {
//                     teacherId: teacher._id,
//                     message: 'Vui lòng điền thông tin số CCCD vào hồ sơ.',
//                 };
//                 notifications.push(notification);
//             }

//             if (!teacher.birthDate) {
//                 const notification = {
//                     teacherId: teacher._id,
//                     message: 'Vui lòng điền thông tin ngày sinh vào hồ sơ.',
//                 };
//                 notifications.push(notification);
//             }

//             if (!teacher.ethnicity) {
//                 const notification = {
//                     teacherId: teacher._id,
//                     message: 'Vui lòng điền thông tin tôn giáo vào hồ sơ.',
//                 };
//                 notifications.push(notification);
//             }

//             if (!teacher.teachingLevel) {
//                 const notification = {
//                     teacherId: teacher._id,
//                     message: 'Vui lòng điền thông tin trình độ giảng dạy vào hồ sơ.',
//                 };
//                 notifications.push(notification);
//             }

//             if (!teacher.position) {
//                 const notification = {
//                     teacherId: teacher._id,
//                     message: 'Vui lòng điền thông tin chức vụ vào hồ sơ.',
//                 };
//                 notifications.push(notification);
//             }

//             if (!teacher.experience) {
//                 const notification = {
//                     teacherId: teacher._id,
//                     message: 'Vui lòng điền thông tin kinh nghiệm làm việc vào hồ sơ.',
//                 };
//                 notifications.push(notification);
//             }

//             if (!teacher.role) {
//                 const notification = {
//                     teacherId: teacher._id,
//                     message: 'Vui lòng điền thông tin vai trò làm việc vào hồ sơ.',
//                 };
//                 notifications.push(notification);
//             }

//             if (!teacher.joinDate) {
//                 const notification = {
//                     teacherId: teacher._id,
//                     message: 'Vui lòng điền thông tin ngày tham gia làm việc vào hồ sơ.',
//                 };
//                 notifications.push(notification);
//             }

//             if (!teacher.avatarUrl) {
//                 const notification = {
//                     teacherId: teacher._id,
//                     message: 'Vui lòng thêm hình đại diện vào hồ sơ.',
//                 };
//                 notifications.push(notification);
//             }
//         });

//         res.status(201).json({
//             status: 'SUCCESS',
//             data: notifications,
//         });
//     } catch (error) {
//         console.error('Lỗi khi lấy thông báo:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }

// });

// router.get('/notifications', async (req, res) => {
//     try {
//         const allNotifications = await NotificationModel.find().populate('teacherId');
//         res.status(201).json({
//             status: 'SUCCESS',
//             notifications: allNotifications,
//         });
//     } catch (error) {
//         console.error('Lỗi khi lấy tất cả thông báo:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });


router.get('/notifications', async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 })
            .populate('teacherId')
            .populate({
                path: 'studentId',
                populate: [
                    { path: 'feesToPay' },
                    { path: 'major' }
                ]
            });
        res.status(201).json({
            status: 'SUCCESS',
            notifications: notifications,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

router.delete('/notifications/:notificationId', async (req, res) => {
    try {
        const notificationId = req.params.notificationId;

        // Kiểm tra xem thông báo có tồn tại không
        const existingNotification = await Notification.findById(notificationId);
        if (!existingNotification) {
            return res.status(404).json({ error: 'Không tìm thấy thông báo.' });
        }

        // Nếu thông báo tồn tại, xóa nó
        await Notification.deleteOne({ _id: notificationId });

        res.status(200).json({ message: 'Thông báo đã được xóa thành công.' });
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa thông báo.' });
    }
});

// router.delete('/notifications', async (req, res) => {
//     try {
//         const idToKeep1 = '65f983b306aa7c3ea696f5ba'; // ID bạn muốn giữ lại
//         const idToKeep2 = '65f984bfa28c0b84b5b3ad51'; // ID thứ hai bạn muốn giữ lại

//         // Xóa tất cả các thông báo trừ 2 ID đã chỉ định
//         await Notification.deleteMany({
//             _id: {
//                 $nin: [idToKeep1, idToKeep2]
//             }
//         });

//         res.json({ message: 'Đã xóa tất cả thông báo trừ 2 ID được chỉ định.' });
//     } catch (error) {
//         console.error('Đã xảy ra lỗi:', error);
//         res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa thông báo.' });
//     }
// });



module.exports = router;
