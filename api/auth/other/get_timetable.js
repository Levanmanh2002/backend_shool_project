const express = require('express');
const router = express.Router();
const TimeTable = require('../../../models/timetable');
const Teacher = require('../../../models/teacher');
const Class = require('../../../models/class');
const Major = require('../../../models/major');

router.get('/get-all', async (req, res) => {
    try {
        var result = await TimeTable.find();
        
        result = await fetchDataTimeTable(result);

        res.status(201).json({
            status: "SUCCESS",
            message: "Danh sách thời khóa biểu",
            data: result
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
});

router.get('/get-by-teacher', async (req, res) => {
    try {
        var result = await TimeTable.find({ teacherId: req.body.teacher_id });

        result = await fetchDataTimeTable(result);

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
        var result = await TimeTable.find({ classId: req.body.class_id });

        result = await fetchDataTimeTable(result);

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
        var result = await TimeTable.find({ majorId: req.body.major_id });

        result = await fetchDataTimeTable(result);

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
        const fetchData = await Promise.all([
            Class.findById(val.classId),
            Teacher.findById(val.teacherId),
            Major.findById(val.majorId),
        ]);
        result.class = fetchData[0];
        result.teacher = fetchData[1];
        result.major = fetchData[2];

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

router.get('/get-duration', async (req, res) => {
    try {
        if (req.query.startTime == null|| req.query.endTime == null) {
            return res.status(205).json({
                status: "FAIL",
                message: "Biến đầu vào không hợp lệ",
                data: result
            });
        }
        const classId = req.query.class_id; // mã lớp học
        // thời gian bắt đầu trong tuần
        // ví dụ: bắt đầu là ngày 23/10/2023 thì truyển vào theo time là 23/10/2023 00:00:00
        const startTime = new Date(parseInt(req.query.startTime));
        // thời gian kết thúc trong tuần
        // ví dụ: kết thúc là ngày 23/10/2023 thì truyển vào theo time là 23/10/2023 23:59:59
        const endTime = new Date(parseInt(req.query.endTime));
        const query = {
            $and: [
                { startTime: { $gte: startTime } },
                { endTime: { $lte: endTime } }
            ]
        };
        if(classId != null) {
            query.classId = classId;
        }
        var result = await TimeTable.find(query);

        result = await fetchDataTimeTable(result);

        res.status(201).json({
            status: "SUCCESS",
            message: "Danh sách thời khóa biểu",
            data: result
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
});

async function fetchDataTimeTable(timetables) {
    return Promise.all(timetables.map(async (val, index, arr) => {
        const fetchData = await Promise.all([
            Class.findById(val.classId),
            Teacher.findById(val.teacherId),
            Major.findById(val.majorId),
        ]);
        val.class = fetchData[0];
        val.teacher = fetchData[1];
        val.major = fetchData[2];
        return val;
    }));
} 


module.exports = router;