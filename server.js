require("./config/db");

const app = require("express")();
const cors = require("cors");
const bodyParser = require("express").json;
const cookieParser = require('cookie-parser');
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
const forgotPasswordStudentRouter = require("./api/auth/student/forgot_password")
const forgotPasswordTeacherRouter = require("./api/auth/teacher/forgot_password")
const addMajorRouter = require("./api/home/teacher/major/add_major")
const editMajorRouter = require("./api/home/teacher/major/edit_major")
const deleteMajorRouter = require("./api/home/teacher/major/delete_major")
const majorRiuter = require("./api/home/teacher/major/major")
const changeOccupationMajorRouter = require("./api/home/teacher/major/change_occupation_major")
const divideClassesRouter = require("./api/home/student/class/divide_classes")
const classRouter = require("./api/home/student/class/class")
const classInfoRouter = require("./api/home/student/class/class_info")
const classTeachersRouter = require("./api/home/teacher/class/class_teachers")
const uploadImagesFirebaseStorageRouter = require("./api/auth/student/firebase/firebase_storage_router")
const updateImageFirebaseStorageRouter = require("./api/auth/teacher/firebase/update_avatar")
const profileStudentsRouter = require("./api/auth/student/profile")
const updateAvatarStudentRouter = require("./api/auth/student/firebase/update_avatar")
const timetableRouter = require('./api/auth/other/timetable')
const getTimeTableRoute = require('./api/auth/other/get_timetable')
const deleteTimeTableRoute = require('./api/auth/other/delete_timetable')
const semestersRouter = require('./api/home/schedule/schedule')
const addStudentClassRouter = require('./api/home/student/class/add_class')
const addTeachetClassRouter = require('./api/home/teacher/class/add_teacher_class')
const studentTransferRouter = require('./api/home/student/transfer/student_transfer')
const chartRouter = require('./api/home/chart/chart')
const totalTeacherRouter = require('./api/auth/teacher/total')
const newListStudentRouter = require('./api/auth/student/new_list')
const systemRouter = require('./api/home/system/system')
const notificationRouter = require('./api/notification/notification')
const expenseRouter = require('./api/home/expense/expense')
const feeRouter = require('./api/home/fee/fee')
const totalAllRouter = require('./api/routes/total')
const searchRouter = require('./api/home/search/search')
const tuitionFeeRouter = require('./api/home/tuition_fee/tuition_fee')
const studentFeeRouter = require('./api/home/tuition_fee/student_fee')
const otherRouter = require('./api/home/other/other')
const themeRoter = require('./api/home/theme/theme')
const statusInfoRouter = require('./api/home/student/status_info/status_info')

app.use(cors({ credentials: true, origin: '*' }));
app.use(cors({ credentials: true, origin: ['http://localhost:3000', 'https://backend-shool-project.onrender.com', 'https://school-manager-793a1.web.app'] }));
app.use(cookieParser());

app.use(bodyParser());

app.use('/user', signInRouter)
app.use('/admin', signUpRouter)
app.use('/admin', deleteTeacher)
app.use('/user', updateStudenRouter)
app.use('/admin', teacherRouter)
app.use('/admin', loginRouter)
app.use('/admin', profileRouter)
app.use('/admin', updateTeacherRouter)
app.use('/admin', workingRouter)
app.use('/admin', retiredRouter)
app.use('/student', forgotPasswordStudentRouter)
app.use('/teacher', forgotPasswordTeacherRouter)
app.use('/admin', addMajorRouter)
app.use('/admin', editMajorRouter)
app.use('/admin', deleteMajorRouter)
app.use('/admin', majorRiuter)
app.use('/admin', changeOccupationMajorRouter)
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
app.use('/admin', semestersRouter);
app.use('/admin', addStudentClassRouter);
app.use('/admin', addTeachetClassRouter);
app.use('/admin', studentTransferRouter);
app.use('/chart', chartRouter);
app.use('/teacher', totalTeacherRouter);
app.use('/student', newListStudentRouter);
app.use('/admin', systemRouter);
app.use('/admin', notificationRouter);
app.use('/admin', expenseRouter);
app.use('/admin', feeRouter);
app.use('/routes', totalAllRouter);
app.use('/search', searchRouter);
app.use('/admin', tuitionFeeRouter);
app.use('/admin', studentFeeRouter);
app.use('/other', otherRouter);
app.use('/theme', themeRoter);
app.use('/status', statusInfoRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});