const express = require('express');
const router = express.Router();

const Student = require("../../../../models/student");


// Route để học sinh tự nghỉ học
router.post('/self-suspend/:studentId', async (req, res) => {
    const { studentId } = req.params;
    const { reason, startDate, endDate } = req.body;

    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Không tìm thấy học sinh" });
        }

        // Cập nhật trạng thái là học sinh tự nghỉ học (status = 2)
        student.status = 2;

        // Cập nhật thông tin bổ sung về trạng thái tự nghỉ học
        student.statusInfo = {
            condition: "Tự nghỉ học",
            reason: reason,
            startDate: new Date() // Ngày tự nghỉ
        };

        // Cập nhật thời gian updatedAt
        student.updatedAt = new Date();

        // Lưu thay đổi
        await student.save();
        res.status(200).json({ message: "Cập nhật trạng thái học sinh đã tự nghỉ học thành công" });
    } catch (err) {
        console.error("Lỗi khi tự nghỉ học sinh:", err);
        res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại sau" });
    }
});

// Route để đánh dấu học sinh bị đình chỉ
router.post('/suspend/:studentId', async (req, res) => {
    const { studentId } = req.params;
    const { reason, startDate, endDate } = req.body;

    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Không tìm thấy học sinh" });
        }

        // Cập nhật trạng thái là học sinh bị đình chỉ học (status = 3)
        student.status = 3;

        // Cập nhật thông tin bổ sung về trạng thái bị đình chỉ học
        student.statusInfo = {
            condition: "Bị đình chỉ học",
            reason: reason,
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        };

        // Cập nhật thời gian updatedAt
        student.updatedAt = new Date();

        // Lưu thay đổi
        await student.save();

        res.status(200).json({ message: "Học sinh đã bị đình chỉ học thành công" });
    } catch (err) {
        console.error("Lỗi khi đình chỉ học sinh:", err);
        res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại sau" });
    }
});

// Route để đánh dấu học sinh bị đuổi học
router.post('/expulsion/:studentId', async (req, res) => {
    const { studentId } = req.params;
    const { reason } = req.body;

    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Không tìm thấy học sinh" });
        }

        // Cập nhật trạng thái là học sinh bị đuổi học (status = 4)
        student.status = 4;

        // Cập nhật thông tin bổ sung về trạng thái bị đuổi học
        student.statusInfo = {
            condition: "Bị đuổi học",
            reason: reason,
            startDate: new Date() // Ngày hiện tại là ngày bị đuổi
        };

        // Cập nhật thời gian updatedAt
        student.updatedAt = new Date();

        // Lưu thay đổi
        await student.save();

        res.status(200).json({ message: "Học sinh đã bị đuổi học thành công" });
    } catch (err) {
        console.error("Lỗi khi đuổi học học sinh:", err);
        res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại sau" });
    }
});

// Route để lấy danh sách học sinh đang học
router.get('/active-students', async (req, res) => {
    try {
        const activeStudents = await Student.find({ status: 1 });

        res.status(200).json(activeStudents);
    } catch (err) {
        console.error("Lỗi khi lấy danh sách học sinh đang học:", err);
        res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại sau" });
    }
});

// Route để lấy danh sách học sinh tự nghỉ học
router.get('/self-suspended-students', async (req, res) => {
    try {
        const selfSuspendedStudents = await Student.find({ status: 2 });

        res.status(200).json(selfSuspendedStudents);
    } catch (err) {
        console.error("Lỗi khi lấy danh sách học sinh tự nghỉ học:", err);
        res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại sau" });
    }
});

// Route để lấy danh sách học sinh đang bị đình chỉ học
router.get('/suspended-students', async (req, res) => {
    try {
        const suspendedStudents = await Student.find({ status: 3 });

        res.status(200).json(suspendedStudents);
    } catch (err) {
        console.error("Lỗi khi lấy danh sách học sinh đang bị đình chỉ học:", err);
        res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại sau" });
    }
});


// Route để lấy danh sách học sinh bị đuổi học
router.get('/expelled-students', async (req, res) => {
    try {
        const expelledStudents = await Student.find({ status: 4 });

        res.status(200).json(expelledStudents);
    } catch (err) {
        console.error("Lỗi khi lấy danh sách học sinh bị đuổi học:", err);
        res.status(500).json({ message: "Có lỗi xảy ra, vui lòng thử lại sau" });
    }
});


module.exports = router;
