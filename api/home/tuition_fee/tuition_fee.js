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

router.get('/tuition_fees', async (req, res) => {
    try {
        // Lấy tất cả dữ liệu học phí từ cơ sở dữ liệu
        const allTuitionFees = await TuitionFee.find({});

        // Trả về dữ liệu học phí
        res.status(201).json({
            status: 'SUCCESS',
            message: 'Đã lấy tất cả dữ liệu học phí thành công.',
            data: allTuitionFees,
        });
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy dữ liệu học phí.' });
    }
});

router.delete('/delete_tuition_fee/:tuitionFeeId', async (req, res) => {
    const tuitionFeeId = req.params.tuitionFeeId;

    try {
        // Xóa học phí
        const deletedTuitionFee = await TuitionFee.findByIdAndDelete(tuitionFeeId);

        if (!deletedTuitionFee) {
            return res.status(404).json({ error: 'Không tìm thấy học phí.' });
        }

        // Cập nhật lại mảng feesToPay của tất cả sinh viên
        const studentsToUpdate = await Student.find({ feesToPay: tuitionFeeId });

        const promises = studentsToUpdate.map(async student => {
            student.feesToPay.pull(tuitionFeeId); // Loại bỏ id của học phí đã xóa khỏi mảng
            await student.save();
        });

        await Promise.all(promises);

        res.status(201).json({
            status: 'SUCCESS',
            message: 'Đã xóa học phí và cập nhật dữ liệu sinh viên thành công.',
        });
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa học phí và cập nhật dữ liệu sinh viên.' });
    }
});

router.put('/update_tuition_fee/:tuitionFeeId', async (req, res) => {
    const tuitionFeeId = req.params.tuitionFeeId;
    const updatedTuitionFeeData = req.body;

    try {
        // Kiểm tra xem mã tra cứu mới có trùng với các học phí khác không
        const { maTraCuu } = updatedTuitionFeeData;
        const existingTuitionFee = await TuitionFee.findOne({ maTraCuu: maTraCuu, _id: { $ne: tuitionFeeId } });
        if (existingTuitionFee) {
            return res.status(400).json({ error: 'Mã tra cứu đã tồn tại trong cơ sở dữ liệu.' });
        }

        // Chỉnh sửa học phí
        const updatedTuitionFee = await TuitionFee.findByIdAndUpdate(tuitionFeeId, updatedTuitionFeeData, { new: true });

        if (!updatedTuitionFee) {
            return res.status(404).json({ error: 'Không tìm thấy học phí.' });
        }

        // Cập nhật lại mảng feesToPay của tất cả sinh viên
        const studentsToUpdate = await Student.find({ feesToPay: tuitionFeeId });

        const promises = studentsToUpdate.map(async student => {
            const index = student.feesToPay.indexOf(tuitionFeeId);
            if (index !== -1) {
                student.feesToPay[index] = updatedTuitionFee._id;
                await student.save();
            }
        });

        await Promise.all(promises);

        res.status(201).json({
            status: 'SUCCESS',
            message: 'Đã cập nhật học phí và cập nhật dữ liệu sinh viên thành công.',
            data: updatedTuitionFee,
        });
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật học phí và cập nhật dữ liệu sinh viên.' });
    }
});



module.exports = router;
