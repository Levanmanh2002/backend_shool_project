const express = require('express');
const router = express.Router();
const TimeTable = require('../../../models/timetable');

router.delete('/delete/:id', async (req, res) => {
    try {
        const result = await TimeTable.findByIdAndDelete(req.params.id);

        if (result != null) {
            res.status(201).json({ error: "Xoá thành công" });
        } else {
            res.status(202).json({ error: "Xoá không thành công" });
        }
    } catch (e) {
        console.log(error);
        res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
});

router.delete('/delete-major', async (req, res) => {
    try {
        const majorId = req.body.major_id;
        const classId = req.body.class_id;

        const result = await TimeTable.deleteMany({ majorId: majorId, classId: classId });

        if (result.deletedCount === 1) {
            res.status(201).json({ message: 'Xóa thành công với môn học của lớp đó' });
        } else {
            res.status(404).json({ error: 'Không tìm thấy môn học của lớp đó' });
        }
        
    } catch (e) {
        console.log(error);
        res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
});

module.exports = router;