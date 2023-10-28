const express = require('express');
const Fee = require('../../../models/fee');
const router = express.Router();

router.get('/get', async (req, res) => {
    try {
        const result = await Fee.find();
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

router.get('/get-type', async (req, res) => {
    try {
        const type = req.body.type;
        const result = await Fee.find({type: type});
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

router.post('/create', async (req, res) => {
    try {
        const name = req.body.name;
        const description = req.body.description;
        const quantityCredits = req.body.quantity_credits;
        const money = req.body.money;
        const type = req.body.type;

        const fee = new Fee();
        fee.name = name;
        fee.description = description;
        fee.quantity_credits = quantityCredits;
        fee.money = money;
        fee.type = type;
        await fee.save();

        res.status(201).json({
            status: "SUCCESS",
            message: "Tạo thành công",
            data: fee
        });
    } catch (err) {
        console.error('Lỗi khi xóa tài khoản giáo viên:', err);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const name = req.body.name;
        const description = req.body.description;
        const quantityCredits = req.body.quantity_credits;
        const money = req.body.money;
        const type = req.body.type;

        const fee = Fee.findById(req.params.id);
        if(fee == null) {
            return res.status(205).json({
                status: "FAIL",
                message: "Không tồn tại phí",
                data: fee
            });
        }
        fee.name = name;
        fee.description = description;
        fee.quantity_credits = quantityCredits;
        fee.money = money;
        fee.type = type;
        await fee.save();

        res.status(201).json({
            status: "SUCCESS",
            message: "Cập nhật thành công",
            data: fee
        });
    } catch (err) {
        console.error('Lỗi khi xóa tài khoản giáo viên:', err);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const fee = await Fee.findByIdAndDelete(req.params.id);

        if(fee == null) {
            return res.status(205).json({
                status: "FAIL",
                message: "Không tồn tại phí",
                data: fee
            });
        }
        
        res.status(201).json({
            status: "SUCCESS",
            message: "Xóa thành công",
            data: fee
        });
    } catch (err) {
        console.error('Lỗi khi xóa tài khoản giáo viên:', err);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

module.exports = router;
