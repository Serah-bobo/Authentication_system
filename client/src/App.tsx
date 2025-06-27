import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";
import { RegisterUser } from "features/Register";
import { LoginUser } from "features/Login";
import EmailVerified from './pages/EmailVerified'; // ✅ Import the new page

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<RegisterUser />} />
        <Route path="/login" element={<LoginUser />} />
        <Route path="/verify-success" element={<EmailVerified />} /> {/* ✅ New route */}
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
