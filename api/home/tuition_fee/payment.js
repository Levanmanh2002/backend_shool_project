const express = require('express');
const router = express.Router();

const TuitionFee = require("../../../models/tuition_fee");
const Student = require("../../../models/student");
const PaymentHistory = require("../../../models/payment_history");

router.put('/pay_tuition_fee/:studentId/:tuitionFeeId', async (req, res) => {
    const { studentId, tuitionFeeId } = req.params;
    const { soTienDong, paymentMethod } = req.body;

    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Không tìm thấy học sinh.' });
        }

        const tuitionFee = await TuitionFee.findById(tuitionFeeId);
        if (!tuitionFee) {
            return res.status(404).json({ error: 'Không tìm thấy học phí.' });
        }

        if (tuitionFee.soTienNo === 0) {
            return res.status(400).json({ error: 'Học phí này đã được thanh toán.' });
        }

        // Cập nhật trạng thái học phí và danh sách học phí cần thanh toán của học sinh
        tuitionFee.soTienNo = Math.max(0, tuitionFee.soTienNo - soTienDong); // Trừ số tiền đã đóng khỏi số tiền nợ
        if (tuitionFee.soTienNo === 0) {
            tuitionFee.status = true; // Nếu số tiền nợ bằng 0, đánh dấu học phí đã thanh toán
        }
        await tuitionFee.save();

        const index = student.feesToPay.indexOf(tuitionFeeId);
        if (index !== -1) {
            if (tuitionFee.status) {
                student.feesToPay.splice(index, 1);
                await student.save();
            }
        } else {
            return res.status(400).json({ error: 'Học phí không tồn tại trong danh sách học phí của học sinh.' });
        }

        const paymentHistory = new PaymentHistory({
            studentId: studentId,
            tuitionFeeId: tuitionFeeId,
            amountPaid: soTienDong,
            paymentMethod: paymentMethod,
        });
        await paymentHistory.save();

        res.status(200).json({
            status: 'SUCCESS',
            message: 'Đã đóng học phí cho học sinh thành công.',
            data: tuitionFee,
            paymentHistory: paymentHistory,
        });
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi đóng học phí cho học sinh.' });
    }
});

router.get('/payment_history/:studentId', async (req, res) => {
    const studentId = req.params.studentId;

    try {
        // Tìm tất cả lịch sử thanh toán của học sinh dựa trên studentId
        const paymentHistory = await PaymentHistory.find({ studentId: studentId });

        if (!paymentHistory || paymentHistory.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy lịch sử thanh toán cho học sinh này.' });
        }

        res.status(200).json({
            status: 'SUCCESS',
            data: paymentHistory,
        });
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy lịch sử thanh toán.' });
    }
});


module.exports = router;
