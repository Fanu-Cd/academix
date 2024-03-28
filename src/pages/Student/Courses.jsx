import { useSelector, useDispatch } from "react-redux";
import AntdTable from "../../components/AntdTable";
import { useEffect, useState } from "react";
import { Button, Input, Popconfirm, Select, message } from "antd";
import { fetcher } from "../../_services";
import { setCourseRegs } from "../../store/store";
import API_URL from "../../apiUrl";

const Courses = () => {
  const apiUrl = API_URL;

  const dispatch = useDispatch();
  const columns = [
    {
      title: "Name",
      dataIndex: "title",
    },
    {
      title: "Course ID",
      dataIndex: "id",
    },
    {
      title: "Activity",
      dataIndex: "status",
    },
    {
      title: "My Status",
      render(item) {
        const isRegistered =
          courseRegs.filter(
            (cr) => cr.user == currentUser._id && cr.course == item._id
          ).length != 0;

        return item.status == "active" ? (
          isRegistered ? (
            <small className="text-success">Registered</small>
          ) : (
            <Popconfirm
              title="Register for course ?"
              onConfirm={() => {
                registerForCourse(item);
              }}
            >
              <Button type="primary">Register</Button>
            </Popconfirm>
          )
        ) : (
          "-"
        );
      },
    },
    {
      title: "Total Lessons",
      render(item) {
        const totalLesson = myLessons.filter(
          (lesson) => lesson.course == item._id
        ).length;
        return totalLesson;
      },
    },
  ];

  const getCourseRegs = () => {
    fetcher("get-course-regs").then((res) => {
      const regs = res.result;
      dispatch(setCourseRegs(regs));
    });
  };

  const registerForCourse = ({ _id }) => {
    const uid = currentUser._id;
    fetch(`${apiUrl}/register-for-course`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: uid, courseid: _id }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res && res.result) {
          message.success("Successfully Registered For Course !");
          setTimeout(() => {
            getCourseRegs();
          }, 500);
        }
      });
  };

  const allCourses = useSelector((state) => state.myReducer.courses);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const courseRegs = useSelector((state) => state.myReducer.courseRegs);

  const myCourses = allCourses.filter(
    (course) => course.department == currentUser.department
  );

  const allLessons = useSelector((state) => state.myReducer.lessons);
  const myLessons = allLessons.filter((lesson) => {
    const isOfMyCourse = myCourses.filter(
      (course) => course._id == lesson.course
    );
    return isOfMyCourse;
  });

  const [filteredCourses, setFilteredCourses] = useState(myCourses);
  const [filterBy, setFilterBy] = useState("title");
  const [filterCondition, setFilterCondition] = useState("");

  const filterData = () => {
    const filtered =
      filterBy == "title"
        ? myCourses.filter((course) =>
            course.title.toLowerCase().includes(filterCondition.toLowerCase())
          )
        : myCourses.filter((course) =>
            course.id.toLowerCase().includes(filterCondition.toLowerCase())
          );
    setFilteredCourses(filtered);
  };

  useEffect(() => {
    if (!filterCondition) setFilteredCourses(myCourses);
    else filterData();
  }, [filterCondition]);

  return (
    <div className="w-100">
      <h5 className="text-center">All Courses</h5>
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
      <AntdTable columns={columns} data={filteredCourses} width="80%" />
    </div>
  );
};

export default Courses;
