const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Teacher = require("../../../models/teacher");

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

router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const teacherCode = req.user.teacherCode;

        const teacher = await Teacher.findOne({ teacherCode });

        if (!teacher) {
            return res.status(404).json({ error: 'Không tìm thấy thông tin giáo viên.' });
        }

        res.status(201).json({
            status: "SUCCESS",
            data: teacher
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

module.exports = router;
