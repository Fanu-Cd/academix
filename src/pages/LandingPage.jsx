import { Button, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import lms from "../assets/undraw_online_learning_re_qw08.svg";
import { FaHandPointUp } from "react-icons/fa";
import { GrGrow } from "react-icons/gr";
import { IoGlobe } from "react-icons/io5";
import { IoIosSpeedometer } from "react-icons/io";
import teacher from "../assets/undraw_teacher_re_sico.svg";
import student from "../assets/undraw_online_reading_np7n.svg";
import admin from "../assets/undraw_dashboard_re_3b76.svg";
import Footer from "../components/Footer";
const LandingPage = () => {
  return (
    <div
      className="mx-auto mt-4 p-0"
      style={{ width: "90%", minHeight: "30rem", height: "auto" }}
    >
      {/* NAVIGATION */}
      <nav
        className="navbar navbar-expand-md navbar-light d-md-flex justify-content-between align-items-center mx-auto"
        style={{ width: "95%" }}
      >
        <a className="navbar-brand" href="/#">
          AcademiX
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse d-md-flex justify-content-between align-items-center"
          id="navbarSupportedContent"
          style={{ maxWidth: "80%" }}
        >
          <ul
            className="navbar-nav mr-auto d-flex justify-content-between"
            style={{ width: "40%" }}
          >
            <li className="nav-item">
              <a className="nav-link" href="/#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#">
                Contact
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#">
                About Us
              </a>
            </li>
          </ul>
          <div style={{ width: "30%" }}>
            <Input.Search placeholder="Search" style={{ width: "100%" }} />
          </div>
          <Button
            style={{ width: "25%", height: "2.5rem" }}
            type="primary"
            icon={<UserOutlined />}
          >
            Login / Sign Up
          </Button>
        </div>
      </nav>
      {/* HERO PAGE */}
      <div
        className="w-100 p-0"
        style={{ minHeight: "30rem", marginTop: "5rem" }}
      >
        <div className="w-100 row p-0" style={{ minHeight: "inherit" }}>
          <div className="col-md-6 col-sm-12 d-flex flex-column align-items-center justify-content-center">
            <h4 className="motto text-center">
              The Best Learning Platform For Enhancing Skills
            </h4>
            <p
              className="mt-2 fw-bold fs-5"
              style={{ fontFamily: "'Electrolize', sans-serif" }}
            >
              Learn, Grow, Achieve – Together.
            </p>
            <div className="w-100 d-flex justify-content-center align-items-center first-actions mt-3">
              <Button className="btn1 bg-primary text-white fs-5">
                Get Started
              </Button>
            </div>
          </div>
          <div className="col-md-6 d-none d-md-inline d-flex justify-content-center align-items-center">
            <img
              src={lms}
              alt="learn"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      </div>
      {/* QUALITIES */}
      <div
        className="w-100 mt-5 d-flex justify-content-between align-items-center qualities"
        style={{ minHeight: "5rem" }}
      >
        <Button icon={<FaHandPointUp color="blue" />}>User-Friendly</Button>
        <Button icon={<GrGrow color="green" />}>Scalable</Button>
        <Button icon={<IoGlobe color="red" />}>Accessible from anywhere</Button>
        <Button icon={<IoIosSpeedometer color="brown" />}>Fast Speed</Button>
      </div>
      {/* SERVICES */}
      <div className="w-100 mt-5" style={{ minHeight: "20rem" }}>
        <div
          className="w-100 row border rounded p-2"
          style={{ height: "20rem" }}
        >
          <div className="col-6 d-flex justify-content-center align-items-center">
            <img
              src={teacher}
              alt="teacher"
              style={{ width: "100%", height: "15rem" }}
            />
          </div>
          <div className="col-6 d-flex flex-column justify-content-center align-items-center">
            <h4 className="text-center services_list">For Lecturers</h4>
            <ul className="fw-bold services_list">
              <li>Course Creation and Management</li>
              <li>Assignment and Assessment Management</li>
              <li>Grading and Analytics</li>
              <li>Attendance Tracking</li>
            </ul>
          </div>
        </div>

        <div
          className="w-100 row border rounded p-2 mt-3"
          style={{ height: "20rem" }}
        >
          <div className="col-6 d-flex flex-column justify-content-center align-items-center">
            <h4 className="text-center services_list">For Students</h4>
            <ul className="fw-bold services_list">
              <li>Course Access and Navigation</li>
              <li>Assignment Submission</li>
              <li>Gradebook and Progress Tracking</li>
              <li>Resource Library</li>
            </ul>
          </div>
          <div className="col-6 d-flex justify-content-center align-items-center">
            <img
              src={student}
              alt="teacher"
              style={{ width: "100%", height: "15rem" }}
            />
          </div>
        </div>

        <div
          className="w-100 row border rounded p-2 mt-3"
          style={{ height: "20rem" }}
        >
          <div className="col-6 d-flex justify-content-center align-items-center">
            <img
              src={admin}
              alt="teacher"
              style={{ width: "100%", height: "15rem" }}
            />
          </div>
          <div className="col-6 d-flex flex-column justify-content-center align-items-center">
            <h4 className="text-center services_list">For Admins</h4>
            <ul className="fw-bold services_list">
              <li>User Management</li>
              <li>Course Creation and Organization</li>
              <li>Data Analytics and Reporting</li>
              <li>Content ManagementR</li>
            </ul>
          </div>
        </div>
      </div>
      {/* USERS */}
      <div
        className="w-100 row border rounded mt-5 analytics p-0"
        style={{ minHeight: "15rem" }}
      >
        <div className="col-sm-6 col-md-3">
          <h4 className="heading">200+</h4>
          <p>Courses</p>
        </div>
        <div className="col-sm-6 col-md-3">
          <h4 className="heading">40+</h4>
          <p>Lecturers</p>
        </div>
        <div className="col-sm-6 col-md-3">
          <h4 className="heading">2000+</h4>
          <p>Students</p>
        </div>
        <div className="col-sm-6 col-md-3">
          <h4 className="heading">20+</h4>
          <p>Schools</p>
        </div>
      </div>
      {/* FOOTER */}
      <Footer mt="5rem" />
    </div>
  );
};
export default LandingPage;
