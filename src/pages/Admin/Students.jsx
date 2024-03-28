import { useSelector } from "react-redux";
import AntdTable from "../../components/AntdTable";
import { useState } from "react";

const Students = () => {
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
      title: "Grade",
      dataIndex: "grade",
    },
  ];

  const students = useSelector((state) => state.myReducer.users).filter(
    (user) => user.role == "student" && user.account_status == "active"
  );
  const departments = useSelector((state) => state.myReducer.departments);
  const [filteredStudents, setFilteredStudents] = useState(students);

  return (
    <div className="w-100">
      <h5 className="text-center">Students</h5>
      <AntdTable columns={columns} data={filteredStudents} width="80%" />
    </div>
  );
};
export default Students;
