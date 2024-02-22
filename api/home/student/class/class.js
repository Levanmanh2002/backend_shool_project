const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Class = require('../../../../models/class');
const Student = require('../../../../models/student');
const Teacher = require('../../../../models/teacher');

router.post('/create-class', async (req, res) => {
    try {
        const className = req.body.className;
        const classId = uuidv4();

        // Kiểm tra xem lớp học đã tồn tại chưa
        const existingClass = await Class.findOne({ className });

        if (existingClass) {
            return res.status(400).json({
                status: "check_class",
                error: 'Lớp học đã tồn tại'
            });
        }

        // Tạo một lớp học mới
        const newClass = new Class({ className, classId });
        await newClass.save();

        res.status(201).json({
            status: "SUCCESS",
            message: 'Lớp học mới đã được tạo',
            class: newClass,
            id: newClass.classId,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

router.put('/edit-class/:classId', async (req, res) => {
    const classId = req.params.classId;
    const { updatedClassName, updatedTeacherId, updatedJob, updatedStudentIds } = req.body;

    try {
        const existingClass = await Class.findById(classId);

        if (!existingClass) {
            return res.status(404).json({ error: 'Lớp học không tồn tại' });
        }

        // Kiểm tra xem giáo viên tồn tại (nếu có sự thay đổi)
        if (updatedTeacherId) {
            const existingTeacher = await Teacher.findById(updatedTeacherId);
            if (!existingTeacher) {
                return res.status(404).json({ error: 'Giáo viên không tồn tại' });
            }
            existingClass.teacher = updatedTeacherId;
        }

        // Cập nhật tên lớp (nếu có sự thay đổi)
        if (updatedClassName) {
            existingClass.className = updatedClassName;
        }

        // Cập nhật ngành nghề (nếu có sự thay đổi)
        if (updatedJob) {
            existingClass.job = updatedJob;
        }

        // Kiểm tra xem danh sách học sinh tồn tại và cập nhật nếu có sự thay đổi
        if (updatedStudentIds) {
            const existingStudents = await Student.find({ _id: { $in: updatedStudentIds } });

            // Lọc ra những studentId mà chưa có trong danh sách học sinh của lớp học
            const newStudentIds = updatedStudentIds.filter(studentId => !existingClass.students.includes(studentId));

            // Nếu có studentId mới, thêm vào danh sách học sinh của lớp học
            if (newStudentIds.length > 0) {
                existingClass.students = [...existingClass.students, ...newStudentIds];
            }
        }

        await existingClass.save();

        const teachers = await Teacher.find({ _id: { $in: existingClass.teacher } });
        const students = await Student.find({ _id: { $in: existingClass.students } });

        const teacherInfo = teachers.map(teacher => ({
            id: teacher._id,
            teacherId: teacher.teacherId,
            fullName: teacher.fullName,
        }));

        const studentInfo = students.map(student => ({
            id: student._id,
            studentId: student.studentId,
            fullName: student.fullName,
        }));

        res.status(201).json({
            message: 'Thông tin lớp học đã được chỉnh sửa',
            class: {
                classId: existingClass.classId,
                className: existingClass.className,
                students: studentInfo,
                teacher: teacherInfo,
                job: existingClass.job,
            },
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

router.delete('/remove-student-from-class/:classId/:studentId', async (req, res) => {
    const classId = req.params.classId;
    const studentId = req.params.studentId;

    try {
        const existingClass = await Class.findById(classId);

        if (!existingClass) {
            return res.status(404).json({ error: 'Lớp học không tồn tại' });
        }

        // Kiểm tra xem học sinh có tồn tại trong lớp học không
        const studentIndex = existingClass.students.indexOf(studentId);
        if (studentIndex === -1) {
            return res.status(404).json({ error: 'Học sinh không tồn tại trong lớp học' });
        }

        // Xóa học sinh khỏi danh sách của lớp học
        existingClass.students.splice(studentIndex, 1);
        await existingClass.save();

        res.status(201).json({
            message: 'Học sinh đã được xóa khỏi lớp học',
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

router.delete('/delete-class/:classId', async (req, res) => {
    const classId = req.params.classId;

    try {
        const existingClass = await Class.findById(classId);

        if (!existingClass) {
            return res.status(404).json({ error: 'Lớp học không tồn tại' });
        }

        const studentsInClass = existingClass.students;

        await Class.deleteOne({ _id: classId });

        await Student.updateMany(
            { _id: { $in: studentsInClass } },
            { $unset: { class: "" } }
        );


        res.status(201).json({
            message: 'Lớp học đã được xóa và thông tin học sinh đã được cập nhật',
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

router.get('/classes', async (req, res) => {
    try {
        const classes = await Class.find();

        res.status(201).json({
            status: "SUCCESS",
            totalClasses: classes.length,
            classes: classes.map(cls => ({ className: cls.className, id: cls.id, classId: cls.classId })),
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

module.exports = router;
