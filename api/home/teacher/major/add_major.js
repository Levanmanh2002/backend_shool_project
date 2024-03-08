const express = require('express');
const router = express.Router();

const Major = require('../../../../models/major');
const Student = require('../../../../models/student');

router.post('/add-major', async (req, res) => {
    try {
        const { name, description } = req.body;

        const existingNameMajor = await Major.findOne({ name });

        if (existingNameMajor) {
            return res.status(400).json({
                status: "FAILED",
                error: 'Ngành học đã tồn tại.'
            });
        }

        const newMajor = new Major({
            name,
            description
        });

        await newMajor.save();

        res.status(201).json({
            status: "SUCCESS",
            message: "Ngành học đã được thêm",
            data: newMajor
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

router.put('/change_major', async (req, res) => {
    try {
        const { studentId, newMajorId } = req.body;

        const newMajor = await Major.findById(newMajorId);
        if (!newMajor) {
            return res.status(400).json({
                status: "invalid_major",
                error: 'Invalid major provided'
            });
        }

        // Tìm học sinh trong cơ sở dữ liệu
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({
                status: "student_not_found",
                error: 'Student not found'
            });
        }

        // Cập nhật ngành nghề mới cho học sinh
        student.major = newMajorId;
        await student.save();

        res.status(201).json({
            status: "SUCCESS",
            message: "Chuyên ngành của sinh viên đã được thay đổi thành công",
            student: student,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
