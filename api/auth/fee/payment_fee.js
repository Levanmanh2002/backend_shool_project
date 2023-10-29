const express = require('express');
const router = express.Router();

const StudentFees = require("../../../models/student_fee");
const Student = require("../../../models/student");
const StudentPayment = require("../../../models/student_payment");

router.get('/payment/student/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const payment = await StudentPayment.find({ student_id: id });

        res.status(201).json({
            status: "SUCCESS",
            message: "Lấy danh sách thành công",
            data: payment
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
})

router.get('/payment/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const payment = await StudentPayment.findById(id);

        res.status(201).json({
            status: "SUCCESS",
            message: "Lấy thanh toán thành công",
            data: payment
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
})

router.post('/add-new-payment', async (req, res) => {
    try {
        const student_id = req.body.student_id;
        const fee_id = req.body.fee_id;
        const paid = req.body.money_paid;
        const pay_type = req.body.pay_type;
        const payDate = req.body.pay_date ?? new Date().getTime();

        const student = await Student.findById(student_id);
        const fee = await StudentFees.findById(fee_id);

        const payment = new StudentPayment();
        payment.student_id = student_id;
        payment.student = student;
        payment.student_fee_id = fee_id;
        payment.student_fee = fee;
        payment.money_paid = paid;
        payment.pay_type = pay_type;
        payment.pay_date = new Date(payDate);
        await payment.save();

        res.status(201).json({
            status: "SUCCESS",
            message: "Tạo thanh toán thành công",
            data: payment
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

router.post('/update-payment/:id', async (req, res) => {
    try {
        const paid = req.body.money_paid;
        const pay_type = req.body.pay_type;
        const payDate = req.body.pay_date ?? new Date().getTime();

        const payment = await StudentPayment.findById(req.params.id);

        if (payment == null) {
            return res.status(205).send({
                status: "FAIL",
                message: "Không tồn tại thanh toán này",
            });
        }

        payment.money_paid = paid;
        payment.pay_type = pay_type;
        payment.pay_date = new Date(payDate);
        await payment.save();

        res.status(201).json({
            status: "SUCCESS",
            message: "Tạo thanh toán thành công",
            data: result
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {

        const payment = await StudentPayment.findByIdAndDelete(req.params.id);

        if (payment == null) {
            return res.status(205).send({
                status: "FAIL",
                message: "Không tồn tại thanh toán này",
            });
        }

        res.status(201).json({
            status: "SUCCESS",
            message: "Xoá thanh toán thành công",
            data: result
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

module.exports = router;