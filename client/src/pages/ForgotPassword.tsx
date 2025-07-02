// pages/ForgotPassword.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  ForgotPasswordSchemaType,
} from "../schemas/forgotPasswordSchema";
import { useForgotPassword } from "../api/auth";
import { FaEnvelope } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const ForgotPassword = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { mutate, isPending, error } = useForgotPassword();

  const onSubmit = (data: ForgotPasswordSchemaType) => {
    mutate(data, {
      onSuccess: () => {
        setSuccessMessage("Password reset email sent! Check your inbox.");
      },
    });
  };

  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h2 className="mb-4 text-2xl font-bold text-center">Forgot Password</h2>

        {successMessage && (
          <div className="p-3 mb-4 text-green-800 bg-green-100 rounded">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="p-3 mb-4 text-red-800 bg-red-100 rounded">
            {(error as Error).message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              <input
                type="email"
                id="email"
                {...register("email")}
                className="w-full py-2 pl-10 pr-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            {isPending ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
