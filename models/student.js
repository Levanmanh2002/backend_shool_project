const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    studentId: String, // id học sinh
    mssv: String,   // mssv học sinh
    fullName: String,   // full name học sinh
    gender: String, // giới tính học sinh
    gmail: String,  // gmail học sinh
    phone: String,  // số điện thoại học sinh
    birthDate: Date,    // năm sinh học sinh
    cccd: String,   // cccd học sinh
    customYear: String, // năm vào học cũng là mssv
    password: String,   // mật khẩu tài khoản học sinh
    ethnicity: String,  // dân tộc học sinh
    beneficiary: String,    // đối tượng học sinh (tp)
    class: String,
    // lớp học học sinh
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Class'
        }
    ],
    // giấy chứng nhận tốt nghiệp
    graduationCertificate: [
        {
            type: String,
        }
    ],
    fatherFullName: String, // họ tên cha học sinh
    motherFullName: String, // họ tên mẹ học sinh
    contactPhone: String,   // số điện thoại liên lạc
    contactAddress: String, // địa chỉ liên lạc
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
    major: {
        type: Schema.Types.ObjectId,
        ref: 'Major'
    },
    isStudying: {
        type: Boolean,   // học sinh đang học 
        default: true,
    },
    status: {
        type: Number,
        enum: [1, 2, 3, 4], // Chỉ cho phép các giá trị 1, 2, 3, 4
        default: 1 // Mặc định là 1 (đang học)
    },
    statusInfo: {
        condition: String,  // Trình trạng học sinh
        reason: String,     // Lý do
        startDate: Date,    // Thời gian bắt đầu
        endDate: Date       // Thời gian kết thúc
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