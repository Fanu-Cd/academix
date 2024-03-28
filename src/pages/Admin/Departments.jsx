import { Button, Input, Modal, Popconfirm, Select, message } from "antd";
import AntdTable from "../../components/AntdTable";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { PlusCircleFilled } from "@ant-design/icons";
import { fetcher } from "../../_services";
import { setDepartments } from "../../store/store";
import { useDispatch } from "react-redux";
import API_URL from "../../apiUrl";
const Departments = () => {
  const apiUrl = API_URL;

  const dispatch = useDispatch();
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Actions",
      render(item) {
        return (
          <div>
            <Button
              onClick={() => {
                setSelectedDept(item);
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

  const [selectedDept, setSelectedDept] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterBy, setFilterBy] = useState("name");
  const [filterCondition, setFilterCondition] = useState("");

  const departments = useSelector((state) => state.myReducer.departments);
  const courses = useSelector((state) => state.myReducer.courses);
  const initialDepts = departments;
  const [filteredDepts, setFilteredDepts] = useState(departments);

  const [status, setStatus] = useState({ inputs: { name: "" } });
  const [input, setInput] = useState({ name: "" });

  const filterData = () => {
    const filtered = initialDepts.filter((dept) =>
      filterBy !== "name"
        ? dept[filterBy] == filterCondition
        : dept["name"].toLowerCase().includes(filterCondition.toLowerCase())
    );
    setFilteredDepts(filtered);
  };

  useEffect(() => {
    filterCondition == "" ? setFilteredDepts(initialDepts) : filterData();
  }, [filterCondition]);

  const handleChange = (e) => {
    setStatus({ ...status, inputs: {} });
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleSubmit = (e, type) => {
    e.preventDefault();
    checkDept().then((res) => {
      if (res) {
        setStatus({ ...status, inputs: { ...status.input, name: "error" } });
      } else {
        type == "Add" ? createNewDept() : updateDept();
      }
    });
  };

  const createNewDept = () => {
    const result = fetcher("create-department", "post", input);
    result
      .then((res) => {
        message.success("Department Successfully Created!");
        getDepartments();
        setInput({});
        setShowAddModal(false);
      })
      .catch((err) => {
        message.error("Some Error Occrred!");
      });
  };

  const updateDept = () => {
    fetch(`${apiUrl}/update-department/${selectedDept.value}`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
      .then((res) => res.json())
      .then((res) => {
        message.success("Department Successfully Updated!");
        getDepartments();
        setInput({});
        setShowEditModal(false);
      })
      .catch((err) => {
        message.error("Some Error Occrred!");
      });
  };

  const deleteDept = () => {
    fetch(`${apiUrl}/delete-department/${selectedDept.value}`)
      .then((res) => res.json())
      .then((res) => {
        message.success("Department Successfully Deleted!");
        getDepartments();
        setInput({});
        setShowViewModal(false);
      })
      .catch((err) => {
        message.error("Some Error Occrred!");
      });
  };

  const getDepartments = async () => {
    await fetcher("get-departments").then((res) => {
      const depts = res.result;
      const myDept = [];
      depts.map((dept) => myDept.push({ name: dept.title, value: dept._id }));
      dispatch(setDepartments(myDept));
      setFilteredDepts(myDept);
    });
  };

  const checkDept = () => {
    return fetch(`${apiUrl}/filterDeptByName`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res && res.result && res.result.length > 0) return true;
        else return false;
      });
  };

  return (
    <div className="w-100">
      <h5 className="text-center">Departments</h5>
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
            Add Department
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
              onChange={(val) => {
                setFilterBy(val);
                setFilteredDepts(initialDepts);
                setFilterCondition("");
              }}
              className="ms-2"
            >
              <Select.Option value="name">Name</Select.Option>
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
          </div>
        </div>
      </div>
      <AntdTable columns={columns} data={filteredDepts} width="80%" />
      <Modal
        open={showViewModal}
        title={<p className="text-center m-0">View Department</p>}
        onCancel={() => {
          setShowViewModal(false);
        }}
        footer={[]}
      >
        {showViewModal && (
          <div className="d-flex flex-column justify-content-center align-items-center">
            <ul className="mt-2" style={{ width: "60%" }}>
              <li>Name : {selectedDept.name}</li>
              <li>
                Total Courses :{" "}
                {
                  courses.filter(
                    (course) => course.department == selectedDept.value
                  ).length
                }
              </li>
              <li>
                Courses :{" "}
                {courses.filter(
                  (course) => course.department == selectedDept.value
                ).length > 0
                  ? courses
                      .filter(
                        (course) => course.department == selectedDept.value
                      )
                      .map((course) => (
                        <small className="fw-bold">
                          {course.title} &nbsp;,&nbsp;
                        </small>
                      ))
                  : "-"}
              </li>
            </ul>
            <div
              className="d-flex justify-content-between align-items-center"
              style={{ width: "30%", minHeight: "2rem" }}
            >
              <Button
                type="primary"
                onClick={() => {
                  setShowViewModal(false);
                  setInput({ ...input, name: selectedDept.name });
                  setShowEditModal(true);
                }}
              >
                Edit
              </Button>
              <Popconfirm
                onConfirm={() => deleteDept()}
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
        title={<p className="text-center m-0">Add Department</p>}
        onCancel={() => {
          setShowAddModal(false);
        }}
        maskClosable={false}
        footer={[]}
      >
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
          <Button
            className="mx-auto d-block mt-2"
            style={{ width: "10rem" }}
            type="primary"
            htmlType="submit"
          >
            Save
          </Button>
        </form>
      </Modal>

      <Modal
        open={showEditModal}
        title={<p className="text-center m-0">Edit Department</p>}
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

            <Button
              className="mx-auto d-block mt-2"
              style={{ width: "10rem" }}
              type="primary"
              htmlType="submit"
              disabled={selectedDept && selectedDept.name == input.name}
            >
              Save
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Departments;
