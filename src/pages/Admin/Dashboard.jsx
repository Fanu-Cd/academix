import { BookOutlined, ReadOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Row, Col } from "antd";
import { MdGroups, MdPeople } from "react-icons/md";
import { useSelector } from "react-redux";
import { arrayFilter } from "../../_services";
const AdminDashboard = () => {
  const users = useSelector((state) => state.myReducer.users);
  const totalUsers = users.length || 0;
  const activeUsers =
    arrayFilter(users, "account_status", "active").length || 0;
  const notApprovedUsers =
    arrayFilter(users, "account_status", "not-approved").length || 0;
  const bannedUsers =
    arrayFilter(users, "account_status", "banned").length || 0;
  const deletedUsers =
    arrayFilter(users, "account_status", "deleted").length || 0;

  const totalTeachers =
    users.filter(
      (usr) => usr.role == "teacher" && usr.account_status == "active"
    ).length || 0;
  const totalStudents =
    users.filter(
      (usr) => usr.role == "student" && usr.account_status == "active"
    ).length || 0;
  const totalDepts =
    useSelector((state) => state.myReducer.departments).length || 0;
  const totalCourses =
    useSelector((state) => state.myReducer.courses).length || 0;

  return (
    <div className="w-100 bg-light" style={{ height: "100%" }}>
      <div className="w-100 p-3">
        <h4>Total Data</h4>
        <Row className="w-100" gutter="2">
          <Col xs={12} md={6}>
            <Card className="d-flex flex-column justify-content-center align-items-center">
              <div className="text-center">
                <UserOutlined className="fs-3" />
              </div>
              <h5 className="text-center">Total Users</h5>
              <h3 className="text-center">{activeUsers}</h3>
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card className="d-flex flex-column justify-content-center align-items-center">
              <div className="text-center">
                <ReadOutlined className="fs-3" />
              </div>
              <h5 className="text-center">Total Teachers</h5>
              <h3 className="text-center">{totalTeachers}</h3>
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card className="d-flex flex-column justify-content-center align-items-center">
              <div className="text-center">
                <MdPeople className="fs-3" />
              </div>
              <h5 className="text-center">Total Students</h5>
              <h3 className="text-center">{totalStudents}</h3>
            </Card>
          </Col>

          <Col xs={12} md={6}>
            <Card className="d-flex flex-column justify-content-center align-items-center">
              <div className="text-center">
                <MdGroups className="fs-3" />
              </div>
              <h5 className="text-center">Total Departments</h5>
              <h3 className="text-center">{totalDepts}</h3>
            </Card>
          </Col>
          <Col span={24}>
            <Card className="d-flex flex-column justify-content-center align-items-center">
              <div className="text-center">
                <BookOutlined className="fs-3" />
              </div>
              <h5 className="text-center">Total Courses</h5>
              <h3 className="text-center">{totalCourses}</h3>
            </Card>
          </Col>
        </Row>
      </div>
      <div className="w-100 mt-1 mt-md-5 p-3" style={{ minHeight: "10rem" }}>
        <h4>Users</h4>
        <Row className="mt-3" gutter={"5"}>
          <Col xs={12} md={6}>
            <Card title="Active" className="text-center">
              <h3 className="m-0">{activeUsers}</h3>
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card title="Not Approved" className="text-center">
              <h3 className="m-0">{notApprovedUsers}</h3>
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card title="Banned" className="text-center">
              <h3 className="m-0">{bannedUsers}</h3>
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card
              title={<p className="m-0 text-danger">Deleted</p>}
              className="text-center"
            >
              <h3 className="m-0">{deletedUsers}</h3>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminDashboard;
