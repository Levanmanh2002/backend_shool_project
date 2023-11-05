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
