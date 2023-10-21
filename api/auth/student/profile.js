const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Student = require("../../../models/student");

const JWT_KEY = "secret";

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ error: 'Token xác thực không tồn tại.' });

    jwt.verify(token, JWT_KEY, (error, user) => {
        if (error) return res.status(403).json({ error: 'Token xác thực không hợp lệ.' });
        req.user = user;
        next();
    });
}

router.get('/profile_student', authenticateToken, async (req, res) => {
    try {
        const mssv = req.user.mssv;

        const student = await Student.findOne({ mssv });

        if (!student) {
            return res.status(404).json({ error: 'Không tìm thấy thông tin học sinh.' });
        }

        res.status(201).json({
            status: "SUCCESS",
            message: "Thông tin học sinh",
            data: student
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

module.exports = router;
