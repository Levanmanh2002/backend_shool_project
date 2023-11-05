const express = require('express');
const router = express.Router();

const Class = require("../../../../models/class")
const Student = require("../../../../models/student")

router.post('/add-students-to-class', async (req, res) => {
    try {
        const studentIds = req.body.studentIds; // Danh sách ID của học sinh
        const className = req.body.className; // Tên lớp học

        // Kiểm tra xem học sinh đã có lớp học hay chưa
        const student = await Student.findById(studentIds);

        if (!student) {
            return res.status(400).json({
                status: "check_student",
                error: 'Học sinh không tồn tại'
            });
        }

        if (student.class) {
            return res.status(400).json({
                status: "check_student_class",
                error: 'Học sinh đã có lớp học'
            });
        }

        // Tìm lớp học dựa trên tên lớp
        const classObject = await Class.findOne({ className });

        if (!classObject) {
            return res.status(400).json({
                status: "check_class",
                error: 'Lớp học không tồn tại'
            });
        }

        // Kiểm tra xem lớp học đã đủ 30 học sinh chưa
        if (classObject.students.length + studentIds.length >= 30) {
            return res.status(400).json({
                status: "check_full_class",
                error: 'Lớp học đã đầy'
            });
        }

        // Tìm và kiểm tra học sinh từng người
        for (const studentId of studentIds) {
            const student = await Student.findById(studentId);

            if (!student) {
                return res.status(400).json({
                    status: "check_student",
                    error: 'Học sinh không tồn tại'
                });
            }

            // Thêm học sinh vào danh sách học sinh của lớp
            classObject.students.push(student);
        }

        // Cập nhật lớp học cho học sinh
        student.class = className;
        await student.save();
        // Lưu lại thông tin lớp học
        await classObject.save();

        res.status(201).json({
            status: "SUCCESS",
            message: 'Thêm học sinh vào lớp thành công',
            student: student,
            students: studentIds,
            class: classObject,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

router.get('/students-without-class', async (req, res) => {
    try {
        // Truy vấn danh sách học sinh chưa có lớp học
        const studentsWithoutClass = await Student.find({ $or: [{ class: null }, { class: '' }] }).exec();

        // Trả về danh sách học sinh chưa có lớp học dưới dạng JSON
        res.status(201).json({ studentsWithoutClass });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

module.exports = router;