import { Button, Input, Modal, Popconfirm, Select, message } from "antd";
import AntdTable from "../../components/AntdTable";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { PlusCircleFilled } from "@ant-design/icons";
import { fetcher } from "../../_services";
import { setCourses } from "../../store/store";
import { useDispatch } from "react-redux";
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
      title: "Course Id",
      dataIndex: "id",
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
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      render(item) {
        return (
          <div>
            <Button
              onClick={() => {
                setSelectedCourse(item);
                setAssignedTeachers(item.teachers);
                setShowViewModal(true);
              }}
            >
              View More
            </Button>
          </div>
        );
      },
    },
  ];

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [filterBy, setFilterBy] = useState("name");
  const [filterCondition, setFilterCondition] = useState("");
  const departments = useSelector((state) => state.myReducer.departments);
  const courses = useSelector((state) => state.myReducer.courses);
  const initialCourses = courses;
  const [filteredCourses, setFilteredCourses] = useState(courses);
  const teachers = useSelector((state) => state.myReducer.users).filter(
    (user) => user.role == "teacher" && user.account_status == "active"
  );
  const [assignedTeachers, setAssignedTeachers] = useState([]);
  const [status, setStatus] = useState({ inputs: { name: "", courseid: "" } });
  const [input, setInput] = useState({
    name: "",
    courseid: "",
    department: "",
  });

  const filterData = () => {
    const filtered = initialCourses.filter((course) => {
      const result =
        filterBy !== "name" && filterBy !== "id"
          ? course[filterBy] == filterCondition
          : filterBy == "name"
          ? course["title"]
              .toLowerCase()
              .includes(filterCondition.toLowerCase())
          : course["id"].toLowerCase().includes(filterCondition.toLowerCase());
      return result;
    });
    setFilteredCourses(filtered);
  };

  useEffect(() => {
    filterCondition == "" ? setFilteredCourses(initialCourses) : filterData();
  }, [filterCondition]);

  const handleChange = (e) => {
    setStatus({ ...status, inputs: {} });
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleSubmit = (e, type) => {
    e.preventDefault();
    checkCourse().then((res) => {
      if (res == "name") {
        setStatus({ ...status, inputs: { ...status.input, name: "error" } });
      } else if (res == "id") {
        setStatus({
          ...status,
          inputs: { ...status.input, courseid: "error" },
        });
      } else {
        type == "Add" ? createNewCourse() : updateCourse();
      }
    });
  };

  const createNewCourse = () => {
    const result = fetcher("create-course", "post", input);
    result
      .then((res) => {
        message.success("Course Successfully Created!");
        getCourses();
        setInput({});
        setShowAddModal(false);
      })
      .catch((err) => {
        message.error("Some Error Occrred!");
      });
  };

  const updateCourse = () => {
    fetch(`${apiUrl}/update-course/${selectedCourse._id}`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
      .then((res) => res.json())
      .then((res) => {
        message.success("Course Successfully Updated!");
        getCourses();
        setInput({});
        setShowEditModal(false);
      })
      .catch((err) => {
        message.error("Some Error Occrred!");
      });
  };

  const deleteCourse = () => {
    fetch(`${apiUrl}/delete-course/${selectedCourse._id}`)
      .then((res) => res.json())
      .then((res) => {
        message.success("Course Successfully Deleted!");
        getCourses();
        setInput({});
        setShowViewModal(false);
      })
      .catch((err) => {
        message.error("Some Error Occrred!");
      });
  };

  const getCourses = async () => {
    await fetcher("get-courses").then((res) => {
      const courses = res.result;
      dispatch(setCourses(courses));
      setFilteredCourses(courses);
    });
  };

  const checkCourse = () => {
    return fetch(`${apiUrl}/filterCourseByName`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res && res.result && res.result.length > 0) return "name";
        else {
          return fetch(`${apiUrl}/filterCourseById`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
          })
            .then((res) => res.json())
            .then((res) => {
              if (res && res.result && res.result.length > 0) return "id";
              else return false;
            });
        }
      });
  };

  const assignTeacherToCourse = () => {
    fetch(`${apiUrl}/assign-teacher-to-course/${selectedCourse._id}`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teachers: JSON.stringify(assignedTeachers) }),
    })
      .then((res) => res.json())
      .then((res) => {
        message.success("Teacher Assigned Successfully!");
        getCourses();
        setInput({});
        setAssignedTeachers([]);
        setShowAssignModal(false);
      })
      .catch((err) => {
        message.error("Some Error Occrred!");
      });
  };

  const releaseCourse = () => {
    fetch(`${apiUrl}/release-course/${selectedCourse._id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.result) {
          message.success("Course is Successfully Released!");
          setShowViewModal(false);
          getCourses();
        }
      })
      .catch((err) => {
        message.error("Some Error Occrred!");
      });
  };

  return (
    <div className="w-100">
      <h5 className="text-center">Courses</h5>
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
            Add Course
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
                setFilteredCourses(initialCourses);
                setFilterCondition("");
              }}
            >
              <Select.Option value="name">Name</Select.Option>
              <Select.Option value="id">Course ID</Select.Option>
              <Select.Option value="department">Department</Select.Option>
              <Select.Option value="status">Status</Select.Option>
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
            {filterBy == "id" && (
              <Input
                onChange={(e) => {
                  setFilterCondition(e.target.value);
                }}
                value={filterCondition}
              />
            )}
            {filterBy == "department" && (
              <Select
                value={filterCondition}
                onChange={(val) => {
                  setFilterCondition(val);
                }}
              >
                {departments.map((department) => (
                  <Select.Option value={department.value}>
                    {department.name}
                  </Select.Option>
                ))}
              </Select>
            )}

            {filterBy == "status" && (
              <Select
                value={filterCondition}
                onChange={(val) => {
                  setFilterCondition(val);
                }}
              >
                <Select.Option value={"active"}>active</Select.Option>
                <Select.Option value={"not-active"}>not-active</Select.Option>
              </Select>
            )}
          </div>
        </div>
      </div>
      <AntdTable columns={columns} data={filteredCourses} width="80%" />
      <Modal
        open={showViewModal}
        title={<p className="text-center m-0">View Course</p>}
        onCancel={() => {
          setShowViewModal(false);
          setAssignedTeachers(selectedCourse.teachers);
        }}
        footer={[]}
      >
        {showViewModal && (
          <div className="d-flex flex-column justify-content-center align-items-center">
            <ul className="mt-2" style={{ width: "60%" }}>
              <li>Name : {selectedCourse.title}</li>
              <li>Course id : {selectedCourse.id}</li>
              <li>
                Department :{" "}
                {
                  departments.filter(
                    (dept) => dept.value == selectedCourse.department
                  )[0].name
                }
              </li>
              {selectedCourse.status == "active" && (
                <li>
                  Total Assigned Teachers : {selectedCourse.teachers.length}
                </li>
              )}
              {selectedCourse.status == "active" && (
                <li>
                  Assigned Teachers :{" "}
                  {selectedCourse.teachers.map((course) => (
                    <small className="fw-bold">
                      {
                        teachers.filter((teacher) => teacher._id == course)[0]
                          .name
                      }{" "}
                      &nbsp;,&nbsp;
                    </small>
                  ))}
                </li>
              )}
            </ul>
            <div
              className="d-flex justify-content-between align-items-center"
              style={{ minWidth: "30%", minHeight: "2rem" }}
            >
              <Button
                type="primary"
                onClick={() => {
                  setShowViewModal(false);
                  setInput({
                    ...input,
                    name: selectedCourse.title,
                    courseid: selectedCourse.id,
                    department: selectedCourse.department,
                  });
                  setShowEditModal(true);
                }}
              >
                Edit
              </Button>
              {selectedCourse.status == "active" && (
                <Button
                  onClick={() => {
                    setShowViewModal(false);
                    setShowAssignModal(true);
                  }}
                  className="mx-2 bg-secondary text-white"
                >
                  Assign Teacher
                </Button>
              )}
              {selectedCourse.status !== "active" && (
                <Popconfirm
                  title="Release Course ?"
                  okText="Yes"
                  onConfirm={releaseCourse}
                >
                  <Button className="mx-2 bg-secondary text-white">
                    Release Course
                  </Button>
                </Popconfirm>
              )}
              <Popconfirm
                onConfirm={() => deleteCourse()}
                title="Delete Department ?"
                okText="Yes"
              >
                <Button className="bg-danger text-white">Delete</Button>
              </Popconfirm>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={showAddModal}
        title={<p className="text-center m-0">Add Course</p>}
        onCancel={() => {
          setShowAddModal(false);
        }}
        maskClosable={false}
        footer={[]}
      >
        {showAddModal && (
          <form onSubmit={(e) => handleSubmit(e, "Add")}>
            <label>Name</label>
            <Input
              name="name"
              id="name"
              value={input.name}
              onChange={handleChange}
              status={status.inputs.name}
              required
            />
            <label className="mt-2">Course ID</label>
            <Input
              name="courseid"
              id="courseid"
              value={input.courseid}
              onChange={handleChange}
              status={status.inputs.courseid}
              required
            />
            <label className="mt-2 d-block">Department</label>
            <Select
              onChange={(val) => {
                setInput({ ...input, department: val });
              }}
              value={input.department}
              className="w-100"
            >
              {departments.map((department, index) => (
                <Select.Option key={index} value={department.value}>
                  {department.name}
                </Select.Option>
              ))}
            </Select>

            <Button
              className="mx-auto d-block mt-2"
              style={{ width: "10rem" }}
              type="primary"
              htmlType="submit"
            >
              Save
            </Button>
          </form>
        )}
      </Modal>

      <Modal
        open={showEditModal}
        title={<p className="text-center m-0">Edit Course</p>}
        onCancel={() => {
          setShowEditModal(false);
        }}
        footer={[]}
        maskClosable={false}
      >
        {showEditModal && (
          <form onSubmit={(e) => handleSubmit(e, "Edit")}>
            <label>Name</label>
            <Input
              name="name"
              id="name"
              value={input.name}
              onChange={handleChange}
              status={status.inputs.name}
              required
            />
            <label className="mt-2">Course ID</label>
            <Input
              name="courseid"
              id="courseid"
              value={input.courseid}
              onChange={handleChange}
              status={status.inputs.courseid}
              required
            />
            <label className="mt-2 d-block">Department</label>
            <Select
              onChange={(val) => {
                setInput({ ...input, department: val });
              }}
              value={input.department}
              className="w-100"
            >
              {departments.map((department, index) => (
                <Select.Option key={index} value={department.value}>
                  {department.name}
                </Select.Option>
              ))}
            </Select>

            <Button
              className="mx-auto d-block mt-2"
              style={{ width: "10rem" }}
              type="primary"
              htmlType="submit"
              disabled={
                input.name == selectedCourse.title &&
                input.courseid == selectedCourse.id &&
                input.department == selectedCourse.department
              }
            >
              Save
            </Button>
          </form>
        )}
      </Modal>

      <Modal
        open={showAssignModal}
        title={<p className="text-center m-0">Assign Teacher</p>}
        onCancel={() => {
          setShowAssignModal(false);
        }}
        maskClosable={false}
        okText="Done"
        onOk={assignTeacherToCourse}
        okButtonProps={{ disabled: assignedTeachers.length == 0 }}
      >
        {showAssignModal && (
          <Select
            onChange={(val) => {
              !assignedTeachers.includes(val[val.length - 1]) &&
                setAssignedTeachers([...assignedTeachers, val[val.length - 1]]);
            }}
            value={assignedTeachers}
            mode="multiple"
            style={{ width: "80%" }}
            className="mx-auto d-block"
            onDeselect={(v) => {
              setAssignedTeachers(
                assignedTeachers.filter((teacher) => teacher != v)
              );
            }}
          >
            {teachers.map((teacher, index) => (
              <Select.Option key={index} value={teacher._id}>
                {teacher.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Modal>
    </div>
  );
};

export default Courses;
