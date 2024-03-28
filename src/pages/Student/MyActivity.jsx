import { Alert, Button, Input, Modal, Select, Tabs, message } from "antd";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AntdTable from "../../components/AntdTable";
import { fetcher } from "../../_services";
import { setStudentActivities, setStudentNotes } from "../../store/store";
import API_URL from "../../apiUrl";
import { PlusCircleOutlined, UploadOutlined } from "@ant-design/icons";

const MyActivity = () => {
  const dispatch = useDispatch();
  const apiUrl = API_URL;
  const columns = [
    {
      title: "Course",
      render(item) {
        const course =
          myFinalCourses.length > 0 &&
          myFinalCourses.filter((course) => course._id == item.course)[0].title;
        return course;
      },
    },
    {
      title: "Lesson",
      render(item) {
        const lesson =
          myLessons && item.lesson
            ? myLessons.filter((lesson) => lesson._id == item.lesson)[0].title
            : "-";
        return lesson;
      },
    },
    {
      title: "Notes",
      render(item) {
        return item.notes.length;
      },
    },
    {
      title: "Files Uploaded",
      render(item) {
        return item.filePaths.length;
      },
    },
    {
      title: "Started in",
      render(item) {
        return item.createdAt.split("T")[0];
      },
    },
    {
      title: "Last Updated",
      render(item) {
        return `${item.updatedAt.split("T")[0]} , ${
          item.updatedAt.split("T")[1].split(".")[0]
        }`;
      },
    },
    {
      title: "Actions",
      render(item) {
        return (
          <Button
            type="primary"
            onClick={() => {
              setSelectedActivity(item);
              setShowViewActivityModal(true);
            }}
          >
            View More
          </Button>
        );
      },
    },
  ];

  const allCourses = useSelector((state) => state.myReducer.courses);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const myCourses = allCourses.filter(
    (course) => course.department == currentUser.department
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

  const activities = useSelector((state) => state.myReducer.studentActivities);
  const myActivities = activities.filter(
    (activity) => activity.student == currentUser._id
  );

  const notes = useSelector((state) => state.myReducer.studentNotes);

  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showViewActivityModal, setShowViewActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const [filtLessons, setFiltLessons] = useState([]);
  const [input, setInput] = useState({
    course: "",
    lesson: "",
    note: { subject: "", content: "" },
  });
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState({
    inputs: { course: "", lesson: "" },
    addNote: false,
    viewNote: false,
    uploadFile: false,
  });

  const handleSubmit = (e, type) => {
    e.preventDefault();
    if (type === "activity") {
      if (!input.course) {
        setStatus({ ...status, inputs: { ...status.inputs, course: "error" } });
      } else {
        createNewActivity();
      }
    } else if (type == "add-note") {
      createNewNote();
    } else if (type == "edit-note") {
      updateNote();
    } else {
    }
  };

  const createNewActivity = () => {
    const { course, lesson } = input;
    const body = { student: currentUser._id, course: course, lesson: lesson };
    fetch(`${apiUrl}/create-student-activity`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((res) => {
        message.success("Successfully Created a new activity!");
        setShowAddActivityModal(false);
        getStudentActivities();
      })
      .catch((err) => {
        console.log("Error Creating New Activity", err);
        message.error("Error Creating New Activity");
      });
  };

  const createNewNote = () => {
    const body = input.note;
    fetch(`${apiUrl}/create-student-note`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((res) => {
        const newNote = { note: res.result._id };
        fetch(`${apiUrl}/update-student-activity/${selectedActivity._id}`, {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newNote),
        })
          .then((res) => res.json())
          .then((res) => {
            message.success("Successfully Created a new note!");
            getStudentNotes();
            getStudentActivities();
            setStatus({ ...status, addNote: false });
            setInput({ ...input, note: {} });
          })
          .catch((err) => {
            console.log("Error Creating New Note", err);
            message.error("Error Creating New Note");
          });
      });
  };

  const updateNote = () => {
    fetch(`${apiUrl}/update-student-note`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input.note),
    })
      .then((res) => res.json())
      .then((res) => {
        message.success("Successfully Updated note!");
        getStudentNotes();
        getStudentActivities();
        setStatus({ ...status, viewNote: false });
        setInput({ ...input, note: {} });
      })
      .catch((err) => {
        console.log("Error Updating New Note", err);
        message.error("Error Updating New Note");
      });
  };

  const uploadFile = () => {
    const formData = new FormData();
    const filePaths = [];
    Array.from(files).map((file) => {
      formData.append("files", file);
      filePaths.push(file.name);
    });

    formData.append("filePaths", JSON.stringify(filePaths));
    fetch(`${apiUrl}/upload-student-activity-file/${selectedActivity._id}`, {
      method: "post",
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        message.success("Files Uploaded Successfully!");
        getStudentActivities();
        setFiles([]);
        setStatus({ ...status, uploadFile: false });
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  const getStudentActivities = () => {
    fetcher("get-all-student-activities")
      .then((res) => {
        const activities = res.result;
        if (activities != undefined) dispatch(setStudentActivities(activities));
      })
      .catch((err) => {
        console.log("Getting Student Activity ERROR", err);
      });
  };

  const getStudentNotes = () => {
    fetcher("get-all-student-notes")
      .then((res) => {
        const notes = res.result;
        if (notes != undefined) dispatch(setStudentNotes(notes));
      })
      .catch((err) => {
        console.log("Getting Student Activity ERROR", err);
      });
  };

  const activityDetails = () => {
    return (
      <div>
        <ul style={{ listStyleType: "square" }}>
          <li>
            Course : {""}
            {myFinalCourses.length > 0 &&
              myFinalCourses.filter(
                (course) => course._id == selectedActivity.course
              )[0].title}
          </li>
          <li>
            Lesson : {""}
            {myLessons.length > 0 &&
              myLessons.filter(
                (lesson) => lesson._id == selectedActivity.lesson
              )[0].title}
          </li>
          <li>
            Started activity : {""}
            {`${selectedActivity.createdAt.split("T")[0]} , ${
              selectedActivity.createdAt.split("T")[1].split(".")[0]
            }`}
          </li>
          <li>
            Most recent Activity : {""}
            {`${selectedActivity.updatedAt.split("T")[0]} , ${
              selectedActivity.createdAt.split("T")[1].split(".")[0]
            }`}
          </li>
        </ul>
      </div>
    );
  };

  const activityNotes = () => {
    return (
      <div>
        {!status.addNote && !status.viewNote && (
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => {
              setStatus({ ...status, addNote: true });
            }}
          >
            Add Note
          </Button>
        )}
        <ul className="mt-3">
          {selectedActivity.notes.length > 0 || !status.viewNote ? (
            !status.viewNote && !status.addNote ? (
              selectedActivity.notes.map((note) => {
                const thisNote = notes.filter((nt) => nt._id == note)[0];
                return (
                  <li className="d-flex align-items-center">
                    <p
                      className="m-0 text-truncate"
                      style={{ maxWidth: "60%" }}
                    >
                      {thisNote.subject}
                    </p>
                    <Button
                      type="link ms-2"
                      onClick={() => {
                        setInput({
                          ...input,
                          note: {
                            id: thisNote._id,
                            subject: thisNote.subject,
                            content: thisNote.content,
                          },
                        });
                        setStatus({ ...status, viewNote: true });
                      }}
                    >
                      View
                    </Button>
                  </li>
                );
              })
            ) : (
              <>
                {status.viewNote && (
                  <form onSubmit={(e) => handleSubmit(e, "edit-note")}>
                    <label>Subject</label>
                    <Input
                      value={input.note.subject}
                      placeholder="Subject here"
                      onChange={(e) => {
                        setInput({
                          ...input,
                          note: { ...input.note, subject: e.target.value },
                        });
                      }}
                      required
                      minLength={5}
                    />
                    <label className="mt-1">Note</label>
                    <Input.TextArea
                      value={input.note.content}
                      maxLength={2000}
                      placeholder="Content here"
                      style={{ resize: "none", minHeight: "15rem" }}
                      onChange={(e) => {
                        setInput({
                          ...input,
                          note: { ...input.note, content: e.target.value },
                        });
                      }}
                      required
                    ></Input.TextArea>
                    <Alert
                      className="mt-2"
                      message="Your note's content shouldn't be more than 2000 characters"
                      type="info"
                      showIcon
                      style={{ width: "50%" }}
                    />
                    <div className="d-flex justify-content-between mt-3">
                      <Button
                        className="bg-danger text-white"
                        onClick={() => {
                          setStatus({ ...status, viewNote: false });
                        }}
                      >
                        Close
                      </Button>
                      <Button type="primary" htmlType="submit">
                        Save Note
                      </Button>
                    </div>
                  </form>
                )}

                {status.addNote && (
                  <form onSubmit={(e) => handleSubmit(e, "add-note")}>
                    <label>Subject</label>
                    <Input
                      value={input.note.subject}
                      placeholder="Subject here"
                      onChange={(e) => {
                        setInput({
                          ...input,
                          note: { ...input.note, subject: e.target.value },
                        });
                      }}
                      required
                      minLength={5}
                    />
                    <label className="mt-1">Note</label>
                    <Input.TextArea
                      value={input.note.content}
                      maxLength={2000}
                      placeholder="Content here"
                      style={{ resize: "none", minHeight: "15rem" }}
                      onChange={(e) => {
                        setInput({
                          ...input,
                          note: { ...input.note, content: e.target.value },
                        });
                      }}
                      required
                    ></Input.TextArea>
                    <Alert
                      className="mt-2"
                      message="Your note's content shouldn't be more than 2000 characters"
                      type="info"
                      showIcon
                      style={{ width: "50%" }}
                    />
                    <div className="d-flex justify-content-between mt-3">
                      <Button
                        className="bg-danger text-white"
                        onClick={() => {
                          setStatus({ ...status, addNote: false });
                        }}
                      >
                        Close
                      </Button>
                      <Button type="primary" htmlType="submit">
                        Save Note
                      </Button>
                    </div>
                  </form>
                )}
              </>
            )
          ) : (
            <>
              {!status.addNote ? (
                <div className="d-flex flex-column">
                  <small className="text-center mt-5 text-danger">
                    You haven't added any note yet.
                  </small>
                  <Button
                    className="mx-auto d-block"
                    icon={<PlusCircleOutlined />}
                    type="primary"
                    onClick={() => {
                      setStatus({ ...status, addNote: true });
                    }}
                  >
                    Add Note
                  </Button>
                </div>
              ) : (
                <form onSubmit={(e) => handleSubmit(e, "add-note")}>
                  <label>Subject</label>
                  <Input
                    value={input.note.subject}
                    placeholder="Subject here"
                    onChange={(e) => {
                      setInput({
                        ...input,
                        note: { ...input.note, subject: e.target.value },
                      });
                    }}
                    required
                    minLength={5}
                  />
                  <label className="mt-1">Note</label>
                  <Input.TextArea
                    value={input.note.content}
                    maxLength={2000}
                    placeholder="Content here"
                    style={{ resize: "none", minHeight: "15rem" }}
                    onChange={(e) => {
                      setInput({
                        ...input,
                        note: { ...input.note, content: e.target.value },
                      });
                    }}
                    required
                  ></Input.TextArea>
                  <Alert
                    className="mt-2"
                    message="Your note's content shouldn't be more than 2000 characters"
                    type="info"
                    showIcon
                    style={{ width: "50%" }}
                  />
                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      className="bg-danger text-white"
                      onClick={() => {
                        setStatus({ ...status, addNote: false });
                      }}
                    >
                      Close
                    </Button>
                    <Button type="primary" htmlType="submit">
                      Save Note
                    </Button>
                  </div>
                </form>
              )}
            </>
          )}
        </ul>
      </div>
    );
  };

  const activityFiles = () => {
    return (
      <div>
        {selectedActivity.filePaths.length > 0 ? (
          <div className="w-100 d-flex flex-column">
            {!status.uploadFile && (
              <Button
                className="d-block"
                icon={<PlusCircleOutlined />}
                type="primary"
                onClick={() => {
                  setStatus({ ...status, uploadFile: true });
                }}
                style={{ maxWidth: "20%" }}
              >
                Add File
              </Button>
            )}

            {!status.uploadFile && (
              <ul className="d-flex flex-column col-9 ps-5 mt-2">
                {selectedActivity.filePaths.map((file) => (
                  <li className="text-truncate d-flex align-items-center">
                    <small className="text-truncate">{file}</small>
                    <a
                      href={`${apiUrl}/uploads/${file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ms-3"
                      download
                    >
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {status.uploadFile && (
              <form>
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={() => {
                    document.getElementById("files").click();
                  }}
                >
                  Attach File
                </Button>
                <div className="w-100 row">
                  {files.length > 0 ? (
                    <ul className="d-flex flex-column col-9 ps-5">
                      {Array.from(files).map((file) => (
                        <li className="text-truncate">{file.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="d-flex flex-column">
                      <small className="ms-2 text-danger">
                        No file Uploaded
                      </small>
                      <Button
                        className="bg-danger text-white mt-5"
                        style={{ maxWidth: "20%" }}
                        onClick={() => {
                          setStatus({ ...status, uploadFile: false });
                        }}
                      >
                        Close
                      </Button>
                    </div>
                  )}
                  {files.length > 0 && (
                    <Button className="col-3" onClick={uploadFile}>
                      Save
                    </Button>
                  )}
                </div>

                <input
                  hidden
                  multiple
                  type="file"
                  id="files"
                  onChange={(e) => {
                    setFiles(e.target.files);
                  }}
                />
              </form>
            )}
          </div>
        ) : (
          <div className="d-flex flex-column">
            {!status.uploadFile && (
              <>
                <small className="text-center mt-5 text-danger">
                  You haven't uploaded any file yet.
                </small>
                <Button
                  className="mx-auto d-block"
                  icon={<PlusCircleOutlined />}
                  type="primary"
                  onClick={() => {
                    setStatus({ ...status, uploadFile: true });
                  }}
                >
                  Add File
                </Button>
              </>
            )}

            {status.uploadFile && (
              <form>
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={() => {
                    document.getElementById("files").click();
                  }}
                >
                  Attach File
                </Button>
                <div className="w-100 row">
                  {files.length > 0 ? (
                    <ul className="d-flex flex-column col-9 ps-5">
                      {Array.from(files).map((file) => (
                        <li className="text-truncate">{file.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="d-flex flex-column">
                      <small className="ms-2 text-danger">
                        No file Uploaded
                      </small>
                      <Button
                        className="bg-danger text-white mt-5"
                        style={{ maxWidth: "20%" }}
                        onClick={() => {
                          setStatus({ ...status, uploadFile: false });
                        }}
                      >
                        Close
                      </Button>
                    </div>
                  )}
                  {files.length > 0 && (
                    <Button className="col-3" onClick={uploadFile}>
                      Save
                    </Button>
                  )}
                </div>

                <input
                  hidden
                  multiple
                  type="file"
                  id="files"
                  onChange={(e) => {
                    setFiles(e.target.files);
                  }}
                />
              </form>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-100">
      <h5 className="text-center">My Activity</h5>
      <div className="mx-auto" style={{ maxWidth: "80%" }}>
        {myActivities.length != 0 ? (
          <div className="w-100">
            <AntdTable columns={columns} data={myActivities} />
          </div>
        ) : (
          <div className="w-50 mx-auto d-flex flex-column justify-content-center align-items-center mt-3 border rounded p-3">
            <small className="text-center text-danger mt-2">
              You haven't interacted with any Course or Lesson Yet
            </small>
            <Button
              type="primary"
              className="mt-3"
              onClick={() => {
                setShowAddActivityModal(true);
              }}
            >
              Add an activity
            </Button>
          </div>
        )}
      </div>
      <Modal
        open={showAddActivityModal}
        maskClosable={false}
        title="Start a new activity"
        onCancel={() => {
          setShowAddActivityModal(false);
        }}
        style={{ width: "80%" }}
        footer={[]}
      >
        {showAddActivityModal && (
          <form
            className="d-flex flex-column justify-content-center"
            onSubmit={(e) => handleSubmit(e, "activity")}
          >
            <label>Choose course</label>
            <Select
              value={input.course}
              onChange={(val) => {
                setInput({ ...input, course: val });
                setStatus({ ...status, inputs: {} });
                setFiltLessons(
                  myLessons.filter((lesson) => lesson.course == val)
                );
              }}
              status={status.inputs.course}
            >
              {myFinalCourses.map((course) => (
                <Select.Option value={course._id}>{course.title}</Select.Option>
              ))}
            </Select>
            <label className="mt-2">Choose a lesson (optional)</label>
            <Select
              value={input.lesson}
              onChange={(val) => {
                setInput({ ...input, lesson: val });
                setStatus({ ...status, inputs: {} });
              }}
              status={status.inputs.lesson}
            >
              {filtLessons.map((lesson) => (
                <Select.Option value={lesson._id}>{lesson.title}</Select.Option>
              ))}
            </Select>
            <Button
              className="mx-auto mt-2"
              type="primary"
              htmlType="submit"
              style={{ maxWidth: "10rem" }}
            >
              Start
            </Button>
          </form>
        )}
      </Modal>

      <Modal
        open={showViewActivityModal}
        maskClosable={false}
        title="View activity"
        onCancel={() => {
          setShowViewActivityModal(false);
        }}
        style={{
          minWidth: "80vw",
          maxWidth: "1000px !important",
          minHeight: "30rem !important",
          maxHeight: "50rem !important",
          height: "auto",
        }}
        className="text-center"
        footer={[]}
      >
        {showViewActivityModal && (
          <div className="w-100">
            <Tabs
              tabPosition="left"
              items={[
                {
                  key: "1",
                  label: "Activity",
                  children: activityDetails(),
                },
                {
                  key: "2",
                  label: "My Notes",
                  children: activityNotes(),
                },
                {
                  key: "3",
                  label: "My Files",
                  children: activityFiles(),
                },
              ]}
              className="text-start"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyActivity;
