const express = require('express');
const router = express.Router();

const Class = require("../../../../models/class");
const Teacher = require("../../../../models/teacher");

router.post('/add-teacher-to-class', async (req, res) => {
    try {
        const className = req.body.className;
        const teacherId = req.body.teacherId;

        // Kiểm tra xem lớp học đã tồn tại
        const existingClass = await Class.findOne({ className });

        if (!existingClass) {
            return res.status(400).json({
                status: "check_class",
                error: 'Lớp học không tồn tại'
            });
        }

        // Tìm giáo viên dựa trên teacherId
        const teacher = await Teacher.findById(teacherId);

        if (!teacher) {
            return res.status(400).json({
                status: "check_teacher",
                error: 'Giáo viên không tồn tại'
            });
        }

        // Kiểm tra xem lớp học đã có giáo viên chưa
        if (existingClass.teacher) {
            return res.status(400).json({
                status: "check_class_teacher",
                error: 'Lớp học đã có giáo viên'
            });
        }

        // Gán giáo viên cho lớp học
        existingClass.teacher = teacher;
        await existingClass.save();

        res.status(201).json({
            status: "SUCCESS",
            message: 'Giáo viên đã được thêm vào lớp học',
            class: existingClass,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

module.exports = router;