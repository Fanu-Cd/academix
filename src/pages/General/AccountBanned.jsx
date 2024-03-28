import { Button, Result } from "antd";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

export default function AccountBanned() {
  return (
    <>
      <div className="mx-auto mt-5 border rounded" style={{ width: "60%" }}>
        <Result
          status="error"
          title="Your Account is Banned!"
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
