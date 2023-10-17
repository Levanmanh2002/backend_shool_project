const express = require('express');
const router = express.Router();
const Major = require('../../../../models/major');

router.get('/majors', async (req, res) => {
    try {
        const majors = await Major.find();

        return res.status(201).json({
            status: "SUCCESS",
            message: "Danh sách các ngành học",
            data: majors
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

module.exports = router;
