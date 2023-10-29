const express = require('express');
const router = express.Router();
const TimeTable = require('../../../models/timetable');
const Teacher = require('../../../models/teacher');
const Major = require('../../../models/major');
const Class = require('../../../models/class');
const dateAndTime = require('date-and-time');

router.post('/create', async (req, res) => { // tạo một lịch học 
    try {
        const teacherId = req.body.teacher_id; // Mã giáo viên
        const classId = req.body.class_id; // Mã lớp
        const majorId = req.body.major_id; // Mã môn học
        const startTime = new Date(req.body.start_time); // ngày môn học đó trên thời khóa biểu (theo kiển int)
        const duration = req.body.duration // khoảng thời gian tính theo giây

        const endTime = dateAndTime.addSeconds(startTime, duration);

        // Tìm các lịch học cùng môn mà thời gian của lớp đó và môn đó lại trùng nhau
        const result = await TimeTable.findOne(getQuerySameTimetable(classId, majorId, startTime, endTime));

        if (result != null) {
            return res.status(400).json({
                status: "FAIL",
                message: "Thời khóa biểu đã được tạo",
            });
        }

        const data = await Promise.all([
            Teacher.findById(teacherId),
            Class.findById(classId),
            Major.findById(majorId)
        ]);

        const teacher = data[0];
        const studentClass = data[1];
        const major = data[2];

        if (teacher == null) {
            return res.status(400).json({
                status: "TEACHERFAIL",
                message: "Giáo viên không tồn tại",
            });
        }

        if (studentClass == null) {
            return res.status(400).json({
                status: "CLASSFAIL",
                message: "Lớp học không tồn tại",
            });
        }

        if (major == null) {
            return res.status(400).json({
                status: "MAJORFAIL",
                message: "Môn học không tồn tại",
            });
        }

        const timeTable = new TimeTable();
        timeTable.startTime = startTime;
        timeTable.endTime = endTime;
        timeTable.classId = classId;
        timeTable.class = studentClass;
        timeTable.teacherId = teacherId;
        timeTable.teacher = teacher;
        timeTable.majorId = majorId;
        timeTable.major = major;
        timeTable.duration = duration;
        timeTable.status = 'create';
        await timeTable.save();

        res.status(201).json({
            status: "SUCCESS",
            message: "Tạo thời khóa biểu thành công",
            data: timeTable
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: "FAIL",
            message: "Lỗi máy chủ",
        });
    }
});

router.post('/create-semester', async (req, res) => { // tạo thời khóa biểu theo kiểu nhiều tuần
    try {
        const teacherId = req.body.teacher_id; // Mã giáo viên
        const classId = req.body.class_id; // Mã lớp
        const majorId = req.body.major_id; // Mã môn học
        const startTime = new Date(req.body.start_time); // ngày môn học đó trên thời khóa biểu (theo kiển int)
        const duration = req.body.duration // khoảng thời gian tính theo giây
        const numberWeek = req.body.number_weeks; // Số tuần mà bạn muốn tạo thời khóa biểu với nội dung như nhau

        const endTime = dateAndTime.addSeconds(startTime, duration);

        // Tìm các lịch học cùng môn mà thời gian của lớp đó và môn đó lại trùng nhau
        const result = await TimeTable.findOne(getQuerySameTimetable(classId, majorId, startTime, endTime));

        if (result != null) {
            console.log('da co')
            return res.status(205).json({
                status: "FAIL",
                message: "Thời khóa biểu đã được tạo",
            });
        }

        const data = await Promise.all([
            Teacher.findById(teacherId),
            Class.findById(classId),
            Major.findById(majorId)
        ]);

        const teacher = data[0];
        const studentClass = data[1];
        const major = data[2];

        if (teacher == null) {
            return res.status(205).json({
                status: "FAIL",
                message: "Giáo viên không tồn tại",
            });
        }

        if (studentClass == null) {
            return res.status(205).json({
                status: "FAIL",
                message: "Lớp học không tồn tại",
            });
        }

        if (major == null) {
            return res.status(205).json({
                status: "FAIL",
                message: "Môn học không tồn tại",
            });
        }
        const timeTables = [];

        for (var i = 0; i < numberWeek; i++) {
            const newStartTime = dateAndTime.addDays(startTime, i * 7)
            const newEndTime = dateAndTime.addSeconds(newStartTime, duration);

            const timeTable = new TimeTable();
            timeTable.startTime = newStartTime;
            timeTable.endTime = newEndTime;
            timeTable.classId = classId;
            timeTable.class = studentClass;
            timeTable.teacherId = teacherId;
            timeTable.teacher = teacher;
            timeTable.majorId = majorId;
            timeTable.major = major;
            timeTable.duration = duration;
            timeTable.status = 'create';
            await timeTable.save();
            timeTables.push(timeTable);
        }
        res.status(201).json({
            status: "SUCCESS",
            message: "Tạo thời khóa biểu thành công",
            data: timeTables
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: "FAIL",
            message: "Lỗi máy chủ",
        });
    }
})

router.put('/update/:id', async (req, res) => {
    try {
        const result = await TimeTable.findById(req.params.id);

        const teacherId = req.body.teacher_id; // Mã giáo viên
        const classId = req.body.class_id; // Mã lớp
        const majorId = req.body.major_id; // Mã môn học
        const startTime = new Date(req.body.day); // ngày môn học đó trên thời khóa biểu (theo kiển int)
        const duration = req.body.duration // khoảng thời gian tính theo giây
        const status = req.body.status;

        const endTime = dateAndTime.addSeconds(startTime, duration);

        if (result == null) {
            res.status(205).json({
                status: "SUCCESS",
                message: "Thời khóa biểu không tồn tại",
                data: result
            });
            return;
        }

        const otherTimeTable = await TimeTable.find(getQuerySameTimetable(classId, majorId, startTime, endTime));

        const index = otherTimeTable.findIndex((val, index, arr) => val.id == req.params.id);
        if (index != -1) {
            otherTimeTable.slice(index, 1);
        }

        if (otherTimeTable.length > 0) {
            res.status(205).json({
                status: "SUCCESS",
                message: "Thời khóa biểu bị trùng",
                data: result
            });
            return;
        }

        const data = await Promise.all([
            Teacher.findById(teacherId),
            Class.findById(classId),
            Major.findById(majorId)
        ]);

        const teacher = data[0];
        const studentClass = data[1];
        const major = data[2];

        if (teacher == null) {
            res.status(205).json({
                status: "FAIL",
                message: "Giáo viên không tồn tại",
            });
            return;
        }

        if (studentClass == null) {
            res.status(205).json({
                status: "FAIL",
                message: "Lớp học không tồn tại",
            });
            return;
        }

        if (major == null) {
            res.status(205).json({
                status: "FAIL",
                message: "Môn học không tồn tại",
            });
            return;
        }

        result.startTime = startTime;
        result.endTime = endTime;
        result.classId = classId;
        result.class = studentClass;
        result.teacherId = teacherId;
        result.teacher = teacher;
        result.majorId = majorId;
        result.major = major;
        result.duration = duration;
        result.status = status;
        await result.save();
        res.status(201).json({
            status: "SUCCESS",
            message: "Tạo thời khóa biểu thành công",
            data: result
        })

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

function getQuerySameTimetable(classId, majorId, start_time, end_time) {
    return {
        classId: classId,
        majorId: majorId,
        $or: [
            {
                $and: [
                    { startTime: { $gt: start_time } },
                    { startTime: { $lt: end_time } },
                    { endTime: { $gt: end_time } },
                    { startTime: { $ne: end_time } }]
            },
            {
                $and: [
                    { startTime: { $lt: start_time } },
                    { endTime: { $gt: end_time } },]
            },
            {
                $and: [
                    { startTime: { $lt: start_time } },
                    { endTime: { $gt: start_time } },
                    { endTime: { $lt: end_time } },
                    { endTime: { $ne: start_time } }]
            },
        ]
    };
}

module.exports = router;