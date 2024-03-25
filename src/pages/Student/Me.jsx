import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, Modal, message } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import API_URL from "../../apiUrl";
import { sendEmail } from "../../_services";

const Me = () => {
  const apiUrl = API_URL;

  const [showPWModal, setShowPWModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [input, setInput] = useState({});
  const [status, setStatus] = useState({ inputs: {} });

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

  const departments = useSelector((state) => state.myReducer.departments);
  console.log(departments);
  const handleChange = (e) => {
    setStatus({ ...status, inputs: {} });
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateInput().then((res) => {
      if (!res) return;
      changePassword();
    });
  };

  const validateInput = () => {
    let valid = true;
    return checkCredentials().then((res) => {
      if (res && res.result) {
        if (input.newPassword != input.cNewPassword) {
          setStatus({
            ...status,
            inputs: { ...status.inputs, cNewPassword: "error" },
          });
          valid = false;
          return valid;
        }
      } else {
        setStatus({
          ...status,
          inputs: { ...status.inputs, oldPassword: "error" },
        });
        valid = false;
        return valid;
      }
      return valid;
    });
  };

  const changePassword = () => {
    fetch(`${apiUrl}/change-password/${userInfo._id}`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
      .then((res) => res.json())
      .then(async (res) => {
        let userInfo = JSON.parse(localStorage.getItem("currentUser"));
        userInfo.password = input.newPassword;
        localStorage.setItem("currentUser", JSON.stringify(userInfo));
        await sendSuccessMessage();
        message.success("Password Changed Successfully!");
        setShowPWModal(false);
      })
      .catch((err) => {
        message.error("Some Error Occurred!");
      });
  };

  const checkCredentials = () => {
    return fetch(`${apiUrl}/checkCredentials`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userInfo.email,
        password: input.oldPassword,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  };

  const sendSuccessMessage = async () => {
    let userInfo = JSON.parse(localStorage.getItem("currentUser"));

    const html = `
    <p>You have successfully changed your password!</p>
    <p>If you have any questions, feel free to contact us.</p>`;

    await sendEmail(
      true,
      html,
      "Password Changed Successfully!",
      "",
      userInfo.email
    );
  };

  const userInfo = JSON.parse(localStorage.getItem("currentUser"));
  console.log("userInfo", userInfo);
  return (
    <div className="w-100">
      <h5 className="text-center">Me</h5>
      <div
        className="border p-3 rounded mx-auto d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "10rem", width: "80%" }}
      >
        <Avatar icon={<UserOutlined />} size="large" />
        <ul className="mt-2 d-flex flex-column justify-content-center">
          <li>Name : {userInfo.name}</li>
          <li>Email : {userInfo.email}</li>
          <li>School : {userInfo.school}</li>
          <li>
            Department :{" "}
            {departments.length > 0 &&
              departments.filter(
                (dept) => dept.value == userInfo.department
              )[0] &&
              departments.filter((dept) => dept.value == userInfo.department)[0]
                .name}
          </li>
          <li>Courses Registered : {myFinalCourses.length}</li>
        </ul>
        <div className="d-flex justify-content-between align-items-center">
          <Button
            onClick={() => {
              setShowPWModal(true);
            }}
            type="primary"
          >
            Change Password
          </Button>
          <Button
            onClick={() => {
              setShowProfileModal(true);
            }}
            className="ms-3"
          >
            Change Profile
          </Button>
        </div>
      </div>

      <Modal
        maskClosable={false}
        open={showPWModal}
        title="Change Password"
        footer={[]}
        onCancel={() => {
          setShowPWModal(false);
        }}
      >
        {showPWModal && (
          <form onSubmit={handleSubmit}>
            <label>Current Password</label>
            <Input.Password
              value={input.oldPassword}
              name="oldPassword"
              onChange={handleChange}
              required
              minLength="8"
              status={status.inputs.oldPassword}
            />
            <label className="mt-2">New Password</label>
            <Input.Password
              value={input.newPassword}
              name="newPassword"
              onChange={handleChange}
              required
              minLength="8"
              status={status.inputs.newPassword}
            />
            <label className="mt-2">Confirm New Password</label>
            <Input.Password
              value={input.cNewPassword}
              name="cNewPassword"
              onChange={handleChange}
              required
              minLength="8"
              status={status.inputs.cNewPassword}
            />
            <Button
              htmlType="submit"
              type="primary"
              className="mt-2 d-block mx-auto"
            >
              Submit
            </Button>
          </form>
        )}
      </Modal>
      <Modal
        open={showProfileModal}
        title="Change Profile"
        onCancel={() => {
          setShowProfileModal(false);
        }}
        maskClosable={false}
      ></Modal>
    </div>
  );
};

export default Me;
