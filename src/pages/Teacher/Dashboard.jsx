import { BookOutlined } from "@ant-design/icons";
import { FaPencilAlt } from "react-icons/fa";
import { Card, Row, Col } from "antd";
import { useSelector } from "react-redux";
const TeacherDashboard = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const allCourses = useSelector((state) => state.myReducer.courses);
  const myCourses = allCourses.filter((course) =>
    course.teachers.includes(currentUser._id)
  );
  const allLessons = useSelector((state) => state.myReducer.lessons);
  const myLessons = allLessons.filter(
    (lesson) => lesson.uploadedBy == currentUser._id
  );

  return (
    <div className="w-100 bg-light" style={{ height: "100%" }}>
      <div className="w-100">
        <Row className="w-100" gutter="2">
          <Col span={12}>
            <Card className="d-flex flex-column justify-content-center align-items-center">
              <div className="text-center">
                <BookOutlined className="fs-3" />
              </div>
              <h5 className="text-center">My Courses</h5>
              <h3 className="text-center">{myCourses.length}</h3>
            </Card>
          </Col>
          <Col span={12}>
            <Card className="d-flex flex-column justify-content-center align-items-center">
              <div className="text-center">
                <FaPencilAlt className="fs-3" />
              </div>
              <h5 className="text-center">My Lessons</h5>
              <h3 className="text-center">{myLessons.length}</h3>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TeacherDashboard;
