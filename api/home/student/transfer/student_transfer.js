const express = require('express');
const router = express.Router();

const Student = require('../../../../models/student');
const Class = require('../../../../models/class');

router.post('/move-student-to-new-class', async (req, res) => {
    try {
        const studentMSSV = req.body.studentMSSV; // ID của học sinh cần chuyển
        const newClassName = req.body.newClassName; // ID của lớp học mới

        // Kiểm tra xem học sinh có tồn tại không
        const student = await Student.findOne({ mssv: studentMSSV });
        if (!student) {
            return res.status(404).json({
                status: "check_student",
                error: 'Học sinh không tồn tại'
            });
        }

        const currentClassName = student.class;
        const currentClass = await Class.findOne({ className: currentClassName });
        if (!currentClass) {
            return res.status(404).json({
                status: "check_class_student",
                error: 'Lớp học hiện tại không tồn tại'
            });
        }

        // Kiểm tra xem lớp học mới có tồn tại không
        const newClass = await Class.findOne({ className: newClassName });
        if (!newClass) {
            return res.status(404).json({
                status: "check_class",
                error: 'Lớp học mới không tồn tại'
            });
        }

        // Loại bỏ học sinh khỏi lớp học hiện tại
        currentClass.students.pull(student._id);

        // Thêm học sinh vào lớp học mới
        newClass.students.push(student._id);

        // Cập nhật thông tin lớp học và học sinh trong cơ sở dữ liệu
        await Promise.all([currentClass.save(), newClass.save()]);

        // Cập nhật trường lớp học của học sinh
        student.class = newClassName;
        await student.save();

        res.status(201).json({
            status: "SUCCESS",
            message: 'Chuyển học sinh thành công',
            data: `Chuyển học sinh (MSSV: ${studentMSSV}) từ lớp ${currentClass.className} (ID: ${currentClass.id}) sang lớp ${newClass.className} thành công.`
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});


module.exports = router;