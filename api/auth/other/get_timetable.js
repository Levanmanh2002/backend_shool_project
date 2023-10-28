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

router.get('/get-detail/:id', async (req, res) => {
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

router.get('/get-duration', async (req, res) => {
    try {
        if(type(req.body.startTime) == "String" || type(req.body.endTime) == "String") {
            return res.status(205).json({
                status: "FAIL",
                message: "Biến đầu vào không hợp lệ",
                data: result
            });
        }
        const classId = req.body.class_id; // mã lớp học
        // thời gian bắt đầu trong tuần
        // ví dụ: bắt đầu là ngày 23/10/2023 thì truyển vào theo time là 23/10/2023 00:00:00
        const startTime = new Date(req.body.startTime);
        // thời gian kết thúc trong tuần
        // ví dụ: kết thúc là ngày 23/10/2023 thì truyển vào theo time là 23/10/2023 23:59:59
        const endTime = new Date(req.body.endTime);
        const result = await TimeTable.find({
            classId: classId,
            $and: [
                { startTime: { $gte: startTime } },
                { endTime: { $lte: endTime } }
            ]
        });

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