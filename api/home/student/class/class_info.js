const express = require('express');
const router = express.Router();
const Class = require('../../../../models/class');
const Student = require('../../../../models/student');
const Teacher = require('../../../../models/teacher');

router.get('/class-info', async (req, res) => {
    try {
        const classes = await Class.find();

        const classInfo = [];

        for (const cls of classes) {
            const students = await Student.find({ _id: { $in: cls.students } });
            const teacher = await Teacher.find({ _id: { $in: cls.teacher } });
            const numberOfStudents = students.length;
            classInfo.push({
                className: cls.className,
                id: cls.id,
                idClass: cls.classId,
                numberOfStudents: numberOfStudents,
                teacher: teacher,
                students: students,
            });
        }

        res.status(201).json({
            message: 'Thông tin lớp học',
            classInfo: classInfo,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

module.exports = router;
