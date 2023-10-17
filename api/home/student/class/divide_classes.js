const express = require('express');
const router = express.Router();
const Student = require('../../../../models/student');
const Class = require('../../../../models/class');

router.post('/divide-classes', async (req, res) => {
    try {
        const studentList = await Student.find({ isStudying: true });
        const maxStudentsPerClass = 30;
        let nextClassNumber = 1;
        let studentsInCurrentClass = 0;
        const customClassName = req.body.className;
        let allStudentsHaveClass = true;

        for (const student of studentList) {
            if (!student.class) {
                student.class = `${customClassName}${nextClassNumber}`;
                allStudentsHaveClass = false;
            }
            studentsInCurrentClass++;

            if (studentsInCurrentClass === maxStudentsPerClass) {
                nextClassNumber++;
                studentsInCurrentClass = 0;
            }

            let classObject = await Class.findOne({ className: student.class });
            if (!classObject) {
                classObject = new Class({ className: student.class });
            }

            // Thêm học sinh vào danh sách học sinh của lớp
            classObject.students.push(student);

            await Promise.all([classObject.save(), student.save()]);
            // await student.save();
        }

        if (allStudentsHaveClass) {
            return res.status(400).json({
                error: 'Tất cả học sinh đã có lớp',
            });
        }

        const updatedStudentList = await Student.find({ isStudying: true });

        res.status(201).json({
            message: 'Chia lớp thành công',
            student: updatedStudentList
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

module.exports = router;
