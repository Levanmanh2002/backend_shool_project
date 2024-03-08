const express = require('express');
const router = express.Router();
const Teacher = require('../../../models/teacher');

router.get('/working-teachers', async (req, res) => {
    try {
        const workingTeachers = await Teacher.find({ isWorking: true }).populate('grantedBy');
        res.status(201).json({
            status: "SUCCESS",
            total: workingTeachers.length,
            message: "Danh sách các giáo viên đang làm việc",
            data: workingTeachers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

module.exports = router;
