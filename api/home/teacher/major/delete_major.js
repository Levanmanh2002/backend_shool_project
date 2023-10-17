const express = require('express');
const router = express.Router();

const Major = require('../../../../models/major');

router.delete('/delete-major/:majorId', async (req, res) => {
    try {
        const majorId = req.params.majorId;

        const existingMajor = await Major.findById(majorId);
        if (!existingMajor) {
            return res.status(404).json({
                status: "FAILED",
                error: 'Ngành học không tồn tại.'
            });
        }

        // Xóa ngành học
        await Major.findByIdAndDelete(majorId);

        res.status(201).json({
            status: "SUCCESS",
            message: "Ngành học đã được xóa"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

module.exports = router;
