const express = require('express');
const router = express.Router();

const Major = require('../../../../models/major');

router.post('/add-major', async (req, res) => {
    try {
        const { name, description } = req.body;

        const existingNameMajor = await Major.findOne({ name });

        if (existingNameMajor) {
            return res.status(400).json({
                status: "FAILED",
                error: 'Ngành học đã tồn tại.'
            });
        }

        const newMajor = new Major({
            name,
            description
        });

        await newMajor.save();

        res.status(201).json({
            status: "SUCCESS",
            message: "Ngành học đã được thêm",
            data: newMajor
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

module.exports = router;
