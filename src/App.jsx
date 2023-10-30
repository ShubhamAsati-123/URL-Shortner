import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import Open_link from "./components/Open_link";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Landing />
    },
    {
      path: "/:short",
      element: <Open_link />
    },
    {
      path: "*",
      element: <NotFound />
    },

  ])

  return <RouterProvider router={router} />;

};

export default App;
