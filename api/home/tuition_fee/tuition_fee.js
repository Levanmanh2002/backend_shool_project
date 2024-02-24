const express = require('express');
const router = express.Router();

const TuitionFee = require("../../../models/tuition_fee");
const Student = require("../../../models/student");


router.post('/create_tuition_fee', async (req, res) => {
    try {
        const existingTuitionFee = await TuitionFee.findOne({ maTraCuu: req.body.maTraCuu });
        if (existingTuitionFee) {
            return res.status(400).json({ error: 'Mã tra cứu đã tồn tại trong cơ sở dữ liệu.' });
        }

        // Tạo học phí mới
        const newTuitionFee = await TuitionFee.create(req.body);

        // Lấy ID của học phí mới
        const newTuitionFeeId = newTuitionFee._id;

        // Lấy danh sách tất cả học sinh
        const allStudents = await Student.find({});

        // Cập nhật mảng feesToPay của từng học sinh
        const promises = allStudents.map(async student => {
            student.feesToPay.push(newTuitionFeeId);
            await student.save();
        });

        // Chờ cho tất cả các promise hoàn thành
        await Promise.all(promises);

        res.status(201).json({
            status: 'SUCCESS',
            message: 'Đã thêm học phí mới và cập nhật cho tất cả học sinh thành công.',
            data: newTuitionFee,
        });
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm học phí mới và cập nhật cho học sinh.' });
    }
});

module.exports = router;
