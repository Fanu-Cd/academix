import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement:<ErrorPage />,
    children:[
      {
        path:"/",
        element:<LandingPage />
      },
      {
        path:"home",
        element:<Home />
      }
    ]
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App;
