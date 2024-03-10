const express = require('express');
const router = express.Router();

const Student = require("../../../../models/student");

// Route để lấy tất cả danh sách học sinh
router.get('/all-students', async (req, res) => {
    try {
        const allStudent = await Student.find();

        res.status(200).json({
            status: "SUCCESS",
            total: allStudent.length,
            data: allStudent,
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách học sinh :", err);
        res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại sau" });
    }
});

// Route để lấy danh sách học sinh đang học
router.get('/active-students', async (req, res) => {
    try {
        const activeStudents = await Student.find({ status: 1 });

        res.status(200).json({
            status: "SUCCESS",
            total: activeStudents.length,
            data: activeStudents,
        });
    } catch (err) {
        console.error("Lỗi khi lấy danh sách học sinh đang học:", err);
        res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại sau" });
    }
});

// Route để lấy danh sách học sinh tự nghỉ học
router.get('/self-suspended-students', async (req, res) => {
    try {
        const selfSuspendedStudents = await Student.find({ status: 2 });

        res.status(200).json({
            status: "SUCCESS",
            total: selfSuspendedStudents.length,
            data: selfSuspendedStudents,
        });
    } catch (err) {
        console.error("Lỗi khi lấy danh sách học sinh tự nghỉ học:", err);
        res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại sau" });
    }
});

// Route để lấy danh sách học sinh đang bị đình chỉ học
router.get('/suspended-students', async (req, res) => {
    try {
        const suspendedStudents = await Student.find({ status: 3 });

        res.status(200).json({
            status: "SUCCESS",
            total: suspendedStudents.length,
            data: suspendedStudents,
        });
    } catch (err) {
        console.error("Lỗi khi lấy danh sách học sinh đang bị đình chỉ học:", err);
        res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại sau" });
    }
});


// Route để lấy danh sách học sinh bị đuổi học
router.get('/expelled-students', async (req, res) => {
    try {
        const expelledStudents = await Student.find({ status: 4 });

        res.status(200).json({
            status: "SUCCESS",
            toatk: expelledStudents.length,
            data: expelledStudents,
        });
    } catch (err) {
        console.error("Lỗi khi lấy danh sách học sinh bị đuổi học:", err);
        res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại sau" });
    }
});

module.exports = router;
