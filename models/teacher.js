const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
    teacherId: String,
    fullName: String,
    teacherCode: String,
    email: String,
    password: String,
    phoneNumber: String,
    gender: String,
    cccd: String,
    birthDate: Date,
    birthPlace: String,
    ethnicity: String,
    nickname: String,
    teachingLevel: String,
    position: String,
    experience: String,
    department: String,
    role: String,
    joinDate: Date,
    civilServant: Boolean,
    contractType: String,
    primarySubject: String,
    secondarySubject: String,
    isWorking: Boolean,
    academicDegree: String,
    standardDegree: String,
    politicalTheory: String,
    verificationCode: String,
    resetTokenExpiration: Date,
    avatarUrl: String,
    isWorking: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;