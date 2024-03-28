import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentDashboard from "./Dashboard";
import {
  BookOutlined,
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme, Popconfirm } from "antd";
import { MdLogout, MdOutlineAnalytics } from "react-icons/md";
import { FaBookOpen, FaPencilAlt } from "react-icons/fa";
import Me from "../common/Me";
import Courses from "./Courses";
import MyCourses from "./MyCourses";
import Lessons from "./Lessons";
import MyActivity from "./MyActivity";
const { Header, Sider, Content } = Layout;

const Student = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [selectedKey, setSelectedKey] = useState("1");
  let content;
  switch (selectedKey) {
    case "1":
      content = <StudentDashboard />;
      break;
    case "2":
      content = <Courses />;
      break;
    case "3":
      content = <MyCourses />;
      break;
    case "4":
      content = <Lessons />;
      break;
    case "5":
      content = <MyActivity />;
      break;
    case "6":
      content = <Me />;
      break;
    default:
      content = <div>default content</div>;
      break;
  }

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key);
  };

  const handleResize = () => {
    if (window.innerWidth <= 800) setCollapsed(true);
    else setCollapsed(false);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
  }, []);

  return (
    <Layout className="w-100 bg-white" style={{ height: "100vh" }}>
      <Sider theme="light" trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <DashboardOutlined />,
              label: "Dashboard",
            },
            {
              key: "2",
              icon: <BookOutlined />,
              label: "All Courses",
            },
            {
              key: "3",
              icon: <FaBookOpen />,
              label: "My Courses",
            },
            {
              key: "4",
              icon: <FaPencilAlt />,
              label: "Lessons",
            },
            {
              key: "5",
              icon: <MdOutlineAnalytics />,
              label: "My Activity",
            },
            {
              key: "6",
              icon: <UserOutlined />,
              label: "Me",
            },
          ]}
          onClick={handleMenuClick}
          className="h-100"
        ></Menu>
      </Sider>

      <Layout className="px-0 px-md-2 px-lg-5 bg-white">
        <Header
          className="row m-0 justify-content-center align-items-center"
          style={{ padding: 0, background: colorBgContainer }}
        >
          <div className="col-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </div>
          <div className="col-4 text-center">
            <h4 className="m-0">Dashboard</h4>
          </div>
          <div className="col-4 text-center d-flex justify-content-end">
            <Popconfirm
              title="Are you sure you want to log out ?"
              onConfirm={() => {
                localStorage.removeItem("currentUser");
                navigate("/");
                window.location.reload();
              }}
            >
              <Button className="float-right text-danger" icon={<MdLogout />}>
                Log out
              </Button>
            </Popconfirm>
          </div>
        </Header>
        <Content
          style={{
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {content}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Student;
