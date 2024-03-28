import { useSelector } from "react-redux";
import AntdTable from "../../components/AntdTable";
import { useState } from "react";

const Teachers = () => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Department",
      render(item) {
        return departments
          ? departments.filter((dept) => dept.value == item.department)[0].name
          : "";
      },
    },
    {
      title: "Assigned Courses",
      render(item) {
        const assignedCourses = courses.filter((course) =>
          course.teachers.includes(item._id)
        );
        return assignedCourses.map((ab) => (
          <small className="fw-bold">{ab.title}&nbsp;,&nbsp;</small>
        ));
      },
    },
  ];

  const teachers = useSelector((state) => state.myReducer.users).filter(
    (user) => user.role == "teacher" && user.account_status == "active"
  );
  const departments = useSelector((state) => state.myReducer.departments);
  const courses = useSelector((state) => state.myReducer.courses);
  const [filteredTeachers, setFilteredTeachers] = useState(teachers);

  return (
    <div className="w-100">
      <h5 className="text-center">Teachers</h5>
      <AntdTable columns={columns} data={filteredTeachers} width="80%" />
    </div>
  );
};
export default Teachers;
