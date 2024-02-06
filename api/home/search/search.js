const express = require('express');
const router = express.Router();
const Student = require('../../../models/student');

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
            message: "Tìm kiếm thành công",
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

module.exports = router;