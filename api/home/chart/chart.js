const express = require('express');
const router = express.Router();
const datetime = require('date-and-time');

const Student = require('../../../models/student');

router.get('/countNewStudents', async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        if (!startDate || !endDate || isNaN(new Date(startDate)) || isNaN(new Date(endDate))) {
            return res.status(400).json({ error: 'Ngày không hợp lệ' });
        }

        const students = await Student.find({
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
        });

        const count = students.length;

        res.status(201).json({
            status: 'SUCCESS',
            data: {
                count,
                students,
            }
        });
    } catch (error) {
        console.error('Lỗi:', error);
        res.status(500).json({ error: 'Đã có lỗi xảy ra' });
    }
});

router.get('/countNewStudentInWeek', async (req, res) => {
    const { startDate } = req.query;

    try {
        if (startDate == undefined) {
            return res.status(400).json({ error: 'Ngày không hợp lệ' });
        }

        const start = new Date(parseInt(startDate));
        console.log(start);

        const endDate =  datetime.addDays(start, 7);

        const students = await Student.find({
            createdAt: {
                $gte: start,
                $lte: endDate,
            },
        });

        const result = [];
        for(var i = 0; i < 7; i++) {
            const currentDay = datetime.addDays(start, i);
            const currentStudent = students.filter((val ,index, arr) => val.createdAt.getDate() == currentDay.getDate() && val.createdAt.getMonth() == currentDay.getMonth());
            result.push({
                nunber: currentStudent.length,
                student: currentStudent,
                day: currentDay.getDate() + '/' + currentDay.getMonth() + '/' + currentDay.getFullYear(),
            });
        }

        res.status(201).json({
            status: 'SUCCESS',
            data: result
        });
    } catch (error) {
        console.error('Lỗi:', error);
        res.status(500).json({ error: 'Đã có lỗi xảy ra' });
    }
});

module.exports = router;