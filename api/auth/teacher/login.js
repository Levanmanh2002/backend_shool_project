const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Teacher = require("../../../models/teacher");

const JWT_KEY = "secret";

router.post('/login', async (req, res) => {
    try {
        const { teacherCode, password } = req.body;

        const teacher = await Teacher.findOne({ teacherCode });

        if (!teacher) {
            return res.status(401).json({
                status: "wrong_teacher_code",
                error: 'Sai mã số giáo viên.'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, teacher.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: "wrong_pass",
                error: 'Sai mật khẩu.'
            });
        }

        const token = jwt.sign({ teacherCode: teacher.teacherCode }, JWT_KEY);

        res.status(201).json({
            status: "SUCCESS",
            message: "SignIn successful",
            data: teacher,
            token: token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

module.exports = router;
