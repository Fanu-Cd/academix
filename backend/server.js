const mongoose = require("mongoose"); // Mongoose for communicating with mongoDB
const express = require("express");
const bodyParser = require("body-parser");
const port = 3001;
const app = express();
const cors = require("cors");
const User = require("./models/user");
const Department = require("./models/department");
const Course = require("./models/course");
const CourseRegistration = require("./models/course-registration");
require("dotenv").config();
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const Lesson = require("./models/lesson");
const Exam = require("./models/exam");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
const mongodburl = process.env.MONGODB_URL;
mongoose
  .connect(mongodburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
}).array("files", 10);

app.post("/create-account", (req, response) => {
  const { name, email, password, grade, department, role } = req.body;
  bcrypt
    .hash(password, 10)
    .then((res) => {
      const hashedPw = res;
      const newUser = new User({
        name: name,
        email: email,
        password: hashedPw,
        department: convertFieldsToObjectId(department),
        grade: grade,
        role: role,
      });
      newUser
        .save()
        .then((res) => response.json({ result: res }))
        .catch((err) => response.json({ error: err }));
    })
    .catch((err) => response.json({ error: err }));
});

app.post("/change-password/:id", (req, response) => {
  const uid = req.params.id;
  const { newPassword } = req.body;
  bcrypt
    .hash(newPassword, 10)
    .then((res) => {
      const hashedPw = res;
      User.findByIdAndUpdate(uid, { password: hashedPw })
        .then((res) => {
          response.json({ result: res });
        })
        .catch((err) => {
          response.json({ error: err });
        });
    })
    .catch((err) => response.json({ error: err }));
});

app.post("/update-user/:id", (req, response) => {
  const { account_status } = req.body;
  const id = req.params.id;
  User.findByIdAndUpdate(id, { account_status: account_status })
    .then((res) => {
      response.json({ result: res });
    })
    .catch((err) => {
      response.json({ err: err });
    });
});

app.get("/get-users", (req, response) => {
  User.find()
    .then((res) => response.json({ result: res }))
    .catch((err) => {
      response.json({ error: err });
    });
});

app.post("/filterUserByEmail", (req, response) => {
  const { email } = req.body;
  User.find({ email: email })
    .then((res) => {
      response.json({ result: res });
    })
    .catch((err) => {
      response.json({ error: err });
    });
});

app.post("/checkCredentials", async (req, response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    response.json({ error: "User Not Found!" });
    return;
  }
  const pwmatch = await bcrypt.compare(password, user.password);
  if (!pwmatch) {
    response.json({ error: "Wrong Password" });
    return;
  }

  response.json({ result: user });
});

app.post("/create-department", (req, response) => {
  const { name } = req.body;
  const newDept = new Department({
    title: name,
  });

  newDept
    .save()
    .then((res) => response.json({ result: res }))
    .catch((err) => response.json({ error: err }));
});

app.post("/update-department/:id", (req, response) => {
  const { name } = req.body;
  const id = req.params.id;
  Department.findByIdAndUpdate(id, { title: name })
    .then((res) => {
      response.json({ result: res });
    })
    .catch((err) => {
      response.json({ err: err });
    });
});

app.get("/get-departments", (req, response) => {
  Department.find()
    .then((res) => response.json({ result: res }))
    .catch((err) => {
      response.json({ error: err });
    });
});

app.get("/delete-department/:id", (req, response) => {
  const id = req.params.id;
  Department.findByIdAndDelete(id)
    .then((res) => {
      response.json({ result: res });
    })
    .catch((err) => {
      response.json({ error: true });
    });
});

app.post("/filterDeptByName", (req, response) => {
  const { name } = req.body;
  Department.find({ title: name })
    .then((res) => {
      response.json({ result: res });
    })
    .catch((err) => {
      response.json({ error: err });
    });
});

app.get("/get-courses", (req, response) => {
  Course.find()
    .then((res) => response.json({ result: res }))
    .catch((err) => {
      response.json({ error: err });
    });
});

app.post("/create-course", (req, response) => {
  const { name, courseid, department } = req.body;
  const newDept = new Course({
    title: name,
    id: courseid,
    department: convertFieldsToObjectId(department),
  });

  newDept
    .save()
    .then((res) => response.json({ result: res }))
    .catch((err) => response.json({ error: err }));
});

app.post("/update-course/:id", (req, response) => {
  const { name, courseid, department } = req.body;
  const id = req.params.id;
  Course.findByIdAndUpdate(id, {
    title: name,
    id: courseid,
    department: department,
  })
    .then((res) => {
      response.json({ result: res });
    })
    .catch((err) => {
      response.json({ err: err });
    });
});

app.post("/assign-teacher-to-course/:id", (req, response) => {
  const { teachers } = req.body;
  const id = req.params.id;
  Course.findByIdAndUpdate(id, { teachers: JSON.parse(teachers) })
    .then((res) => {
      response.json({ result: res });
    })
    .catch((err) => {
      response.json({ err: err });
    });
});

app.get("/release-course/:id", (req, response) => {
  const id = req.params.id;
  Course.findByIdAndUpdate(id, { status: "active" })
    .then((res) => {
      response.json({ result: res });
    })
    .catch((err) => {
      response.json({ err: err });
    });
});

app.get("/delete-course/:id", (req, response) => {
  const id = req.params.id;
  Course.findByIdAndDelete(id)
    .then((res) => {
      response.json({ result: res });
    })
    .catch((err) => {
      response.json({ error: true });
    });
});

app.post("/filterCourseByName", (req, response) => {
  const { name } = req.body;
  Course.find({ title: name })
    .then((res) => {
      response.json({ result: res });
    })
    .catch((err) => {
      response.json({ error: err });
    });
});

app.post("/filterCourseById", (req, response) => {
  const { courseid } = req.body;
  Course.find({ id: courseid })
    .then((res) => {
      response.json({ result: res });
    })
    .catch((err) => {
      response.json({ error: err });
    });
});

app.post("/upload-lesson", (req, response) => {
  upload(req, response, (err) => {
    if (err) {
      response.json({ error: err });
      return;
    }
    const { course, title, filePaths, uploadedBy } = req.body;
    const newLesson = new Lesson({
      course: course,
      title: title,
      filePaths: filePaths,
      uploadedBy: uploadedBy,
    });
    newLesson
      .save()
      .then((res) => {
        response.json({ result: res });
      })
      .catch((err) => {
        response.json({ error: err });
      });
  });
});

app.get("/get-lessons", (req, response) => {
  Lesson.find()
    .then((res) => {
      response.json({ result: res });
    })
    .catch((err) => {
      response.json({ error: err });
    });
});

app.get("/get-course-regs", (req, response) => {
  CourseRegistration.find()
    .then((res) => {
      response.json({ result: res });
    })
    .catch((err) => {
      response.json({ error: err });
    });
});

app.post("/register-for-course", (req, response) => {
  const { uid, courseid } = req.body;
  const newCourseReg = new CourseRegistration({
    course: convertFieldsToObjectId(courseid),
    user: convertFieldsToObjectId(uid),
  });
  newCourseReg
    .save()
    .then((res) => {
      response.json({ result: res });
    })
    .catch((err) => {
      response.json({ error: err });
    });
});

app.post("/update-course-reg/:id", (req, response) => {
  const {id} = req.params
  const { status } = req.body;
  CourseRegistration.findByIdAndUpdate(id, { status: status })
    .then((res) => response.json({ result: res }))
    .catch((err) => {
      response.json({ error: err });
    });
});

app.get("/get-exams", (req, response) => {
  Exam.find()
    .then((Res) => {
      response.json({ result: Res });
    })
    .catch((err) => {
      response.json({ error: err });
    });
});

app.post("/upload-exam", (req, response) => {
  upload(req, response, (err) => {
    if (err) {
      response.json({ error: err });
      return;
    }
    const { lesson, title, filePaths } = req.body;
    const newExam = new Exam({
      lesson: convertFieldsToObjectId(lesson),
      title: title,
      filePaths: filePaths,
    });
    newExam
      .save()
      .then((res) => {
        response.json({ result: res });
      })
      .catch((err) => {
        response.json({ error: err });
      });
  });
});

//Methods
const convertFieldsToObjectId = (input) => {
  const objId = new mongoose.Types.ObjectId(input);
  return objId;
};

app.listen(port, () => {
  console.log(`Server Listening on Port ${port}`);
});
