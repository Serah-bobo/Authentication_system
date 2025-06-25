import { createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import { Route } from "react-router-dom";
import { RegisterUser } from "features/Register";

const App=()=>{
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RegisterUser />} />
    )
  );

  return (
    <RouterProvider router={router} />
  );
}
export default App;