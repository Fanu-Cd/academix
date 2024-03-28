import { useDispatch, useSelector } from "react-redux";
import AntdTable from "../../components/AntdTable";
import { useEffect, useState } from "react";
import { Button, Input, Popconfirm, Select, message } from "antd";
import { fetcher } from "../../_services";
import { setCourseRegs } from "../../store/store";
import API_URL from "../../apiUrl";

const MyCourses = () => {
  const apiUrl = API_URL;
  const [error, setError] = useState(false);
  useEffect(() => {
    if (error) message.error("Fetching Data Error !");
  }, [error]);

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
      title: "Registered in",
      render(item) {
        const courseReg = courseRegs.filter((cr) => cr.course == item._id)[0];
        return courseReg.createdAt.split("T")[0];
      },
    },
    {
      title: "My Status",
      render(item) {
        const courseReg = courseRegs.filter((cr) => cr.course == item._id)[0];
        const { createdAt, updatedAt } = courseReg;
        const timeLapse =
          new Date(updatedAt).getDate() - new Date(createdAt).getDate();
        return `${courseReg.status} ${
          courseReg.status == "finished"
            ? "( in " +
              timeLapse +
              " " +
              (timeLapse > 1 ? "days" : "day ") +
              ")"
            : ""
        }`;
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
    {
      title: "Actions",
      render(item) {
        const courseReg =
          courseRegs && courseRegs.filter((cr) => cr.course == item._id)[0];
        return (
          courseReg.status == "registered" && (
            <Popconfirm
              title="Finish this course ?"
              onConfirm={() => {
                updateCourseReg(courseReg, "finished");
              }}
            >
              <Button type="primary">Finish</Button>
            </Popconfirm>
          )
        );
      },
    },
  ];

  const updateCourseReg = (courseReg, status) => {
    fetch(`${apiUrl}/update-course-reg/${courseReg._id}`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: status }),
    })
      .then((res) => res.json())
      .then((res) => {
        getCourseRegs();
      })
      .catch((err) => {
        console.log("error", err);
        setError(true);
      });
  };

  const allCourses = useSelector((state) => state.myReducer.courses);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const myCourses = allCourses.filter(
    (course) => course.department == currentUser.department
  );

  const courseRegs = useSelector((state) => state.myReducer.courseRegs);
  const myCourseRegs = courseRegs.filter((cr) => cr.user == currentUser._id);

  const myFinalCourses = myCourses.filter((course) => {
    let isInMyCourseRegs = myCourseRegs.filter((cr) => cr.course == course._id);
    return isInMyCourseRegs;
  });

  const allLessons = useSelector((state) => state.myReducer.lessons);
  const myLessons = allLessons.filter((lesson) => {
    const isOfMyCourse = myCourses.filter(
      (course) => course._id == lesson.course
    );
    return isOfMyCourse;
  });

  const [filteredCourses, setFilteredCourses] = useState(myFinalCourses);
  const [filterBy, setFilterBy] = useState("title");
  const [filterCondition, setFilterCondition] = useState("");

  const dispatch = useDispatch();

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

  const getCourseRegs = () => {
    fetcher("get-course-regs").then((res) => {
      const regs = res.result;
      dispatch(setCourseRegs(regs));
    });
  };

  useEffect(() => {
    if (!filterCondition) setFilteredCourses(myFinalCourses);
    else filterData();
  }, [filterCondition]);

  return (
    <div className="w-100">
      <h5 className="text-center">My Courses</h5>
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

export default MyCourses;
