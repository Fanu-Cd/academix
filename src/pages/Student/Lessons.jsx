import { useSelector } from "react-redux";
import AntdTable from "../../components/AntdTable";
import { useEffect, useState } from "react";
import { Button, Input, Modal, Select } from "antd";
import API_URL from "../../apiUrl";

const Lessons = () => {
  const apiUrl = API_URL;

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Course Name",
      render(item) {
        const name =
          myFinalCourses.length > 0
            ? myFinalCourses.filter((course) => course._id == item.course)[0]
                .title
            : "";
        return name;
      },
    },
    {
      title: "Course ID",
      render(item) {
        const id =
          myFinalCourses.length > 0
            ? myFinalCourses.filter((course) => course._id == item.course)[0].id
            : "";
        return id;
      },
    },
    {
      title: "Assigned Teachers",
      render(item) {
        const course = myFinalCourses.filter(
          (course) => course._id == item.course
        )[0];
        const allTeachers = teachers.filter((teacher) =>
          course.teachers.includes(teacher._id)
        );
        return allTeachers.map((teacher) => (
          <small className="fw-bold">{teacher.name} ,</small>
        ));
      },
    },
    {
      title: "Course Materials",
      render(item) {
        return JSON.parse(item.filePaths).length;
      },
    },
    {
      title: "Exams & Questions",
      render(item) {
        const exam = myExams.filter((exam) => exam.lesson == item._id)[0];
        return exam && exam.filePaths ? JSON.parse(exam.filePaths).length : 0;
      },
    },
    {
      title: "Actions",
      render(item) {
        return (
          <div className="d-flex">
            <Button
              onClick={() => {
                setSelectedLesson(item);
                setShowViewModal(true);
              }}
              type="primary"
            >
              View Lesson
            </Button>
            <Button
              className="ms-2"
              onClick={() => {
                setSelectedLesson(item);
                setShowViewExamModal(true);
              }}
            >
              View Exams & Questions
            </Button>
          </div>
        );
      },
    },
  ];

  const allCourses = useSelector((state) => state.myReducer.courses);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const myCourses = allCourses.filter(
    (course) => course.department == currentUser.department
  );

  const teachers = useSelector((state) => state.myReducer.users).filter(
    (user) => user.role == "teacher" && user.account_status == "active"
  );

  const courseRegs = useSelector((state) => state.myReducer.courseRegs);
  const myCourseRegs = courseRegs.filter((cr) => cr.user == currentUser._id);

  const myFinalCourses = myCourses.filter((course) => {
    let isInMyCourseRegs =
      myCourseRegs.filter((cr) => cr.course == course._id).length > 0;
    return isInMyCourseRegs;
  });

  const allLessons = useSelector((state) => state.myReducer.lessons);
  const myLessons = allLessons.filter((lesson) => {
    const isOfMyCourse =
      myFinalCourses.filter((course) => course._id == lesson.course).length > 0;
    return isOfMyCourse;
  });

  const allExams = useSelector((state) => state.myReducer.exams);
  const myExams = allExams.filter((exam) => {
    const isOfMyLesson =
      myLessons.filter((lesson) => lesson._id == exam.lesson).length != 0;
    return isOfMyLesson;
  });

  const [filteredLessons, setFilteredLessons] = useState(myLessons);
  const [filterBy, setFilterBy] = useState("title");
  const [filterCondition, setFilterCondition] = useState("");

  const [showViewModal, setShowViewModal] = useState(false);
  const [showViewExamModal, setShowViewExamModal] = useState(false);

  const [selectedLesson, setSelectedLesson] = useState(null);

  const filterData = () => {
    const filtered =
      filterBy == "title"
        ? myLessons.filter((course) =>
            course.title.toLowerCase().includes(filterCondition.toLowerCase())
          )
        : myLessons.filter((course) =>
            course.id.toLowerCase().includes(filterCondition.toLowerCase())
          );
    setFilteredLessons(filtered);
  };

  useEffect(() => {
    if (!filterCondition) setFilteredLessons(myLessons);
    else filterData();
  }, [filterCondition]);

  return (
    <div className="w-100">
      <h5 className="text-center">Lessons</h5>
      <div
        className="mx-auto d-flex align-items-center justify-content-end p-2"
        style={{ minHeight: "2rem", maxWidth: "80%" }}
      >
        <div className="d-flex justify-content-end" style={{ width: "50%" }}>
          <div
            className="d-flex align-items-center"
            style={{ minWidth: "5rem" }}
          >
            <small>Filter By : </small>
            <Select
              value={filterBy}
              className="ms-2"
              onChange={(val) => {
                setFilterBy(val);
                setFilterCondition("");
              }}
            >
              <Select.Option value="title">Name</Select.Option>
              <Select.Option value="id">Course ID</Select.Option>
            </Select>
          </div>
          <div
            className="d-flex align-items-center ms-2"
            style={{ minWidth: "10rem" }}
          >
            <Input
              onChange={(e) => {
                setFilterCondition(e.target.value);
              }}
              value={filterCondition}
            />
          </div>
        </div>
      </div>
      <AntdTable columns={columns} data={filteredLessons} width="80%" />
      <Modal
        open={showViewModal}
        title="View Lesson"
        onCancel={() => {
          setShowViewModal(false);
        }}
      >
        {showViewModal && (
          <div className="w-100">
            <ul>
              <li>Lesson Title : {selectedLesson.title}</li>
              <li>Uploaded in : {selectedLesson.createdAt.split("T")[0]}</li>
              <li>
                <p className="m-0">Course Materials : </p>
                {JSON.parse(selectedLesson.filePaths).map((file) => (
                  <a className="d-block" href={`${apiUrl}/uploads/${file}`}>
                    {file}
                  </a>
                ))}
              </li>
            </ul>
          </div>
        )}
      </Modal>
      <Modal
        open={showViewExamModal}
        maskClosable={false}
        title="View Exams and Questions"
        onCancel={() => {
          setShowViewExamModal(false);
        }}
        style={{ width: "80%" }}
        footer={[]}
      >
        {showViewExamModal && (
          <div className="w-100 d-flex flex-column">
            {myExams.filter((exam) => exam.lesson == selectedLesson._id)
              .length > 0 ? (
              <div className="w-100">
                <ul>
                  <li>Lesson Title : {selectedLesson.title}</li>

                  <li>
                    Exam Title :{" "}
                    {
                      myExams.filter(
                        (exam) => exam.lesson == selectedLesson._id
                      )[0].title
                    }
                  </li>
                  <li>
                    Uploaded in :{" "}
                    {
                      myExams
                        .filter((exam) => exam.lesson == selectedLesson._id)[0]
                        .createdAt.split("T")[0]
                    }
                  </li>
                  <li>
                    Attached Files :
                    {selectedLesson.filePaths.length > 0 &&
                      JSON.parse(selectedLesson.filePaths).map((file) => (
                        <small className="d-block">
                          {file}&nbsp;&nbsp;
                          <a
                            href={`${apiUrl}/uploads/${file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            Download
                          </a>
                        </small>
                      ))}
                  </li>
                </ul>
              </div>
            ) : (
              <small className="text-center text-danger">
                No Exam/Question Uploaded!
              </small>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Lessons;
