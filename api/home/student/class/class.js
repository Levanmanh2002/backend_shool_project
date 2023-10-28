const express = require('express');
const router = express.Router();
const Class = require('../../../../models/class');

router.get('/classes', async (req, res) => {
    try {
        const classes = await Class.find();

        res.status(201).json({
            totalClasses: classes.length,
            classes: classes.map(cls => ({ className: cls.className, id: cls.id })),
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

module.exports = router;
