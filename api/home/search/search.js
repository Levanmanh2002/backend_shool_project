const express = require('express');
const router = express.Router();
const Student = require('../../../models/student');
const Teacher = require('../../../models/teacher');

router.post('/students', async (req, res) => {
    try {
        const { searchQuery } = req.query;

        const query = {
            $or: [
                { mssv: searchQuery },
                { fullName: { $regex: new RegExp(searchQuery, 'i') } },
                { gmail: searchQuery },
            ]
        };

        const students = await Student.find(query);
        res.status(201).json({
            status: "SUCCESS",
            message: "Tìm kiếm học sinh thành công",
            data: students,
        });

    } catch (error) {
        res.status(500).json({
            status: "FAIL",
            message: "Lỗi máy chủ",
            message: error.message,
        });
    }
});

router.post('/mssv', async (req, res) => {
    try {
        const { searchQuery } = req.query;

        const query = { mssv: searchQuery };

        const students = await Student.find(query).populate('feesToPay').populate('major');
        res.status(201).json({
            status: "SUCCESS",
            message: "Tìm kiếm học sinh thành công",
            data: students,
        });

    } catch (error) {
        res.status(500).json({
            status: "FAIL",
            message: "Lỗi máy chủ",
        });
    }
});


router.post('/teachers', async (req, res) => {
    try {
        const { searchQuery } = req.query;

        const query = {
            $or: [
                { fullName: { $regex: new RegExp(searchQuery, 'i') } },
                { teacherCode: searchQuery },
                { email: searchQuery },
            ]
        };

        const teachers = await Teacher.find(query);

        res.status(201).json({
            status: "SUCCESS",
            message: "Tìm kiếm giáo viên thành công",
            data: teachers,
        });
    } catch (error) {
        res.status(500).json({
            status: "FAIL",
            message: "Lỗi máy chủ",
            error: error.message,
        });
    }
});


router.post('/search_all', async (req, res) => {
    try {
        const { searchQuery } = req.query;

        const studentQuery = {
            $or: [
                { fullName: { $regex: new RegExp(searchQuery, 'i') } },
                { mssv: searchQuery },
                { gmail: searchQuery },
            ]
        };

        const teacherQuery = {
            $or: [
                { fullName: { $regex: new RegExp(searchQuery, 'i') } },
                { teacherCode: searchQuery },
                { email: searchQuery },
            ]
        };

        const [students, teachers] = await Promise.all([
            Student.find(studentQuery),
            Teacher.find(teacherQuery)
        ]);

        res.status(201).json({
            status: "SUCCESS",
            message: "Tìm kiếm thành công",
            data: {
                students,
                teachers,
            }
        });

    } catch (error) {

        res.status(500).json({
            status: "FAIL",
            message: "Lỗi máy chủ",
            error: error.message,
        });
    }
});


module.exports = router;