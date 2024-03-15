const express = require('express');
const router = express.Router();
const Teacher = require('../../../models/teacher');

router.get('/total', async (req, res) => {
    try {
        const totalTeachers = await Teacher.find({}).populate('grantedBy');
        res.status(201).json({
            status: "SUCCESS",
            total: totalTeachers.length,
            message: "Danh sách các giáo viên",
            data: totalTeachers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

router.get('/total_page', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const totalTeachers = await Teacher.find({})
            .skip((page - 1) * limit)
            .limit(limit).populate('grantedBy');

        res.status(201).json({
            status: "SUCCESS",
            total: totalTeachers.length,
            message: "Danh sách các giáo viên",
            data: totalTeachers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});


module.exports = router;
