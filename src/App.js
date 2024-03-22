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
import { useDispatch, UseDispatch, useSelector } from "react-redux";
import {
  setCourses,
  setDepartments,
  setUsers,
  setLessons,
  setCourseRegs,
  setExams,
} from "./store/store";
import { useEffect } from "react";
import AccountBanned from "./pages/General/AccountBanned";
import WaitForApproval from "./pages/General/WaitForApproval";
import Teacher from "./pages/Teacher/Teacher";
import Student from "./pages/Student/Student";
import API_URL from "./apiUrl";
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
            element: <Signup />,
          },
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "account-not-verified",
            element: <AccountNotVerifiedPage />,
          },
          {
            path: "account-banned",
            element: <AccountBanned />,
          },
          {
            path: "wait-for-approval",
            element: <WaitForApproval />,
          },
        ],
      },
      {
        path: "me",
        element: <UserLayout />,
        children: [
          {
            path: "admin",
            element: <Admin />,
          },
          {
            path: "teacher",
            element: <Teacher />,
          },
          {
            path: "student",
            element: <Student />,
          },
        ],
      },
    ],
  },
]);

function App() {
  useEffect(() => {
    console.log("environment, apiUrl", process.env.NODE_ENV, API_URL);
    getDepartments();
    getUsers();
    getCourses();
    getLessons();
    getCourseRegs();
    getExams();
  }, []);

  const dispatch = useDispatch();
  const getDepartments = () => {
    fetcher("get-departments").then((res) => {
      const depts = res.result;
      const departments = [];
      depts.map((dept) =>
        departments.push({ name: dept.title, value: dept._id })
      );
      dispatch(setDepartments(departments));
    });
  };

  const getCourses = () => {
    fetcher("get-courses").then((res) => {
      const courses = res.result;
      dispatch(setCourses(courses));
    });
  };

  const getUsers = () => {
    fetcher("get-users").then((res) => {
      const users = res.result;
      dispatch(setUsers(users));
    });
  };

  const getLessons = () => {
    fetcher("get-lessons").then((res) => {
      const lessons = res.result;
      dispatch(setLessons(lessons));
    });
  };

  const getCourseRegs = () => {
    fetcher("get-course-regs").then((res) => {
      const regs = res.result;
      dispatch(setCourseRegs(regs));
    });
  };

  const getExams = () => {
    fetcher("get-exams").then((res) => {
      const exams = res.result;
      dispatch(setExams(exams));
    });
  };

  return <RouterProvider router={router} />;
}

export default App;
