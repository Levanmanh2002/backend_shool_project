const express = require('express');
const Teacher = require('../../../models/teacher');
const router = express.Router();

router.delete('/delete-teacher/:teacherId', async (req, res) => {
    const teacherIdToDelete = req.params.teacherId;

    try {
        const result = await Teacher.deleteOne({ teacherId: teacherIdToDelete });
        if (result.deletedCount === 1) {
            res.status(201).json({ message: 'Tài khoản giáo viên đã được xóa thành công' });
        } else {
            res.status(404).json({ error: 'Không tìm thấy tài khoản giáo viên' });
        }
    } catch (err) {
        console.error('Lỗi khi xóa tài khoản giáo viên:', err);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

module.exports = router;
