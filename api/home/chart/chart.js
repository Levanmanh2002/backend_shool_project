const express = require('express');
const router = express.Router();

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

module.exports = router;