const express = require('express');
const router = express.Router();

const Teacher = require('../../../models/teacher');
const Notification = require('../../../models/notification');

/// Quyển Truy Cập Toàn Bộ Hệ Thống (có thể làm mọi thứ chính cấp quyền hay hủy quyền admin đó)
/// Quyền Tạo Mới và Quản Lý Tài Khoản Người Dùng: Admin có thể tạo mới tài khoản người dùng, cũng như quản lý các quyền hạn và vai trò của họ
/// Cập Nhật và Sửa Đổi Lớn: Quản trị viên có quyền thực hiện các cập nhật, sửa đổi lớn trong hệ thống như cấu trúc dữ liệu, cài đặt hệ thống và tính năng.
/// Quyền chỉ được xem không được làm gì khác


router.post('/system', async (req, res) => {
    try {
        const teacherIdToUpdate = req.body.teacherId;
        const requestedPermission = req.body.requestedPermission;
        const grantedByTeacherId = req.body.grantedById;

        const teacherToUpdate = await Teacher.findOne({ _id: teacherIdToUpdate });

        if (!teacherToUpdate) {
            return res.status(404).json({
                status: "no_teacher",
                message: 'Teacher not found',
            })
        }

        teacherToUpdate.system = requestedPermission;
        teacherToUpdate.grantedBy = grantedByTeacherId;

        const updatedTeacher = await teacherToUpdate.save();

        const notificationMessage = `Quyền hệ thống đã được cấp cho giáo viên.`;
        const newNotification = new Notification({
            title: 'Thông báo cấp quyền hệ thống',
            message: notificationMessage,
            systemIds: 'systemId',
            createdAt: new Date()
        });
        await newNotification.save();


        res.status(201).json({
            status: "SUCCESS",
            message: 'Permission granted to teacher',
            teacher: updatedTeacher,
        });
    } catch (error) {
        console.error('Error granting permission to teacher:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
