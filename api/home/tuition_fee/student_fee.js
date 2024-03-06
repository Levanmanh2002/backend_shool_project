const express = require('express');
const router = express.Router();

const TuitionFee = require("../../../models/tuition_fee");
const Student = require("../../../models/student");
const TransactionHistory = require("../../../models/transaction_history");

// router.post('/create_student_fee', async (req, res) => {
//     try {
//         const { studentId, amountPaid, tuitionFeeId } = req.body;

//         // Tìm học sinh trong cơ sở dữ liệu
//         const student = await Student.findById(studentId);
//         if (!student) {
//             return res.status(404).json({ error: 'Không tìm thấy học sinh.' });
//         }

//         // Tìm học phí cần thanh toán
//         const tuitionFeesId = student.feesToPay.find(fee => fee._id.toString() === tuitionFeeId);
//         if (!tuitionFeesId) {
//             return res.status(404).json({ error: 'Không tìm thấy học phí.' });
//         }

//         // Tìm học phí cần thanh toán
//         const tuitionFee = await TuitionFee.findById(tuitionFeeId);
//         if (!tuitionFee) {
//             return res.status(404).json({ error: 'Không tìm thấy học phí.' });
//         }

//         // Kiểm tra nếu số tiền đóng vượt quá số tiền cần phải đóng
//         if (amountPaid > tuitionFee.soTienDong && amountPaid > tuitionFee.soTienNo) {
//             return res.status(400).json({ error: 'Số tiền đóng vượt quá số tiền cần phải đóng.' });
//         }

//         // Kiểm tra nếu soTienNo của học phí là 0
//         if (tuitionFee.soTienNo === 0) {
//             return res.status(400).json({ error: 'Số tiền nợ của học phí đã là 0.' });
//         }

//         // Cập nhật số tiền nợ
//         const outstandingAmount = tuitionFee.soTienNo - amountPaid;

//         // Tạo lịch sử giao dịch
//         const status = (tuitionFee.soTienDong === 0 && outstandingAmount === 0) ? true : false;
//         const transaction = new TransactionHistory({
//             studentId: studentId,
//             tuitionFeeId: tuitionFeeId,
//             maTraCuu: tuitionFee.maTraCuu,
//             tenHocPhi: tuitionFee.tenHocPhi,
//             soTienDong: tuitionFee.soTienDong,
//             amountPaid: amountPaid,
//             outstandingAmount: outstandingAmount,
//             transactionDate: new Date(),
//             paymentMethod: req.body.paymentMethod, // Phương thức thanh toán (ví dụ: tiền mặt, chuyển khoản, v.v.)
//             status: status,
//             details: `Đóng học phí ${tuitionFee.tenHocPhi}`,
//         });
//         await transaction.save();

//         tuitionFee.soTienNo = outstandingAmount;
//         tuitionFee.soTienThanhToan = amountPaid;
//         tuitionFee.status = status;

//         await tuitionFee.save();

//         // Cập nhật thông tin học sinh trong cơ sở dữ liệu
//         await student.save();

//         res.status(201).json({
//             status: 'SUCCESS',
//             message: 'Nộp học phí thành công.',
//             data: transaction
//         });

//     } catch (error) {
//         console.error('Đã xảy ra lỗi:', error);
//         res.status(500).json({ error: 'Đã xảy ra lỗi khi nộp học phí.' });
//     }
// });

// router.post('/fees/pay/:feeId', (req, res) => {
//     const feeId = req.params.feeId;
//     const paymentAmount = req.body.paymentAmount; // Số tiền đã đóng
//     const paymentMethod = req.body.paymentMethod; // Phương thức thanh toán (chuyển khoản, tiền mặt)

//     // Tìm kiếm học phí dựa trên ID
//     const fee = feesToPay.find(fee => fee._id === feeId);

//     if (!fee) {
//         return res.status(404).json({ error: "Không tìm thấy học phí" });
//     }

//     // Cập nhật dữ liệu học phí
//     fee.soTienDong += paymentAmount;
//     fee.soTienNo -= paymentAmount;

//     // Thêm lịch sử đóng học phí
//     fee.paymentHistory.push({
//         amount: paymentAmount,
//         method: paymentMethod,
//         date: new Date()
//     });

//     // Kiểm tra xem học phí đã được đóng đủ hay chưa
//     if (fee.soTienNo <= 0) {
//         fee.status = true;
//     }

//     res.json({ message: "Đã cập nhật học phí" });
// });

router.get('/fees_history/:studentId', async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const paymentHistory = await TransactionHistory.find({ studentId: studentId });

        if (!paymentHistory) {
            return res.status(404).json({ error: 'Không tìm thấy lịch sử đóng học phí cho học sinh này.' });
        }

        res.status(201).json({
            status: 'SUCCESS',
            data: paymentHistory,
        });
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy lịch sử đóng học phí:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy lịch sử đóng học phí.' });
    }
});


module.exports = router;
