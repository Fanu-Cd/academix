import { Button, Result } from "antd";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import { SmileOutlined } from "@ant-design/icons";

export default function WaitForApproval() {
  return (
    <>
      <div className="mx-auto mt-5 border rounded" style={{ width: "60%" }}>
        <Result
          icon={<SmileOutlined />}
          title="Wait for account approval!"
          extra={
            <Link to="/">
              <Button type="primary" key="console">
                Back to Home
              </Button>
            </Link>
          }
        />
      </div>
      <Footer mt="15rem" />
    </>
  );
}
