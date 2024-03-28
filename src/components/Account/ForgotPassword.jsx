import { Button, Input, Result, Spin, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../apiUrl";
import { generateCode, sendEmail, validateEmail } from "../../_services";
import Footer from "../Footer";

const ForgotPassword = () => {
  const apiUrl = API_URL;
  const navigate = useNavigate();
  const email = new URL(window.location.href).searchParams.get("email");
  const token = new URL(window.location.href).searchParams.get("token");
  const [error, setError] = useState(false);

  const [input, setInput] = useState({ email: "" });
  const [status, setStatus] = useState({
    inputs: { email: "" },
    generating: false,
  });
  const [tokenValid, setTokenValid] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);

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

  const handleCodeChange = async (e) => {
    setStatus({ ...status, inputs: { ...status.inputs, code: "" } });
    const code = e.target.value;
    if (code.length == 6 && code !== verificationCode) {
      setStatus({ ...status, inputs: { ...status.inputs, code: "error" } });
    } else {
      await deactivateToken(token);
      redirectToChangePassword();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCodeSent(false);
    setStatus({
      ...status,
      inputs: { ...status.inputs, email: "" },
      generating: true,
    });
    if (!validateEmail(input.email)) {
      setStatus({
        ...status,
        inputs: { ...status.inputs, email: "error" },
        generating: false,
      });
    } else {
      verifyEmail().then((res) => {
        if (res.result && res.result.length > 0) {
          const verifCode = generateCode(6);
          setVerificationCode(verifCode);
          sendVerificationCode(verifCode);
        } else {
          setStatus({
            ...status,
            inputs: { ...status.inputs, email: "error" },
            generating: false,
          });
        }
      });
    }
  };

  const verifyEmail = () => {
    return fetch(`${apiUrl}/filterUserByEmail`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: input.email }),
    })
      .then((res) => res.json())
      .then((res) => {
        return res;
      })
      .catch((err) => null);
  };

  const sendVerificationCode = async (code) => {
    const html = `
    <p>Your Verification Code is : ${code}</p>
    <p>If you have any questions, feel free to contact us.</p>`;

    await sendEmail(true, html, "Recover Your Account", "", email);
    setCodeSent(true);
    setStatus({ ...status, generating: false });
  };

  const deactivateToken = (token) => {
    return fetch(`${apiUrl}/deactivate-token/${token}`);
  };

  const redirectToChangePassword = () => {
    fetch(`${apiUrl}/generate-token`)
      .then((res) => res.json())
      .then((res) => {
        navigate(
          `/account/change-password?email=${input.email}&token=${res.result.token}`
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
            <h3 className="fw-bold">Recover Password</h3>
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
                disabled={status.generating}
              />
              <Button
                loading={status.generating}
                type="primary"
                htmlType="submit"
                className="mt-2"
                disabled={status.generating}
              >
                {!codeSent ? "Send Verification Code" : "Resend Code"}
              </Button>
            </form>
            {codeSent && <hr className="w-100" />}
            {codeSent && (
              <>
                <label htmlFor="code" className="mt-3">
                  Now Enter Your Verification Code :{" "}
                </label>
                <Input
                  style={{ height: "2.5rem", width: "50%" }}
                  className="half-black"
                  name="code"
                  id="code"
                  value={input.code}
                  onChange={handleCodeChange}
                  status={status.inputs.code}
                  required
                  minLength="1"
                  maxLength="6"
                />
              </>
            )}
          </div>
        )}
      </div>
      <Footer mt="23rem" />
    </>
  );
};

export default ForgotPassword;
