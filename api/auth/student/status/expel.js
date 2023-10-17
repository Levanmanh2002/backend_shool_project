const express = require('express');
const router = express.Router();
const Student = require('../../../../models/student');

// function handleStudentStatus(student) {
//     if (student.expulsion.isExpelled) {
//         // Nếu bị đuổi, tự động vô hiệu hóa tất cả các trạng thái khác
//         student.isStudying = false;
//         student.selfSuspension.isSelfSuspended = false;
//         student.suspension.isSuspended = false;

//         // Xóa dữ liệu khi bị đuổi
//         student.selfSuspension.suspensionEndDate = null;
//         student.selfSuspension.suspensionReason = '';
//         student.suspension.suspensionEndDate = null;
//         student.suspension.suspensionReason = '';
//     } else if (student.selfSuspension.isSelfSuspended) {
//         // Nếu tự nghỉ, tự động cập nhật các trạng thái
//         student.isStudying = false;
//         student.suspension.isSuspended = true;
//     } else if (student.suspension.isSuspended) {
//         // Nếu bị đình chỉ, tự động vô hiệu hóa các trạng thái khác
//         student.isStudying = false;
//         student.selfSuspension.isSelfSuspended = false;

//         // Xóa dữ liệu khi bị đình chỉ
//         student.selfSuspension.suspensionEndDate = null;
//         student.selfSuspension.suspensionReason = '';
//     } else {
//         // Nếu đang học, tự động vô hiệu hóa các trạng thái khác
//         student.selfSuspension.isSelfSuspended = false;
//         student.suspension.isSuspended = false;
//         student.expulsion.isExpelled = false;

//         // Xóa dữ liệu khi đang học
//         student.selfSuspension.suspensionEndDate = null;
//         student.selfSuspension.suspensionReason = '';
//         student.suspension.suspensionEndDate = null;
//         student.suspension.suspensionReason = '';
//         student.expulsion.expulsionDate = null;
//         student.expulsion.expulsionReason = '';
//     }
// }

// Học sinh đã bị đuổi
router.put('/expel/:mssv', async (req, res) => {
    try {
        const mssv = req.params.mssv;
        const expulsionDate = req.body.expulsionDate;
        const expulsionReason = req.body.expulsionReason;

        const student = await Student.findOne({ mssv });

        if (!student) {
            return res.status(404).json({ error: 'Không tìm thấy học sinh.' });
        }

        student.expulsion.isExpelled = true;
        student.expulsion.expulsionDate = expulsionDate;
        student.expulsion.expulsionReason = expulsionReason;

        // handleStudentStatus(student);
        await student.save();

        res.status(201).json({
            status: "SUCCESS",
            message: 'Học sinh đã bị đuổi.',
            time: expulsionDate,
            data: expulsionReason
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

module.exports = router;
