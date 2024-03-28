import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, Modal, message } from "antd";
import { useState } from "react";
import { sendEmail, validateEmail } from "../../_services";
import API_URL from "../../apiUrl";
import { useSelector } from "react-redux";

const Me = () => {
  const apiUrl = API_URL;

  const [showPWModal, setShowPWModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [input, setInput] = useState({});
  const [status, setStatus] = useState({ inputs: {} });
  const departments = useSelector((state) => state.myReducer.departments);

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

  const handleChange = (e) => {
    setStatus({ ...status, inputs: {} });
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleSubmit = (e, type) => {
    e.preventDefault();
    if (type == "password") {
      validatePwInput().then((res) => {
        if (!res) return;
        changePassword();
      });
    } else {
      if (input.email != userInfo.email && !validateEmail(input.email)) {
        setStatus({ ...status, inputs: { email: "error" } });
      } else {
        if (input.email != userInfo.email) {
          fetch(`${apiUrl}/filterUserByEmail`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: input.email }),
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.result.length > 0) {
                setStatus({ ...status, inputs: { email: "error" } });
              } else {
                changeProfile();
              }
            });
        } else {
          changeProfile();
        }
      }
    }
  };

  const validatePwInput = () => {
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

  const changeProfile = () => {
    fetch(`${apiUrl}/change-profile/${userInfo._id}`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
      .then((res) => res.json())
      .then(async (res) => {
        let userInfo = JSON.parse(localStorage.getItem("currentUser"));
        userInfo.name = input.name;
        userInfo.email = input.email;
        localStorage.setItem("currentUser", JSON.stringify(userInfo));
        message.success("Profile Changed Successfully!");
        setShowProfileModal(false);
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
          {(userInfo.role == "student" || userInfo.role == "teacher") && (
            <li>
              Department :{" "}
              {departments.length > 0 &&
                departments.filter(
                  (dept) => dept.value == userInfo.department
                )[0] &&
                departments.filter(
                  (dept) => dept.value == userInfo.department
                )[0].name}
              {userInfo.role == "student" && (
                <li>Courses Registered : {myFinalCourses.length}</li>
              )}
            </li>
          )}
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
              const user = { name: userInfo.name, email: userInfo.email };
              setInput(user);
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
          <form onSubmit={(e) => handleSubmit(e, "password")}>
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
        footer={[]}
        onCancel={() => {
          setShowProfileModal(false);
        }}
        maskClosable={false}
      >
        {showProfileModal && (
          <form onSubmit={(e) => handleSubmit(e, "profile")}>
            <label>Name</label>
            <Input
              value={input.name}
              name="name"
              onChange={handleChange}
              required
              status={status.inputs.name}
            />
            <label className="mt-2">Email</label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={handleChange}
              required
              status={status.inputs.email}
            />
            <Button
              htmlType="submit"
              type="primary"
              className="mt-2 d-block mx-auto"
              disabled={
                input.email == userInfo.email && input.name == userInfo.name
              }
            >
              Submit
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Me;
