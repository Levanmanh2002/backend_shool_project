const express = require('express');
const router = express.Router();
const Student = require('../../../../models/student');

// Kiểm tra tình trạng học sinh
router.get('/check/:mssv', async (req, res) => {
    try {
        const mssv = req.params.mssv;
        const student = await Student.findOne({ mssv });

        if (!student) {
            return res.status(404).json({ error: 'Không tìm thấy học sinh.' });
        }

        res.status(201).json({ message: 'Kiểm tra tình trạng thành công', student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

module.exports = router;
