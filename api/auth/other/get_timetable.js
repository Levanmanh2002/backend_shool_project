const express = require('express');
const router = express.Router();
const TimeTable = require('../../../models/timetable');

router.get('/get-all', async (req, res) => {
    try {
        const result = await TimeTable.find();

        res.status(201).json({
            status: "SUCCESS",
            message: "Danh sách thời khóa biểu",
            data: result
        });
    } catch (e) {
        console.log(error);
        res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
});

router.get('/get-by-teacher', async (req, res) => {
    try {
        const result = await TimeTable.find({ teacherId: req.body.teacher_id });

        res.status(201).json({
            status: "SUCCESS",
            message: "Danh sách thời khóa biểu",
            data: result
        });
    } catch (e) {
        console.log(error);
        res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
});

router.get('/get-by-class', async (req, res) => {
    try {
        const result = await TimeTable.find({ classId: req.body.class_id });

        res.status(201).json({
            status: "SUCCESS",
            message: "Danh sách thời khóa biểu",
            data: result
        });
    } catch (e) {
        console.log(error);
        res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
});

router.get('/get-by-major', async (req, res) => {
    try {
        const result = await TimeTable.find({ majorId: req.body.major_id });

        res.status(201).json({
            status: "SUCCESS",
            message: "Danh sách thời khóa biểu",
            data: result
        });
    } catch (e) {
        console.log(error);
        res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
});

router.get('/get-detail/:id', async (req , res) => {
    try {
        const result = await TimeTable.findById(req.params.id);

        res.status(201).json({
            status: "SUCCESS",
            message: "Danh sách thời khóa biểu",
            data: result
        });
    } catch (e) {
        console.log(error);
        res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
})

module.exports = router;