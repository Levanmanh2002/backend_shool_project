const express = require('express');
const router = express.Router();
const Teacher = require('../../../models/teacher');

router.put('/update/teacher/:teacherId', async (req, res) => {
    try {
        const { teacherId } = req.params;
        const updatedTeacherData = req.body;

        const existingTeacher = await Teacher.findOne({ teacherId });

        if (!existingTeacher) {
            return res.status(404).json({ status: "check_id", error: 'Không tìm thấy thông tin giáo viên.' });
        }

        const existingEmail = await Teacher.findOne({ email: updatedTeacherData.email });

        if (existingEmail) {
            return res.status(400).json({ status: "check_email", error: 'Email đã tồn tại.' });
        }

        const existingPhoneNumber = await Teacher.findOne({ phoneNumber: updatedTeacherData.phoneNumber });

        if (existingPhoneNumber) {
            return res.status(400).json({ status: "check_phone", error: 'Số điện thoại đã tồn tại.' });
        }

        const existingCCCD = await Teacher.findOne({ cccd: updatedTeacherData.cccd });

        if (existingCCCD) {
            return res.status(400).json({ status: "check_cccd", error: 'CCCD đã tồn tại.' });
        }

        if (!updatedTeacherData.gender || updatedTeacherData.gender.trim() === '') {
            updatedTeacherData.gender = 'Khác';
        }

        existingTeacher.fullName = updatedTeacherData.fullName;
        existingTeacher.email = updatedTeacherData.email;
        existingTeacher.phoneNumber = updatedTeacherData.phoneNumber;
        existingTeacher.gender = updatedTeacherData.gender;
        existingTeacher.cccd = updatedTeacherData.cccd;
        existingTeacher.birthDate = updatedTeacherData.birthDate;
        existingTeacher.birthPlace = updatedTeacherData.birthPlace;
        existingTeacher.ethnicity = updatedTeacherData.ethnicity;
        existingTeacher.nickname = updatedTeacherData.nickname;
        existingTeacher.teachingLevel = updatedTeacherData.teachingLevel;
        existingTeacher.position = updatedTeacherData.position;
        existingTeacher.experience = updatedTeacherData.experience;
        existingTeacher.department = updatedTeacherData.department;
        existingTeacher.role = updatedTeacherData.role;
        existingTeacher.joinDate = updatedTeacherData.joinDate;
        existingTeacher.civilServant = updatedTeacherData.civilServant;
        existingTeacher.contractType = updatedTeacherData.contractType;
        existingTeacher.primarySubject = updatedTeacherData.primarySubject;
        existingTeacher.secondarySubject = updatedTeacherData.secondarySubject;
        existingTeacher.isWorking = updatedTeacherData.isWorking;
        existingTeacher.academicDegree = updatedTeacherData.academicDegree;
        existingTeacher.standardDegree = updatedTeacherData.standardDegree;
        existingTeacher.politicalTheory = updatedTeacherData.politicalTheory;

        await existingTeacher.save();

        res.status(201).json({
            status: "SUCCESS",
            message: 'Thông tin giáo viên đã được cập nhật thành công.',
            data: existingTeacher
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
});

module.exports = router;
