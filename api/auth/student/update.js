const express = require('express');
const router = express.Router();

const Student = require("../../../models/student");

router.put('/update/student/:studentId', async (req, res) => {
    try {
        const { studentId, gmail, phone, cccd } = req.params;
        const updatedStudentData = req.body;

        const student = await Student.findOne({ studentId });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const existingGmail = await Student.findOne({ gmail: updatedStudentData.gmail });
        if (existingGmail) {
            return res.status(400).json({ error: 'Gmail already exists' });
        }
        const existingGmailData = await Student.findOne({ gmail });
        if (existingGmailData) {
            return res.status(400).json({ error: 'Gmail already exists' });
        }

        const existingPhoneData = await Student.findOne({ phone });
        if (existingPhoneData) {
            return res.status(400).json({ error: 'Phone already exists' });
        }
        const existingPhone = await Student.findOne({ phone: updatedStudentData.phone });
        if (existingPhone) {
            return res.status(400).json({ error: 'Phone already exists' });
        }

        const existingCccdData = await Student.findOne({ cccd });
        if (existingCccdData) {
            return res.status(400).json({ error: 'CCCD already exists' });
        }
        const existingCccd = await Student.findOne({ cccd: updatedStudentData.cccd });
        if (existingCccd) {
            return res.status(400).json({ error: 'CCCD already exists' });
        }

        student.gmail = updatedStudentData.gmail;
        student.phone = updatedStudentData.phone;
        student.fullName = updatedStudentData.fullName;
        student.birthDate = updatedStudentData.birthDate;
        student.cccd = updatedStudentData.cccd;
        student.birthPlace = updatedStudentData.birthPlace;

        await student.save();

        res.status(201).json({
            status: "SUCCESS",
            message: 'Thông tin học sinh đã được cập nhật thành công.',
            data: student
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
