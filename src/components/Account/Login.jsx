import { Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Footer";
import { useEffect, useState } from "react";
import { validateEmail } from "../../_services";
import API_URL from "../../apiUrl";
const Login = () => {
  const apiUrl = API_URL;
  const navigate = useNavigate();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(false);

  useEffect(() => {
    if (error) message.error("Fetching Data Error !");
  }, [error]);

  const [status, setStatus] = useState({
    inputs: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateInput()) return;
    checkCredentials()
      .then((res) => {
        if (res && res.result) {
          //login success, redirect to pages
          if (res.result.account_status == "not-approved") {
            message.success("Log in Successfull!");
            setTimeout(() => {
              navigate("/account/account-not-verified");
            }, 500);
          } else if (res.result.account_status == "banned") {
            message.success("Log in Successfull!");
            setTimeout(() => {
              navigate("/account/account-banned");
            }, 500);
          } else {
            message.success("Log in Successfull!");

            if (res.result.role) {
              localStorage.setItem("currentUser", JSON.stringify(res.result));
              setTimeout(() => {
                navigate("/me/home");
                window.location.reload();
              }, 500);
            }
          }
        } else {
          setStatus({
            ...status,
            inputs: { ...status.inputs, password: "error", email: "error" },
          });
        }
      })
      .catch((err) => {
        console.log("error", err);
        setError(true);
      });
  };

  const handleChange = (e) => {
    setStatus({ ...status, inputs: {} });
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const validateInput = () => {
    let valid = true;
    if (!validateEmail(input.email)) {
      setStatus({ ...status, inputs: { ...status.inputs, email: "error" } });
      valid = false;
    }

    return valid;
  };

  const checkCredentials = () => {
    return fetch(`${apiUrl}/checkCredentials`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      })
      .catch((err) => null);
  };

  const forgotPassword = (e) => {
    fetch(`${apiUrl}/generate-token`)
      .then((res) => res.json())
      .then((res) => {
        navigate(
          `/account/forgot-password?email=${input.email}&token=${res.result.token}`
        );
      })
      .catch((err) => {
        console.log("error", err);
        setError(true);
      });
  };

  return (
    <>
      <div
        className="d-flex flex-column justify-content-center align-items-center mx-auto border rounded shadow p-3"
        style={{ width: "60%" }}
      >
        <h3 className="fw-bold">Sign in</h3>
        <div className="mt-1" style={{ width: "80%" }}>
          <form
            onSubmit={handleSubmit}
            className="d-flex flex-column justify-content-center align-items-center"
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
            />
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
            <Button
              type="text"
              className="mt-3"
              onClick={() => {
                forgotPassword();
              }}
            >
              Forgot your password?
            </Button>
            <Button
              className="rounded-button mt-2 text-white"
              style={{ width: "45%", height: "2.5rem", background: "tomato" }}
              htmlType="submit"
            >
              Sign in
            </Button>
          </form>
        </div>
        <hr className="w-50 mx-auto" />
        <small className="mt-2">
          Don't have an{" "}
          <a className="text-blue text-decoration-none" href="/#">
            AcademiX
          </a>{" "}
          account?
        </small>
        <Link to="/account/signup" style={{ width: "35%" }}>
          <Button
            className="rounded-button mt-3 text-wrap"
            style={{ width: "100%", minHeight: "2.5rem", height: "auto" }}
          >
            Create New Account
          </Button>
        </Link>
      </div>
      <Footer mt="7rem" />
    </>
  );
};

export default Login;
