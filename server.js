require("./config/db");

const app = require("express")();
const cors = require("cors");
const bodyParser = require("express").json;
const port = process.env.PORT || 3000;

const signInRouter = require("./api/auth/student/sigin_in")
const signUpRouter = require("./api/auth/student/sigin_up")
const deleteTeacher = require("./api/auth/teacher/delete")
const updateStudenRouter = require("./api/auth/student/update")
const teacherRouter = require("./api/auth/teacher/teacher_add")
const loginRouter = require("./api/auth/teacher/login")
const profileRouter = require("./api/auth/teacher/profile")
const updateTeacherRouter = require("./api/auth/teacher/update")
const workingRouter = require("./api/auth/teacher/working")
const retiredRouter = require("./api/auth/teacher/retired")
const checkStudentRouter = require("./api/auth/student/status/check")
const expelStudentRouter = require("./api/auth/student/status/expel")
const suspendStudentRouter = require("./api/auth/student/status/suspend")
const selfSuspendStudentRouter = require("./api/auth/student/status/self-suspend")
const forgotPasswordStudentRouter = require("./api/auth/student/forgot_password")
const forgotPasswordTeacherRouter = require("./api/auth/teacher/forgot_password")
const addMajorRouter = require("./api/home/teacher/major/add_major")
const editMajorRouter = require("./api/home/teacher/major/edit_major")
const deleteMajorRouter = require("./api/home/teacher/major/delete_major")
const majorRiuter = require("./api/home/teacher/major/major")
const changeOccupationMajorRouter = require("./api/home/teacher/major/change_occupation_major")
const studentRouter = require("./api/auth/student/student")
const divideClassesRouter = require("./api/home/student/class/divide_classes")
const classRouter = require("./api/home/student/class/class")
const classInfoRouter = require("./api/home/student/class/class_info")
const classTeachersRouter = require("./api/home/teacher/class/class_teachers")
const uploadImagesFirebaseStorageRouter = require("./api/auth/student/firebase/firebase_storage_router")
const updateImageFirebaseStorageRouter = require("./api/auth/teacher/firebase/update_avatar")
const profileStudentsRouter = require("./api/auth/student/profile")
const updateAvatarStudentRouter = require("./api/auth/student/firebase/update_avatar")
const timetableRouter = require('./api/auth/other/timetable');
const getTimeTableRoute = require('./api/auth/other/get_timetable');
const deleteTimeTableRoute = require('./api/auth/other/delete_timetable');

var whitelist = ['https://backend-shool-project.onrender.com', 'http://localhost:3000', '*']
var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true }
    } else {
        corsOptions = { origin: false }
    }
    callback(null, corsOptions)
}

app.use(cors({ credentials: true, origin: '*' }));

app.use(bodyParser());

app.use('/user', signInRouter)
app.use('/admin', signUpRouter)
app.use('/admin', deleteTeacher)
app.use('/user', updateStudenRouter)
app.use('/admin', teacherRouter)
app.use('/admin',  loginRouter)
app.use('/admin', profileRouter)
app.use('/admin', updateTeacherRouter)
app.use('/admin', cors(corsOptionsDelegate), workingRouter)
app.use('/admin', cors(corsOptionsDelegate), retiredRouter)
app.use('/user', checkStudentRouter)
app.use('/user', expelStudentRouter)
app.use('/user', suspendStudentRouter)
app.use('/user', selfSuspendStudentRouter)
app.use('/student', forgotPasswordStudentRouter)
app.use('/teacher', forgotPasswordTeacherRouter)
app.use('/admin', addMajorRouter)
app.use('/admin', editMajorRouter)
app.use('/admin', deleteMajorRouter)
app.use('/admin', majorRiuter)
app.use('/admin', changeOccupationMajorRouter)
app.use('/admin', studentRouter)
app.use('/admin', divideClassesRouter)
app.use('/admin', classRouter)
app.use('/admin', classInfoRouter)
app.use('/admin', classTeachersRouter)
app.use('/user', uploadImagesFirebaseStorageRouter)
app.use('/admin', updateImageFirebaseStorageRouter)
app.use('/user', profileStudentsRouter)
app.use('/user', updateAvatarStudentRouter)
app.use('/timetable', timetableRouter);
app.use('/timetable', getTimeTableRoute);
app.use('/timetable', deleteTimeTableRoute);

app.listen(port, cors(corsOptionsDelegate), () => {
    console.log(`Server running on port ${port}`);
});