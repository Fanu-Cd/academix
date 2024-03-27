import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/General/ErrorPage";
import MainLayout from "./pages/General/MainLayout";
import LandingPage from "./pages/General/LandingPage";
import Signup from "./components/Account/Signup";
import AccountLayout from "./pages/General/AccountLayout";
import Login from "./components/Account/Login";
import AccountNotVerifiedPage from "./pages/General/AccountNotVerified";
import UserLayout from "./pages/General/UserLayout";
import Admin from "./pages/Admin/Admin";
import { fetcher } from "./_services";
import { useDispatch } from "react-redux";
import {
  setCourses,
  setDepartments,
  setUsers,
  setLessons,
  setCourseRegs,
  setExams,
  setStudentActivities,
  setStudentNotes,
} from "./store/store";
import { useEffect, useState } from "react";
import AccountBanned from "./pages/General/AccountBanned";
import WaitForApproval from "./pages/General/WaitForApproval";
import Teacher from "./pages/Teacher/Teacher";
import Student from "./pages/Student/Student";
import ForgotPassword from "./components/Account/ForgotPassword";
import ChangePassword from "./components/Account/ChangePassword";
import { message } from "antd";
const user = JSON.parse(localStorage.getItem("currentUser"));
const userRedirect = <LandingPage />;
const userRouter = () => {
  switch (user.role) {
    case "admin":
      return <Admin />;
    case "teacher":
      return <Teacher />;
    case "student":
      return <Student />;
    default:
  }
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "account",
        element: <AccountLayout />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "signup",
            element: user ? userRedirect : <Signup />,
          },
          {
            path: "login",
            element: user ? userRedirect : <Login />,
          },
          {
            path: "forgot-password",
            element: user ? userRedirect : <ForgotPassword />,
          },
          {
            path: "change-password",
            element: user ? userRedirect : <ChangePassword />,
          },
          {
            path: "account-not-verified",
            element: user ? userRedirect : <AccountNotVerifiedPage />,
          },
          {
            path: "account-banned",
            element: user ? userRedirect : <AccountBanned />,
          },
          {
            path: "wait-for-approval",
            element: user ? userRedirect : <WaitForApproval />,
          },
        ],
      },
      {
        path: "me",
        element: <UserLayout />,
        children: [
          {
            path: "home",
            element: user ? userRouter() : <LandingPage />,
          },
        ],
      },
    ],
  },
]);

function App() {
  const [error, setError] = useState(false);

  useEffect(() => {
    getDepartments();
    getUsers();
    getCourses();
    getLessons();
    getCourseRegs();
    getExams();
    getStudentActivities();
    getStudentNotes();
  }, []);

  useEffect(() => {
    if (error) message.error("Fetching Data Error !");
  }, [error]);

  const dispatch = useDispatch();
  const getDepartments = () => {
    fetcher("get-departments")
      .then((res) => {
        const depts = res.result;
        if (depts != undefined) {
          const departments = [];
          depts.map((dept) =>
            departments.push({ name: dept.title, value: dept._id })
          );
          dispatch(setDepartments(departments));
        }
      })
      .catch((err) => {
        console.log("FETCH DEPTS ERROR", err);
        setError(true);
      });
  };

  const getCourses = () => {
    fetcher("get-courses")
      .then((res) => {
        const courses = res.result;
        if (courses != undefined) dispatch(setCourses(courses));
      })
      .catch((err) => {
        console.log("FETCH COURSES ERROR", err);
        setError(true);
      });
  };

  const getUsers = () => {
    fetcher("get-users")
      .then((res) => {
        const users = res.result;
        if (users != undefined) dispatch(setUsers(users));
      })
      .catch((err) => {
        console.log("FETCH USERS ERROR", err);
        setError(true);
      });
  };

  const getLessons = () => {
    fetcher("get-lessons")
      .then((res) => {
        const lessons = res.result;
        if (lessons != undefined) dispatch(setLessons(lessons));
      })
      .catch((err) => {
        console.log("FETCH LESSONS ERROR", err);
        setError(true);
      });
  };

  const getCourseRegs = () => {
    fetcher("get-course-regs")
      .then((res) => {
        const regs = res.result;
        if (regs != undefined) dispatch(setCourseRegs(regs));
      })
      .catch((err) => {
        console.log("FETCH COURSEREGS ERROR", err);
        setError(true);
      });
  };

  const getExams = () => {
    fetcher("get-exams")
      .then((res) => {
        const exams = res.result;
        if (exams != undefined) dispatch(setExams(exams));
      })
      .catch((err) => {
        console.log("FETCH EXAMS ERROR", err);
        setError(true);
      });
  };

  const getStudentActivities = () => {
    fetcher("get-all-student-activities")
      .then((res) => {
        const activities = res.result;
        if (activities != undefined) dispatch(setStudentActivities(activities));
      })
      .catch((err) => {
        console.log("FETCH ACTIVITIES ERROR", err);
        setError(true);
      });
  };

  const getStudentNotes = () => {
    fetcher("get-all-student-notes")
      .then((res) => {
        const notes = res.result;
        if (notes != undefined) dispatch(setStudentNotes(notes));
      })
      .catch((err) => {
        console.log("FETCH ACTIVITIES ERROR", err);
        setError(true);
      });
  };

  return <RouterProvider router={router} />;
}

export default App;
