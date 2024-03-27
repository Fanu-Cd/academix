import { Button, Input, Modal, Select, message } from "antd";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AntdTable from "../../components/AntdTable";
import { fetcher } from "../../_services";
import { setStudentActivities } from "../../store/store";
import API_URL from "../../apiUrl";

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
        const lesson = item.lesson
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
  // console.log("myLessons", myLessons);

  const activities = useSelector((state) => state.myReducer.studentActivities);
  const myActivities = activities.filter(
    (activity) => activity.student == currentUser._id
  );
  console.log("myacvities", myActivities);

  const notes = useSelector((state) => state.myReducer.studentNotes);

  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showViewActivityModal, setShowViewActivityModal] = useState(false);

  const [filtLessons, setFiltLessons] = useState([]);
  const [input, setInput] = useState({ course: "", lesson: "" });
  const [status, setStatus] = useState({ inputs: { course: "", lesson: "" } });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(input);
    if (!input.course) {
      setStatus({ ...status, inputs: { ...status.inputs, course: "error" } });
    } else {
      createNewActivity();
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

  const getStudentActivities = () => {
    fetcher("get-all-student-activities")
      .then((res) => {
        const activities = res.result;
        dispatch(setStudentActivities(activities));
      })
      .catch((err) => {
        console.log("Getting Student Activity ERROR", err);
      });
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
            onSubmit={handleSubmit}
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
        style={{ width: "90vw !important" }}
        footer={[]}
      >
        {showViewActivityModal && 
        <div className="w-100"></div>
        }
      </Modal>
    </div>
  );
};

export default MyActivity;
