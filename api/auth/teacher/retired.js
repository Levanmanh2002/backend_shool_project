const express = require('express');
const router = express.Router();
const Teacher = require('../../../models/teacher');

router.get('/retired-teachers', async (req, res) => {
    try {
        const retiredTeachers = await Teacher.find({ isWorking: false });

        res.status(201).json({
            status: "SUCCESS",
            message: "Danh sách những giáo viên đã nghỉ việc",
            data: retiredTeachers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

module.exports = router;
