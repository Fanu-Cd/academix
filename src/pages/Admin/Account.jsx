import AntdTable from "../../components/AntdTable";
import { useSelector, useDispatch } from "react-redux";
import { renderStatus, sendEmail } from "../../_services";
import { Avatar, Button, Input, Modal, Select, message } from "antd";
import { useEffect, useState } from "react";
import { PlusCircleFilled, UserOutlined } from "@ant-design/icons";
import { fetcher } from "../../_services";
import { setUsers } from "../../store/store";
import { validateEmail, matchValues } from "../../_services";
import API_URL from "../../apiUrl";

const Account = () => {
  const apiUrl = API_URL;

  const dispatch = useDispatch();
  const users = useSelector((state) => state.myReducer.users);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [filteredUsers, setFilteredUsers] = useState(
    users && users.filter((user) => user._id != currentUser._id)
  );
  const initialUsers =
    users && users.filter((user) => user._id != currentUser._id);

  const departments = useSelector((state) => state.myReducer.departments);
  const roles = [
    { name: "Student", value: "student" },
    { name: "Teacher", value: "teacher" },
  ];
  const account_status = [
    { name: "Not Approved", value: "not-approved" },
    { name: "Active", value: "active" },
    { name: "Banned", value: "banned" },
    { name: "Deleted", value: "deleted" },
  ];
  const [showManageModal, setShowManageModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterBy, setFilterBy] = useState("name");
  const [filterCondition, setFilterCondition] = useState("");

  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
    grade: "9",
    role: "student",
    department: "",
  });

  const [status, setStatus] = useState({
    inputs: {
      name: "",
      email: "",
      password: "",
      cpassword: "",
      role: "",
      department: "",
      grade: "",
    },
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Department",
      render(item) {
        return departments && item.department
          ? departments.filter((dept) => dept.value == item.department)[0].name
          : "";
      },
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Account Status",
      render(item) {
        return renderStatus(item.account_status);
      },
    },
    {
      title: "Actions",
      render(item) {
        return (
          <div>
            <Button
              onClick={() => {
                setShowManageModal(true);
                setSelectedUser(
                  users.filter((user) => user._id == item._id)[0]
                );
              }}
            >
              Manage
            </Button>
          </div>
        );
      },
    },
  ];

  const updateAccount = (user, status) => {
    const statusWord =
      status == "active"
        ? "Activated"
        : status == "declined"
        ? "Declined"
        : "Deactivated";

    const message = `${
      statusWord == "active"
        ? `Congratulations! Your account has been successfully ${statusWord}. You
          can now enjoy our services.`
        : `Your Account, has been ${statusWord} by your system administrator.`
    }`;

    const html = `
    <h1>Your Account Has Been ${statusWord}</h1>
    <p>${message}</p>
    <p>If you have any questions, feel free to contact us.</p>`;

    const model = {
      account_status: status,
    };

    fetch(`${apiUrl}/update-user/${user._id}`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(model),
    })
      .then((res) => res.json())
      .then(async (res) => {
        await sendEmail(
          true,
          html,
          "Account Status Update",
          "",
          selectedUser.email
        );
        getUsers();
        setShowManageModal(false);
      });
  };


  const getUsers = async () => {
    await fetcher("get-users").then((res) => {
      const users = res.result;
      dispatch(setUsers(users));
      setFilteredUsers(
        users && users.filter((user) => user._id != currentUser._id)
      );
    });
  };

  const filterData = () => {
    const filtered = initialUsers.filter((user) =>
      filterBy !== "name"
        ? user[filterBy] == filterCondition
        : user["name"].toLowerCase().includes(filterCondition.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const grades = [
    { name: "9", value: "nine" },
    { name: "10", value: "ten" },
  ];

  const handleChange = (e) => {
    setStatus({ ...status, inputs: {} });
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleRoleChange = (role) => {
    setInput({ ...input, role: role });
  };

  const handleDeptChange = (dept) => {
    setInput({ ...input, department: dept });
  };

  const handleGradeChange = (grade) => {
    setInput({ ...input, grade: grade });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateInput()) return;
    checkUser().then((res) => {
      if (res) {
        setStatus({ ...status, inputs: { ...status.inputs, email: "error" } });
        return;
      } else {
        createNewUser();
      }
    });
  };

  const checkUser = () => {
    return fetch(`${apiUrl}/filterUserByEmail`, {
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

  const createNewUser = () => {
    const result = fetcher("create-account", "post", input);
    result
      .then((res) => {
        message.success("User Successfully Created!");
        getUsers();
        setInput({});
        setShowAddModal(false);
      })
      .catch((err) => {
        message.error("Some Error Occrred!");
      });
  };

  const validateInput = () => {
    let valid = true;
    if (!validateEmail(input.email)) {
      setStatus({ ...status, inputs: { ...status.inputs, email: "error" } });
      valid = false;
    }
    if (!matchValues(input.password, input.cpassword)) {
      setStatus({
        ...status,
        inputs: { ...status.inputs, cpassword: "error" },
      });
      valid = false;
    }

    return valid;
  };

  useEffect(() => {
    filterCondition == "" ? setFilteredUsers(initialUsers) : filterData();
  }, [filterCondition]);

  return (
    <div className="w-100">
      <h5 className="text-center">Manage Accounts</h5>
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
            Add User
          </Button>
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-center justify-content-md-end" style={{ maxWidth: "60%" }}>
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
                setFilteredUsers(initialUsers);
                setFilterCondition("");
              }}
            >
              <Select.Option value="name">Name</Select.Option>
              <Select.Option value="department">Department</Select.Option>
              <Select.Option value="role">Role</Select.Option>
              <Select.Option value="account_status">
                Account Status
              </Select.Option>
            </Select>
          </div>
          <div
            className="d-flex align-items-center ms-2 mt-2 mt-md-0"
            style={{ maxWidth: "20rem" }}
          >
            {filterBy == "name" && (
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
                className="w-100"
              >
                {departments.map((dept) => (
                  <Select.Option value={dept.value}>{dept.name}</Select.Option>
                ))}
              </Select>
            )}

            {filterBy == "role" && (
              <Select
                value={filterCondition}
                onChange={(val) => {
                  setFilterCondition(val);
                }}
                className="w-100"
              >
                {roles.map((role) => (
                  <Select.Option value={role.value}>{role.name}</Select.Option>
                ))}
              </Select>
            )}

            {filterBy == "account_status" && (
              <Select
                value={filterCondition}
                onChange={(val) => {
                  setFilterCondition(val);
                }}
                className="w-100"
              >
                {account_status.map((acc_status) => (
                  <Select.Option value={acc_status.value}>
                    {acc_status.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </div>
        </div>
      </div>

      <AntdTable columns={columns} data={filteredUsers} width="80%" />
      <Modal
        open={showManageModal}
        title={<p className="text-center m-0">Manage User Account</p>}
        onCancel={() => {
          setShowManageModal(false);
        }}
        footer={[]}
      >
        {showManageModal && (
          <div className="d-flex flex-column justify-content-center align-items-center">
            <Avatar icon={<UserOutlined />} />
            <ul className="mt-2" style={{ width: "60%" }}>
              <li>Name : {selectedUser.name}</li>
              <li>Email : {selectedUser.email}</li>
              <li>
                Department :{" "}
                {selectedUser.department
                  ? departments.filter(
                      (dept) => dept.value == selectedUser.department
                    )[0].name
                  : ""}
              </li>
              <li>Role : {selectedUser.role}</li>
              <li>
                Account Status : {renderStatus(selectedUser.account_status)}
              </li>
            </ul>
            <hr className="w-100" />
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ width: "50%", minHeight: "3rem" }}
            >
              {selectedUser.account_status == "not-approved" && (
                <Button
                  type="primary"
                  onClick={() => {
                    updateAccount(selectedUser, "active");
                  }}
                  className="me-2"
                >
                  Approve
                </Button>
              )}
              {selectedUser.account_status == "not-approved" && (
                <Button
                  className="bg-danger text-white"
                  onClick={() => {
                    updateAccount(selectedUser, "declined");
                  }}
                >
                  Decline
                </Button>
              )}
              {selectedUser.account_status == "active" && (
                <Button
                  className="bg-danger text-white"
                  onClick={() => {
                    updateAccount(selectedUser, "banned");
                  }}
                >
                  Ban
                </Button>
              )}
              {selectedUser.account_status == "banned" && (
                <Button
                  type="primary"
                  onClick={() => {
                    updateAccount(selectedUser, "active");
                  }}
                >
                  Release
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={showAddModal}
        title={<p className="text-center m-0">Add User</p>}
        onCancel={() => {
          setShowAddModal(false);
        }}
        footer={[]}
        maskClosable={false}
      >
        {showAddModal && (
          <form
            className="d-flex justify-content-center align-items-center flex-column"
            onSubmit={handleSubmit}
          >
            <label htmlFor="name" className="w-100">
              Name
            </label>
            <Input
              style={{ height: "2.5rem" }}
              className="half-black"
              placeholder="Name"
              name="name"
              id="name"
              value={input.name}
              onChange={handleChange}
              status={status.inputs.name}
              required
            />
            <label htmlFor="email" className="w-100 mt-2 d-block">
              Email
            </label>
            <Input
              style={{ height: "2.5rem" }}
              className="half-black"
              placeholder="Email"
              name="email"
              id="email"
              value={input.email}
              onChange={handleChange}
              status={status.inputs.email}
              required
            />
            <label htmlFor="role" className="w-100 mt-2 d-block">
              Role
            </label>
            <Select
              id="role"
              name="role"
              onChange={handleRoleChange}
              value={input.role}
              className="w-100"
            >
              {roles.map((opt, index) => (
                <Select.Option key={index} value={opt.value}>
                  {opt.name}
                </Select.Option>
              ))}
            </Select>
            <label htmlFor="department" className="w-100 mt-2 d-block">
              Department
            </label>
            <Select
              id="department"
              name="department"
              onChange={handleDeptChange}
              value={input.department}
              className="w-100"
            >
              {departments.map((opt, index) => (
                <Select.Option key={index} value={opt.value}>
                  {opt.name}
                </Select.Option>
              ))}
            </Select>
            {input.role == "student" && (
              <label htmlFor="grade" className="w-100 mt-2 d-block">
                Grade
              </label>
            )}
            {input.role == "student" && (
              <Select
                id="grade"
                name="grade"
                onChange={handleGradeChange}
                value={input.grade}
                className="w-100"
              >
                {grades.map((opt, index) => (
                  <Select.Option key={index} value={opt.value}>
                    {opt.name}
                  </Select.Option>
                ))}
              </Select>
            )}
            <label htmlFor="password" className="w-100 mt-2">
              Password
            </label>
            <Input.Password
              style={{ height: "2.5rem" }}
              className="half-black"
              placeholder="Password"
              name="password"
              id="password"
              value={input.password}
              onChange={handleChange}
              status={status.inputs.password}
              required
              minLength="8"
            />
            <label htmlFor="cpassword" className="w-100 mt-2">
              Confirm Password
            </label>
            <Input.Password
              style={{ height: "2.5rem" }}
              className="half-black"
              placeholder="Confirm Password"
              name="cpassword"
              id="cpassword"
              value={input.cpassword}
              onChange={handleChange}
              status={status.inputs.cpassword}
              required
              minLength="8"
            />
            <Button
              className="rounded-button mt-3 text-white"
              style={{
                width: "45%",
                height: "2.5rem",
                background: "darkslategray",
              }}
              htmlType="submit"
            >
              Create User
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};
export default Account;
