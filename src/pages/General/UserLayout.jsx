import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="w-100">
      <Outlet />
    </div>
  );
};

export default UserLayout;
