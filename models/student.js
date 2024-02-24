const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    studentId: String, // id học sinh
    gmail: String,  // gmail học sinh
    phone: String,  // số điện thoại học sinh
    fullName: String,   // full name học sinh
    birthDate: Date,    // năm sinh học sinh
    cccd: String,   // cccd học sinh
    birthPlace: String, // nơi sinh học sinh
    customYear: String, // năm vào học cũng là mssv
    mssv: String,   // mssv học sinh
    password: String,   // mật khẩu tài khoản học sinh
    gender: String, // giới tính học sinh
    hometown: String,   // quê quán học sinh
    permanentAddress: String,   // địa chỉ thường trú học sinh
    occupation: String, // nghề nghiệp học sinh
    class: String,
    // lớp học học sinh
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Class'
        }
    ],
    contactPhone: String,   // số điện thoại liên lạc
    contactAddress: String, // địa chỉ liên lạc
    educationLevel: String, // trình độ học vấn
    // giấy chứng nhận tốt nghiệp
    graduationCertificate: [
        {
            type: String,
        }
    ],
    academicPerformance: String,    // học lực học sinh
    conduct: String,    // hạnh kiểm học sinh
    classRanking10: String, // học lực lớp 10
    classRanking11: String, // học lực lớp 11
    classRanking12: String, // học lực lớp 12
    graduationYear: String, // năm tốt nghiệp
    ethnicity: String,  // dân tộc học sinh
    religion: String,   // tôn giáo học sinh
    beneficiary: String,    // đối tượng học sinh (tp)
    area: String,   // khu vực
    idCardIssuedDate: Date, // ngày cấp cmnd
    idCardIssuedPlace: String,  // nơi cấp cmnd
    fatherFullName: String, // họ tên cha học sinh
    motherFullName: String, // họ tên mẹ học sinh
    notes: String,  // ghi chú
    verificationCode: String,
    resetTokenExpiration: Date,
    avatarUrl: String,
    address: String,
    city: String,
    district: String,
    ward: String,
    // Danh sách các khoản phải đóng của học sinh
    feesToPay: [
        {
            type: Schema.Types.ObjectId,
            ref: 'TuitionFee',
        }
    ],
    isStudying: {
        type: Boolean,   // học sinh đang học 
        default: true,
    },
    selfSuspension: {
        isSelfSuspended: Boolean, // học sinh tự nghỉ học
        suspensionEndDate: Date, // ngày kết thúc tự nghỉ học
        suspensionReason: String, // lý do nghỉ học
    },
    suspension: {
        isSuspended: Boolean, // học sinh đang bị đình chỉ học
        suspensionEndDate: Date, // ngày kết thúc đình chỉ học
        suspensionReason: String, // lý do đình chỉ học
    },
    expulsion: {
        isExpelled: Boolean, // học sinh bị đuổi
        expulsionDate: Date, // ngày bị đuổi
        expulsionReason: String, // lý do bị đuổi
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

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;