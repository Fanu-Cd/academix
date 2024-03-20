import { Button, Input, Modal, Select } from "antd";
import AntdTable from "../../components/AntdTable";
import { useEffect, useState } from "react";
import {
  DeleteOutlined,
  PlusCircleFilled,
  UploadOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

const MyLessons = () => {
  const apiUrl = "http://localhost:3001";

  const columns = [
    {
      title: "Course Name",
      render(item) {
        return (
          myCourses &&
          myCourses.filter((course) => course._id == item.course)[0].title
        );
      },
    },
    {
      title: "Course ID",
      render(item) {
        return (
          myCourses &&
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
          <Button
            onClick={() => {
              setShowViewModal(true);
              setSelectedLesson(item);
            }}
          >
            View
          </Button>
        );
      },
    },
  ];

  const allCourses = useSelector((state) => state.myReducer.courses);
  const allLessons = useSelector((state) => state.myReducer.lessons);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const myCourses = allCourses
    ? allCourses.filter((course) => course.teachers.includes(currentUser._id))
    : [];

  const myLessons = allLessons
    ? allLessons.filter((lesson) => lesson.uploadedBy == currentUser._id)
    : [];
  const [filteredLessons, setFilteredLessons] = useState(myLessons);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [filterBy, setFilterBy] = useState("name");
  const [filterCondition, setFilterCondition] = useState("");
  const [newLesson, setNewLesson] = useState({
    course: "",
    title: "",
    files: [],
  });
  const [selectedLesson, setSelectedLesson] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files;
    const files = newLesson.files;
    files.push(file);
    setNewLesson({ ...newLesson, files: files });
  };

  const handleRemoveFile = (fileToRemove) => {
    const files = newLesson.files;
    const filteredFiles = files.filter((file) => file != fileToRemove);
    setNewLesson({ ...newLesson, files: filteredFiles });
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
        console.log("err", err);
      });
  };

  const filterData = () => {
    console.log(myLessons, filterBy, filterCondition);
    const filtered =
      filterBy == "name"
        ? myLessons.filter((lesson) =>
            lesson.title.toLowerCase().includes(filterCondition.toLowerCase())
          )
        : myLessons.filter((lesson) => lesson.course == filterCondition);
    setFilteredLessons(filtered);
  };

  useEffect(() => {
    console.log(myLessons, filterBy, filterCondition);
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
        <div style={{ width: "30%" }}>
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
              <Select.Option value="name">Name</Select.Option>
              <Select.Option value="course">Course</Select.Option>
            </Select>
          </div>
          <div
            className="d-flex align-items-center ms-2"
            style={{ minWidth: "10rem" }}
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
                <Select.Option value={course._id}>{course.title}</Select.Option>
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
                      onClick={() => handleRemoveFile(file)}
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
            onClick={handleSubmit}
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
    </div>
  );
};

export default MyLessons;
