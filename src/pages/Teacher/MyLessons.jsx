import { Button, Input, Modal, Select, message } from "antd";
import AntdTable from "../../components/AntdTable";
import { useEffect, useState } from "react";
import {
  DeleteOutlined,
  PlusCircleFilled,
  UploadOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import API_URL from "../../apiUrl";

const MyLessons = () => {
  const apiUrl = API_URL;

  const columns = [
    {
      title: "Course Name",
      render(item) {
        return (
          myCourses.length > 0 &&
          myCourses.filter((course) => course._id == item.course)[0].title
        );
      },
    },
    {
      title: "Course ID",
      render(item) {
        return (
          myCourses.length > 0 &&
          myCourses.filter((course) => course._id == item.course)[0].id
        );
      },
    },
    { title: "Lesson Title", dataIndex: "title" },
    {
      title: "Uploaded in",
      render(item) {
        return item.createdAt && item.createdAt.split("T")[0];
      },
    },
    {
      title: "Files",
      render(item) {
        const files = JSON.parse(item.filePaths);
        return files && files.length;
      },
    },
    {
      title: "Actions",
      render(item) {
        return (
          <>
            <Button
              onClick={() => {
                setShowViewModal(true);
                setSelectedLesson(item);
              }}
              className="bg-success text-white"
            >
              View Lesson
            </Button>
            <Button
              className="ms-2"
              onClick={() => {
                setShowViewExamModal(true);
                setSelectedLesson(item);
              }}
            >
              Exams & Questions
            </Button>
          </>
        );
      },
    },
  ];

  const allCourses = useSelector((state) => state.myReducer.courses);
  const allLessons = useSelector((state) => state.myReducer.lessons);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (error) message.error("Fetching Data Error !");
  }, [error]);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const myCourses = allCourses.filter((course) =>
    course.teachers.includes(currentUser._id)
  );

  const myLessons = allLessons.filter(
    (lesson) => lesson.uploadedBy == currentUser._id
  );

  const allExams = useSelector((state) => state.myReducer.exams);
  const myExams = allExams.filter((exam) => {
    const isOfMyLesson =
      myLessons.filter((lesson) => lesson._id == exam.lesson).length != 0;
    return isOfMyLesson;
  });
  const [filteredLessons, setFilteredLessons] = useState(myLessons);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [showViewExamModal, setShowViewExamModal] = useState(false);
  const [filterBy, setFilterBy] = useState("name");
  const [filterCondition, setFilterCondition] = useState("");
  const [newLesson, setNewLesson] = useState({
    course: "",
    title: "",
    files: [],
  });
  const [newExam, setNewExam] = useState({
    title: "",
    files: [],
  });
  const [selectedLesson, setSelectedLesson] = useState(null);

  const handleFileChange = (e, type) => {
    const file = e.target.files;
    if (type == "lesson") {
      const files = newLesson.files;
      files.push(file);
      setNewLesson({ ...newLesson, files: files });
    } else {
      const files = newExam.files;
      files.push(file);
      setNewExam({ ...newExam, files: files });
    }
  };

  const handleRemoveFile = (fileToRemove, type) => {
    if (type == "lesson") {
      const files = newLesson.files;
      const filteredFiles = files.filter((file) => file != fileToRemove);
      setNewLesson({ ...newLesson, files: filteredFiles });
    } else {
      const files = newExam.files;
      const filteredFiles = files.filter((file) => file != fileToRemove);
      setNewExam({ ...newExam, files: filteredFiles });
    }
  };

  const handleSubmit = () => {
    const filePaths = newLesson.files.map((file) => file[0].name);
    const formData = new FormData();
    newLesson.files.map((file) => {
      formData.append("files", file[0]);
    });
    formData.append("course", newLesson.course);
    formData.append("title", newLesson.title);
    formData.append(
      "uploadedBy",
      JSON.parse(localStorage.getItem("currentUser"))._id
    );
    formData.append("filePaths", JSON.stringify(filePaths));
    fetch(`${apiUrl}/upload-lesson`, {
      method: "post",
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        setNewLesson({});
        showAddModal(false);
      })
      .catch((err) => {
        console.log("error", err);
        setError(true);
      });
  };

  const handleExamSubmit = () => {
    const filePaths = newExam.files.map((file) => file[0].name);
    const formData = new FormData();
    newExam.files.map((file) => {
      formData.append("files", file[0]);
    });
    formData.append("lesson", selectedLesson._id);
    formData.append("title", newExam.title);
    formData.append("filePaths", JSON.stringify(filePaths));
    fetch(`${apiUrl}/upload-exam`, {
      method: "post",
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        setNewExam({});
        showAddExamModal(false);
      })
      .catch((err) => {
        console.log("error", err);
        setError(true);
      });
  };

  const filterData = () => {
    const filtered =
      filterBy == "name"
        ? myLessons &&
          myLessons.filter((lesson) =>
            lesson.title.toLowerCase().includes(filterCondition.toLowerCase())
          )
        : myLessons.filter((lesson) => lesson.course == filterCondition);
    setFilteredLessons(filtered);
  };

  useEffect(() => {
    if (!filterCondition) setFilteredLessons(myLessons);
    else filterData();
  }, [filterCondition]);

  return (
    <div className="w-100">
      <h5 className="text-center">My Lessons</h5>
      <div
        className="mx-auto d-flex align-items-center justify-content-between p-2"
        style={{ minHeight: "2rem", maxWidth: "80%" }}
      >
        <div style={{ maxWidth: "30%" }}>
          <Button
            onClick={() => {
              setShowAddModal(true);
            }}
            type="primary"
            icon={<PlusCircleFilled />}
          >
            Upload Lesson
          </Button>
        </div>

        <div
          className="d-flex flex-column flex-md-row justify-content-center justify-content-md-end"
          style={{ maxWidth: "50%" }}
        >
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ maxWidth: "10rem" }}
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
              <Select.Option value="name">Name</Select.Option>
              <Select.Option value="course">Course</Select.Option>
            </Select>
          </div>
          <div
            className="d-flex align-items-center ms-2 mt-2 mt-md-0"
            style={{ maxWidth: "10rem" }}
          >
            {filterBy == "name" && (
              <Input
                onChange={(e) => {
                  setFilterCondition(e.target.value);
                }}
                value={filterCondition}
              />
            )}
            {filterBy == "course" && (
              <Select
                className="w-100"
                value={filterCondition}
                onChange={(val) => {
                  setFilterCondition(val);
                }}
              >
                {myCourses.map((course) => (
                  <Select.Option value={course._id}>
                    {course.title}
                  </Select.Option>
                ))}
              </Select>
            )}
          </div>
        </div>
      </div>
      <AntdTable columns={columns} data={filteredLessons} width="80%" />
      <Modal
        open={showAddModal}
        maskClosable={false}
        title="Upload Lesson"
        onCancel={() => {
          setShowAddModal(false);
        }}
        style={{ width: "80%" }}
        footer={[]}
      >
        {showAddModal && (
          <div className="w-100 d-flex flex-column">
            <label htmlFor="course">Select Course</label>
            <Select
              id="course"
              value={newLesson.course}
              onChange={(val) => {
                setNewLesson({ ...newLesson, course: val });
              }}
            >
              {myCourses.length > 0 &&
                myCourses.map((course) => (
                  <Select.Option value={course._id}>
                    {course.title}
                  </Select.Option>
                ))}
            </Select>
            <label htmlFor="course" className="mt-2">
              Give your lesson a title
            </label>
            <Input
              value={newLesson.title}
              onChange={(e) => {
                setNewLesson({ ...newLesson, title: e.target.value });
              }}
            />
            <label className="mt-2">Attach Files</label>
            <Button
              onClick={() => {
                document.getElementById("attachFile").click();
              }}
              style={{ maxWidth: "10rem" }}
              icon={<UploadOutlined />}
              className="bg-success text-white"
            >
              {newLesson.files.length > 0 ? "Add File" : "Upload"}
            </Button>
            <div className="w-100 d-flex flex-column">
              <small>Uploaded Files :</small>
              {newLesson.files.length > 0 ? (
                <ul>
                  {newLesson.files.map((file) => (
                    <li className="d-flex align-items-center">
                      <p className="text-truncate m-0" style={{ width: "80%" }}>
                        {file[0].name}
                      </p>
                      <Button
                        onClick={() => handleRemoveFile(file, "lesson")}
                        type="text"
                        className="text-danger ms-3 d-flex justify-content-center align-items-center"
                      >
                        <DeleteOutlined />
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No File Uploaded!</p>
              )}
            </div>
            <Button
              onClick={(e) => handleSubmit(e, "lesson")}
              type="primary"
              className="mx-auto"
              style={{ width: "40%" }}
            >
              Finish
            </Button>
            <input
              id="attachFile"
              onChange={handleFileChange}
              hidden
              type="file"
              multiple
            />
          </div>
        )}
      </Modal>
      <Modal
        open={showViewModal}
        maskClosable={false}
        title="View Lesson"
        onCancel={() => {
          setShowViewModal(false);
        }}
        style={{ width: "80%" }}
        footer={[]}
      >
        {showViewModal && (
          <ul>
            <li>
              Course Name :{" "}
              {
                myCourses.filter(
                  (course) => course._id == selectedLesson.course
                )[0].title
              }
            </li>
            <li>
              Course ID :{" "}
              {
                myCourses.filter(
                  (course) => course._id == selectedLesson.course
                )[0].id
              }
            </li>
            <li>Lesson Title : {selectedLesson.title}</li>
            <li>
              Uploaded in :{" "}
              {selectedLesson.createdAt &&
                selectedLesson.createdAt.split("T")[0]}
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
        )}
      </Modal>
      <Modal
        open={showAddExamModal}
        maskClosable={false}
        title="Add Exams and Questions"
        onCancel={() => {
          setShowAddExamModal(false);
        }}
        style={{ width: "80%" }}
        footer={[]}
      >
        {showAddExamModal && (
          <div className="w-100 d-flex flex-column">
            <p className="m-0">
              Selected Lesson : <b>{selectedLesson.title}</b>
            </p>
            <hr className="m-0" />
            <label className="mt-2">Give a title for the Exam / Question</label>
            <Input
              value={newExam.title}
              onChange={(e) => {
                setNewExam({ ...newExam, title: e.target.value });
              }}
            />
            <label className="mt-2">Attach Files</label>
            <Button
              onClick={() => {
                document.getElementById("attachFile").click();
              }}
              style={{ maxWidth: "10rem" }}
              icon={<UploadOutlined />}
              className="bg-success text-white"
            >
              {newExam.files.length > 0 ? "Add File" : "Upload"}
            </Button>
            <div className="w-100 d-flex flex-column">
              <small>Uploaded Files :</small>
              {newExam.files.length > 0 ? (
                <ul>
                  {newExam.files.map((file) => (
                    <li className="d-flex align-items-center">
                      <p className="text-truncate m-0" style={{ width: "80%" }}>
                        {file[0].name}
                      </p>
                      <Button
                        onClick={() => handleRemoveFile(file, "exam")}
                        type="text"
                        className="text-danger ms-3 d-flex justify-content-center align-items-center"
                      >
                        <DeleteOutlined />
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No File Uploaded!</p>
              )}
            </div>
            <Button
              onClick={(e) => handleExamSubmit(e, "exam")}
              type="primary"
              className="mx-auto"
              style={{ width: "40%" }}
            >
              Finish
            </Button>
            <input
              id="attachFile"
              onChange={handleFileChange}
              hidden
              type="file"
              multiple
            />
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
              <div className="d-flex flex-column justify-content-center align-items-center w-100">
                <Button
                  icon={<PlusCircleFilled />}
                  type="primary"
                  style={{ minWidth: "5rem" }}
                  onClick={() => {
                    setShowViewExamModal(false);
                    setShowAddExamModal(true);
                  }}
                >
                  Add New Exam/Question
                </Button>
                <ul className="w-100">
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
              <div className="d-flex flex-column justify-content-center align-items-center w-100">
                <Button
                  icon={<PlusCircleFilled />}
                  type="primary"
                  style={{ minWidth: "5rem" }}
                  onClick={() => {
                    setShowViewExamModal(false);
                    setShowAddExamModal(true);
                  }}
                >
                  Add New Exam/Question
                </Button>
                <small className="mt-2">
                  No Exam/Question uploaded for this Lesson
                </small>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyLessons;
