const express = require('express');
const router = express.Router();

const Student = require('../../../models/student');

router.get('/countNewStudents', async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
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