const express = require('express');
const router = express.Router();
const Student = require('../../../../models/student');
const handleStudentStatus = require('../status/utils/studentUtils');

// Học sinh tự nghỉ
router.put('/self-suspend/:mssv', async (req, res) => {
    try {
        const mssv = req.params.mssv;
        const suspensionEndDate = req.body.suspensionEndDate;
        const suspensionReason = req.body.suspensionReason;

        const student = await Student.findOne({ mssv });

        if (!student) {
            return res.status(404).json({ error: 'Không tìm thấy học sinh.' });
        }

        student.selfSuspension.isSelfSuspended = true;
        student.selfSuspension.suspensionEndDate = suspensionEndDate;
        student.selfSuspension.suspensionReason = suspensionReason;

        handleStudentStatus(student);
        await student.save();

        res.status(201).json({
            message: "Học sinh đã tự nghỉ học.",
            time: suspensionEndDate,
            data: suspensionReason
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

module.exports = router;
