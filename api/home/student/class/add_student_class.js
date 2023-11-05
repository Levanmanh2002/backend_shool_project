const express = require('express');
const router = express.Router();

const Class = require("../../../../models/class")
const Student = require("../../../../models/student")

router.post('/add-student-to-class', async (req, res) => {
    try {
        const studentId = req.body.studentId; // ID của học sinh
        const className = req.body.className; // Tên lớp học

        // Tìm học sinh dựa trên ID
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(400).json({ error: 'Học sinh không tồn tại' });
        }

        // Tìm lớp học dựa trên tên lớp
        const classObject = await Class.findOne({ className });

        if (!classObject) {
            return res.status(400).json({ error: 'Lớp học không tồn tại' });
        }

        // Kiểm tra xem lớp học đã đủ 30 học sinh chưa
        if (classObject.students.length >= 30) {
            return res.status(400).json({ error: 'Lớp học đã đầy' });
        }

        // Thêm học sinh vào danh sách học sinh của lớp
        classObject.students.push(student);

        // Lưu lại thông tin lớp học
        await classObject.save();

        res.status(201).json({
            message: 'Thêm học sinh vào lớp thành công',
            student: student,
            class: classObject,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

router.put('/edit-class/:classId', async (req, res) => {
    const classId = req.params.classId;
    const updatedClassName = req.body.updatedClassName;

    try {
        const existingClass = await Class.findById(classId);

        if (!existingClass) {
            return res.status(404).json({ error: 'Lớp học không tồn tại' });
        }

        existingClass.className = updatedClassName;
        await existingClass.save();

        res.status(201).json({
            message: 'Lớp học đã được chỉnh sửa',
            class: existingClass,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

router.delete('/delete-class/:classId', async (req, res) => {
    const classId = req.params.classId;

    try {
        const existingClass = await Class.findById(classId);

        if (!existingClass) {
            return res.status(404).json({ error: 'Lớp học không tồn tại' });
        }

        await Class.deleteOne({ _id: classId });

        res.status(201).json({
            message: 'Lớp học đã được xóa',
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});



module.exports = router;