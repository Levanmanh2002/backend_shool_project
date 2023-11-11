const express = require('express');
const router = express.Router();

const Student = require('../../../models/student');

// Endpoint để lấy danh sách học sinh đang học
router.get('/students/number_active', async (req, res) => {
    try {
        const students = await Student.find({ isStudying: true });
        res.status(201).json({
            status: 'SUCCESS',
            message: 'Danh sách học sinh đang học',
            data: students.length,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

// Endpoint để lấy danh sách học sinh đã nghỉ học
router.get('/students/number_inactive', async (req, res) => {
    try {
        const students = await Student.find({ 'selfSuspension.isSelfSuspended': false });
        res.status(201).json({
            status: 'SUCCESS',
            message: 'Danh sách học sinh đã nghỉ học',
            data: students.length,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

// Endpoint để lấy danh sách học sinh đang bị đình chỉ
router.get('/students/number_suspended', async (req, res) => {
    try {
        const students = await Student.find({ 'suspension.isSuspended': true });
        res.status(201).json({
            status: 'SUCCESS',
            message: 'Danh sách học sinh đang bị đình chỉ',
            data: students.length,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

// Endpoint để lấy danh sách học sinh bị đuổi học
router.get('/students/number_expelled', async (req, res) => {
    try {
        const students = await Student.find({ 'expulsion.isExpelled': true });
        res.status(201).json({
            status: 'SUCCESS',
            message: 'Danh sách học sinh bị đuổi học',
            data: students.length,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

module.exports = router;