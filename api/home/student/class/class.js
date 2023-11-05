const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Class = require('../../../../models/class');

router.post('/create-class', async (req, res) => {
    try {
        const className = req.body.className;
        const classId = uuidv4();

        // Kiểm tra xem lớp học đã tồn tại chưa
        const existingClass = await Class.findOne({ className });

        if (existingClass) {
            return res.status(400).json({
                status: "check_class",
                error: 'Lớp học đã tồn tại'
            });
        }

        // Tạo một lớp học mới
        const newClass = new Class({ className, classId });
        await newClass.save();

        res.status(201).json({
            status: "SUCCESS",
            message: 'Lớp học mới đã được tạo',
            class: newClass,
            id: newClass.classId,
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

router.get('/classes', async (req, res) => {
    try {
        const classes = await Class.find();

        res.status(201).json({
            status: "SUCCESS",
            totalClasses: classes.length,
            classes: classes.map(cls => ({ className: cls.className, id: cls.id, classId: cls.classId })),
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

module.exports = router;
