const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const Student = require("../../../models/student");

router.post('/signin', async (req, res) => {
    try {
        const { mssv, password } = req.body;

        const student = await Student.findOne({ mssv });

        if (!student) {
            return res.status(401).json({ error: 'Invalid mssv' });
        }

        const isPasswordValid = await bcrypt.compare(password, student.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        res.status(201).json({
            status: "SUCCESS",
            message: "Học sinh",
            data: student
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;