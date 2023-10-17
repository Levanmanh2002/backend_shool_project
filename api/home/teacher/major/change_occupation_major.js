const express = require('express');
const router = express.Router();
const Student = require('../../../../models/student');

router.post('/change-occupation', async (req, res) => {
    try {
        const { studentId, newOccupation } = req.body;

        const student = await Student.findOne({ studentId: studentId });

        if (!student) {
            return res.status(404).json({ error: 'Học sinh không tồn tại' });
        }

        student.occupation = newOccupation;

        await student.save();

        return res.status(200).json({
            status: "SUCCESS",
            message: "Trường Chuyển ngành đã được cập nhật",
            data: student
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

module.exports = router;
