const express = require('express');
const router = express.Router();
const Student = require('../../../models/student');

router.get('/total_new_list', async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();

        const firstDayOfCurrentYear = new Date(currentYear, 0, 1);
        const firstDayOfNextYear = new Date(currentYear + 1, 0, 1);

        const studentsEnrolledThisYear = await Student.find({
            createdAt: { $gte: firstDayOfCurrentYear, $lt: firstDayOfNextYear },
        });

        res.status(201).json({
            status: "SUCCESS",
            message: 'Danh sách học sinh mới',
            total: studentsEnrolledThisYear.length,
            students: studentsEnrolledThisYear,
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách học sinh:', error);
        res.status(500).json({ error: 'Lỗi khi xử lý yêu cầu' });
    }
});


router.get('/new_list', async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const firstDayOfCurrentYear = new Date(currentYear, 0, 1);
        const firstDayOfNextYear = new Date(currentYear + 1, 0, 1);

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const offset = (page - 1) * limit;


        const studentsEnrolledThisYear = await Student.find({
            createdAt: { $gte: firstDayOfCurrentYear, $lt: firstDayOfNextYear },
        }).skip(offset).limit(limit).populate('feesToPay');

        res.status(201).json({
            status: "SUCCESS",
            message: 'Danh sách học sinh mới',
            total: studentsEnrolledThisYear.length,
            students: studentsEnrolledThisYear,
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách học sinh:', error);
        res.status(500).json({ error: 'Lỗi khi xử lý yêu cầu' });
    }
});

module.exports = router;
