const express = require('express');
const router = express.Router();
const Teacher = require('../../../../models/teacher');
const Class = require("../../../../models/class")
const Student = require("../../../../models/student")

router.put('/update-teacher/:classId', async (req, res) => {
    try {
        const classId = req.params.classId;
        const { teacherId } = req.body;

        const classExists = await Class.findById(classId);
        if (!classExists) {
            return res.status(404).json({ error: 'Lớp học không tồn tại.' });
        }

        if (classExists.teacher) {
            return res.status(400).json({ error: 'Lớp học đã có giáo viên.' });
        }

        const teacherExists = await Teacher.findById(teacherId);
        if (!teacherExists) {
            return res.status(404).json({ error: 'Giáo viên không tồn tại.' });
        }

        if (teacherExists.classCount >= 3) {
            return res.status(400).json({ error: 'Giáo viên đã dạy đủ 3 lớp.' });
        }

        await Class.findByIdAndUpdate(classId, { teacher: teacherId });

        res.status(201).json({
            status: "SUCCESS",
            message: 'Cập nhật giáo viên cho lớp học thành công.'
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật giáo viên cho lớp học:', error);
        res.status(500).json({ error: 'Lỗi khi cập nhật giáo viên cho lớp học.' });
    }
});


router.get('/teachers', async (req, res) => {
    try {
        const classesWithTeachers = await Class.find({ teacher: { $exists: true } }).populate('teacher');

        const teachersWithStudentCount = await Promise.all(classesWithTeachers.map(async (classItem) => {
            const studentCount = await Student.countDocuments({ _id: { $in: classItem.students } });

            return {
                className: classItem.className,
                studentCount: studentCount,
                teacher: classItem.teacher.toObject(),
            };
        }));

        res.json({ status: 'SUCCESS', teachers: teachersWithStudentCount });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin giáo viên:', error);
        res.status(500).json({ error: 'Lỗi khi lấy thông tin giáo viên.' });
    }
});

router.get('/unassigned-classes', async (req, res) => {
    try {
        const unassignedClasses = await Class.find({ teacher: null });

        res.json({ status: 'SUCCESS', unassignedClasses });
    } catch (error) {
        console.error('Lỗi khi kiểm tra lớp học chưa có giáo viên:', error);
        res.status(500).json({ error: 'Lỗi khi kiểm tra lớp học chưa có giáo viên.' });
    }
});


module.exports = router;
