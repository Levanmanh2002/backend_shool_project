const express = require('express');
const router = express.Router();

const Student = require('../../../models/student');

router.get('/countNewStudents', async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        const count = await Student.countDocuments({
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
        });

        res.status(201).json({
            status: 'SUCCESS',
            data: count
        });
    } catch (error) {
        console.error('Lỗi:', error);
        res.status(500).json({ error: 'Đã có lỗi xảy ra' });
    }
});

module.exports = router;