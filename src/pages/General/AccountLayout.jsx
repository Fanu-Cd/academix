import { HomeFilled } from "@ant-design/icons";
import { Outlet } from "react-router-dom";

const AccountLayout = () => {
  return (
    <div className="w-100">
      <div
        style={{ width: "15%", height: "3rem" }}
        className="mb-2 mt-1 mx-auto d-flex justify-content-center align-items-center"
      >
        <HomeFilled />&nbsp;<a href="/" className="m-0 text-decoration-none">AcademiX</a>
      </div>
      <Outlet />
    </div>
  );
};

export default AccountLayout;
