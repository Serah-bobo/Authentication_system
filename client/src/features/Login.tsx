import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../api/auth";
import { loginSchema, LoginSchemaType } from "../schemas/LoginSchema";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from "react-icons/fa";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";


export const LoginUser = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const { mutateAsync, isPending, error } = useLogin();

const onSubmit = async (data: LoginSchemaType) => {
  try {
    const res = await mutateAsync(data); // <- this is the response from backend

    // assuming your backend sends: { user: { id: '...' }, ... }
    localStorage.setItem("userId", res.user.id);

    navigate('/verify-otp', {
      state: { message: 'Login successful. Please enter the OTP sent to your email.' }
    });
  } catch (err) {
    // Handled by error state
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-lg w-96">
        <h2 className="mb-4 text-2xl font-semibold text-center">Login</h2>

        {error && (
          <div className="p-3 mb-4 text-center text-red-500 bg-red-100 rounded">
            {(error as Error).message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="email"
                id="email"
                {...register("email")}
                className={`w-full px-10 py-2 border rounded-md focus:outline-none focus:ring ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                {...register("password")}
                className={`w-full px-10 py-2 border rounded-md focus:outline-none focus:ring ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute transform -translate-y-1/2 right-3 top-1/2"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
            <div className="mt-2 text-right">
    <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
      Forgot Password?
    </Link>
  </div>
            </div>
            <button
              type="submit"
              disabled={isPending || isSubmitting}
              className={`w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring ${
                (isPending || isSubmitting) ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
                {isPending || isSubmitting ? "Logging in..." : "Login"}
            </button>
            <p className="mt-4 text-sm text-center text-gray-600">
              Don't have an account?{" "}
              <Link to="/" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>
        </form>
        </div>
    </div>
    );
}
export default LoginUser;