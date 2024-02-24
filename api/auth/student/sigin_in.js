const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Student = require("../../../models/student");

const JWT_KEY = "secret";

router.post('/signin', async (req, res) => {
    try {
        const { mssv, password } = req.body;

        const student = await Student.findOne({ mssv }).populate('feesToPay');

        if (!student) {
            return res.status(401).json({
                status: "wrong_mssv",
                error: 'Invalid mssv'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, student.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: "wrong_pass",
                error: 'Invalid password'
            });
        }

        const token = jwt.sign({ mssv: student.mssv }, JWT_KEY);

        res.status(201).json({
            status: "SUCCESS",
            message: "Học sinh",
            data: student,
            token: token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;