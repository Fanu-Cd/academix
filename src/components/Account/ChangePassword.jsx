import { Button, Input, Result, Spin, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../apiUrl";
import { matchValues, sendEmail } from "../../_services";
import Footer from "../Footer";

const ChangePassword = () => {
  const apiUrl = API_URL;
  const navigate = useNavigate();
  const email = new URL(window.location.href).searchParams.get("email");
  const token = new URL(window.location.href).searchParams.get("token");
  const [error, setError] = useState(false);

  const [input, setInput] = useState({
    email: "",
    password: "",
    cpassword: "",
  });
  const [status, setStatus] = useState({ inputs: {} });
  const [tokenValid, setTokenValid] = useState("");

  useEffect(() => {
    if (tokenValid) setInput({ email: email });
  }, [tokenValid]);

  useEffect(() => {
    verifyToken(token);
  }, []);

  useEffect(() => {
    if (error) message.error("Fetching Data Error !");
  }, [error]);

  const verifyToken = (token) => {
    fetch(`${apiUrl}/verify-token/${token}`)
      .then((res) => res.json())
      .then((res) => {
        if (res && res.result) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
        }
      })
      .catch((err) => {
        console.log("error", err);
        setError(true);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.email || !validateInput()) {
      return;
    } else {
      fetch(`${apiUrl}/filterUserByEmail`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: input.email }),
      })
        .then((res) => res.json())
        .then((res) => {
          const uid = res.result[0]._id;
          fetch(`${apiUrl}/change-password/${uid}`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newPassword: input.password }),
          })
            .then(async (res) => {
              await deactivateToken(token);
              sendSuccessMessage();
            })
            .catch((err) => {
              console.log("error", err);
              setError(true);
            });
        })
        .catch((err) => {
          console.log("error", err);
          setError(true);
        });
    }
  };

  const validateInput = () => {
    let valid = true;
    if (!matchValues(input.password, input.cpassword)) {
      setStatus({
        ...status,
        inputs: { ...status.inputs, cpassword: "error" },
      });
      valid = false;
    }

    return valid;
  };

  const deactivateToken = (token) => {
    return fetch(`${apiUrl}/deactivate-token/${token}`);
  };

  const sendSuccessMessage = async () => {
    const html = `
    <p>You have successfully changed your password!</p>
    <p>If you have any questions, feel free to contact us.</p>`;

    await sendEmail(true, html, "Password Changed Successfully!", "", email);
    navigate("/account/login");
  };

  return (
    <>
      <div
        className="d-flex flex-column justify-content-center align-items-center mx-auto border rounded shadow p-3"
        style={{ width: "60%" }}
      >
        {tokenValid === "" && (
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ minHeight: "15rem" }}
          >
            <small>Please Wait...</small>
            <Spin className="mt-2" />
          </div>
        )}

        {tokenValid === false && (
          <div className="w-100 d-flex flex-column justify-content-center align-items-center">
            <Result status="error" title="Token Expired!" />
          </div>
        )}

        {tokenValid && (
          <div className="w-100 d-flex flex-column justify-content-center align-items-center">
            <h3 className="fw-bold">Change Password</h3>
            <form
              onSubmit={handleSubmit}
              className="d-flex flex-column justify-content-center align-items-center"
              style={{ width: "90%" }}
            >
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
                disabled
              />
              <label htmlFor="password" className="w-100 mt-2 d-block">
                Create New Password
              </label>
              <Input.Password
                style={{ height: "2.5rem" }}
                className="half-black"
                placeholder="New Password"
                name="password"
                id="password"
                value={input.password}
                onChange={handleChange}
                status={status.inputs.password}
                required
                minLength="8"
              />
              <label htmlFor="cpassword" className="w-100 mt-2 d-block">
                Confirm Password
              </label>
              <Input.Password
                style={{ height: "2.5rem" }}
                className="half-black"
                placeholder="New Password"
                name="cpassword"
                id="cpassword"
                value={input.cpassword}
                onChange={handleChange}
                status={status.inputs.cpassword}
                required
                minLength="8"
              />
              <Button htmlType="submit" type="primary" className="mt-2">
                Submit
              </Button>
            </form>
          </div>
        )}
      </div>
      <Footer mt="15rem" />
    </>
  );
};

export default ChangePassword;
