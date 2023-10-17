const express = require('express');
const router = express.Router();

const Major = require('../../../../models/major');

router.put('/edit-major/:majorId', async (req, res) => {
    try {
        const majorId = req.params.majorId;
        const { name, description } = req.body;

        const existingMajor = await Major.findById(majorId);
        if (!existingMajor) {
            return res.status(404).json({
                status: "FAILED",
                error: 'Ngành học không tồn tại.'
            });
        }

        const existingNameMajor = await Major.findOne({ name });

        if (existingNameMajor) {
            return res.status(400).json({
                status: "FAILED",
                error: 'Ngành học đã tồn tại.'
            });
        }

        existingMajor.name = name;
        existingMajor.description = description;

        await existingMajor.save();

        res.status(201).json({
            status: "SUCCESS",
            message: "Ngành học đã được chỉnh sửa",
            data: existingMajor
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

module.exports = router;
