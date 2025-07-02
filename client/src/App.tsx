import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";
import { RegisterUser } from "features/Register";
import { LoginUser } from "features/Login";
import EmailVerified from './pages/EmailVerified'; // ✅ Import the new page
import VerifyFailed from './pages/VerifyFailed'; // ✅ Import the VerifyFailed page
import { VerifyOtp } from "pages/VerifyOtp"; // ✅ Import the VerifyOtp page
import {Home} from 'pages/Home'
import { ForgotPassword } from "pages/ForgotPassword";
import { ResetPassword } from "pages/ResetPassword";
const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<RegisterUser />} />
        <Route path="/login" element={<LoginUser />} />
        <Route path="/verify-success" element={<EmailVerified />} /> {/* ✅ New route */}
        <Route path="/verify-failed" element={<VerifyFailed />} /> {/* ✅ New route for verification failure */}
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
