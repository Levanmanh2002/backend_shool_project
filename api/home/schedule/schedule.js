const express = require('express');
const router = express.Router();

const Semester = require('../../../models/semester');
const _ = require('lodash');

// Thêm học kỳ mới
router.post("/semester", async (req, res) => {
    try {
        const { semesterName } = req.body;
        const semester = new Semester({ semesterName });
        await semester.save();
        res.status(201).json({
            status: "SUCCESS",
            data: semester
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi khi tạo học kỳ mới" });
    }
});

// Thêm môn học vào học kỳ
router.post("/semester/:semesterId/subject", async (req, res) => {
    try {
        const { semesterId } = req.params;
        const { subjectName, teacher, classroom, weeklySessions } = req.body;

        const subject = {
            subjectName,
            teacher,
            classroom,
            weeklySessions
        };

        const updatedSemester = await Semester.findByIdAndUpdate(
            semesterId,
            {
                $push: { subjects: subject }
            },
            { new: true }
        );

        res.status(201).json({
            status: "SUCCESS",
            data: updatedSemester,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi khi thêm môn học vào học kỳ" });
    }
});

// Get dữ liệu của tất cả học kỳ ra
router.get("/semesters", async (req, res) => {
    try {
        const semesters = await Semester.find();
        res.status(201).json({
            status: "SUCCESS",
            data: semesters
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi khi lấy danh sách các kỳ học" });
    }
});

// Xóa đi 1 học kỳ theo semesterId
router.delete('/semester/:semesterId', async (req, res) => {
    try {
        const { semesterId } = req.params;

        const semester = await Semester.findById(semesterId);
        if (!semester) {
            return res.status(404).json({ error: "Học kỳ không tồn tại" });
        }

        await Semester.findByIdAndRemove(semesterId);

        res.status(201).json({
            status: "SUCCESS",
            message: "Xóa học kỳ thành công"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi khi xóa học kỳ" });
    }
});

// Chỉnh sửa tên học kỳ
router.put('/semester/:semesterId', async (req, res) => {
    try {
        const { semesterId } = req.params;
        const { semesterName } = req.body;

        const semester = await Semester.findById(semesterId);
        if (!semester) {
            return res.status(404).json({ error: "Học kỳ không tồn tại" });
        }

        semester.semesterName = semesterName;
        await semester.save();

        res.status(201).json({
            status: "SUCCESS",
            data: semester,
            message: "Chỉnh sửa tên học kỳ thành công"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi khi chỉnh sửa tên học kỳ" });
    }
});

// Xóa đi 1 môn học theo subjectId
router.delete('/semester/:semesterId/subject/:subjectId', async (req, res) => {
    try {
        const { semesterId, subjectId } = req.params;

        const updatedSemester = await Semester.findByIdAndUpdate(
            semesterId,
            { $pull: { subjects: { _id: subjectId } } },
            { new: true }
        );

        if (!updatedSemester) {
            return res.status(404).json({ error: "Học kỳ hoặc môn học không tồn tại" });
        }

        res.status(201).json({
            status: "SUCCESS",
            message: "Xóa môn học thành công",
            data: updatedSemester
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi khi xóa môn học" });
    }
});

// Chỉnh sửa 1 môn học theo subjectId
router.put('/semester/:semesterId/subject/:subjectId', async (req, res) => {
    try {
        const { semesterId, subjectId } = req.params;
        const updatedSubjectData = req.body;

        const semester = await Semester.findById(semesterId);
        if (!semester) {
            return res.status(404).json({ error: "Học kỳ không tồn tại" });
        }

        const subjectIndex = semester.subjects.findIndex((subject) => subject._id == subjectId);
        if (subjectIndex === -1) {
            return res.status(404).json({ error: "Môn học không tồn tại" });
        }

        semester.subjects[subjectIndex] = updatedSubjectData;

        const updatedSemester = await semester.save();

        res.status(201).json({
            status: "SUCCESS",
            message: "Cập nhật thông tin môn học thành công",
            data: updatedSemester,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi khi cập nhật môn học" });
    }
});


// Hàm xáo trộn mảng
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Lấy danh sách tất cả môn học trong học kỳ
router.get('/semester/:semesterId/subjects/schedule', async (req, res) => {
    try {
        const { semesterId } = req.params;

        const semester = await Semester.findById(semesterId);
        if (!semester) {
            return res.status(404).json({ error: "Học kỳ không tồn tại" });
        }

        const allSubjects = semester.subjects;
        const daysOfWeek = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

        if (allSubjects.length === 0) {
            return res.status(201).json({
                status: "SUCCESS",
                data: [],
                message: "Không có môn học nào trong học kỳ",
            });
        }

        const schedule = [];
        let currentDayIndex = 1;

        for (const subject of allSubjects) {
            for (let i = 0; i < subject.weeklySessions; i++) {
                const dayOfWeek = daysOfWeek[currentDayIndex - 1];
                const session = i < subject.weeklySessions / 2 ? "Morning" : "Afternoon";
                schedule.push({
                    dayOfWeek,
                    session,
                    subject,
                });

                currentDayIndex = currentDayIndex % 12 + 1;
            }
        }

        res.status(201).json({
            status: "SUCCESS",
            data: schedule,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi khi lấy thời khóa biểu" });
    }
});






module.exports = router;