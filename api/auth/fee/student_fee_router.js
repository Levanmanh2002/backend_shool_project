const express = require('express');
const StudentFee = require('../../../models/student_fee');
const router = express.Router();

router.get('/get-by-student/:id', async (req, res) => {
    try {
        const result = await StudentFee.findById(req.params.id);

        res.status(201).json({
            status: "SUCCESS",
            message: "Danh sách phí",
            data: result
        });
    } catch (err) {
        console.error('Lỗi khi xóa tài khoản giáo viên:', err);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

module.exports = router;
