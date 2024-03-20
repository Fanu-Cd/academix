import { useSelector } from "react-redux";
import AntdTable from "../../components/AntdTable";
import { useEffect, useState } from "react";
import { Input, Select } from "antd";

const MyCourses = () => {
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
      title: "My Lessons",
      render(item) {
        return myLessons.filter((lesson) => lesson.course == item._id).length;
      },
    },
  ];

  const allCourses = useSelector((state) => state.myReducer.courses);
  const allLessons = useSelector((state) => state.myReducer.lessons);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const myCourses = allCourses.filter((course) =>
    course.teachers.includes(currentUser._id)
  );
  const [filteredCourses, setFilteredCourses] = useState(myCourses);
  const [filterBy, setFilterBy] = useState("title");
  const [filterCondition, setFilterCondition] = useState("");

  const myLessons = allLessons
    ? allLessons.filter((lesson) => lesson.uploadedBy == currentUser._id)
    : [];
  console.log(myCourses);

  const filterData = () => {
    console.log(myCourses, filterBy, filterCondition);
    const filtered =
      filterBy == "title"
        ? myCourses.filter((course) => course.title.toLowerCase().includes(filterCondition.toLowerCase()))
        : myCourses.filter((course) => course.id.toLowerCase().includes(filterCondition.toLowerCase()));
    setFilteredCourses(filtered);
  };

  useEffect(() => {
    if (!filterCondition) setFilteredCourses(myCourses);
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
