const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    subjectName: String,
    teacher: String,
    classroom: String,
    weeklySessions: Number, // Thêm trường số tiết học hàng tuần
});

const semesterSchema = new mongoose.Schema({
    semesterName: String,
    week: Number,
    subjects: [subjectSchema],
});

const Semester = mongoose.model("Semester", semesterSchema);

module.exports = Semester;