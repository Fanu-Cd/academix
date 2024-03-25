import { BookOutlined } from "@ant-design/icons";
import { FaPencilAlt } from "react-icons/fa";
import { Card, Row, Col } from "antd";
import { useSelector } from "react-redux";
const StudentDashboard = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const allCourses = useSelector((state) => state.myReducer.courses);

  const courseRegs = useSelector((state) => state.myReducer.courseRegs);
  const myCourseRegs = courseRegs.filter((cr) => cr.user == currentUser._id);

  const myCourses = allCourses.filter(
    (course) => course.department == currentUser.department
  );
  const myFinalCourses = myCourses.filter((course) => {
    let isInMyCourseRegs = myCourseRegs.filter((cr) => cr.course == course._id);
    return isInMyCourseRegs;
  });

  const allLessons = useSelector((state) => state.myReducer.lessons);
  const myLessons = allLessons.filter((lesson) => {
    const isOfMyCourse =
      myFinalCourses.filter((course) => course._id == lesson.course).length > 0;
    return isOfMyCourse;
  });

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
              <h3 className="text-center">{myFinalCourses.length}</h3>
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

export default StudentDashboard;
