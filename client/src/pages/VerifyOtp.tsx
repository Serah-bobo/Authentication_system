import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOtpSchema, VerifyOtpSchemaType } from "../schemas/OtpSchema";
import { useVerifyOtp } from "../api/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

export const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [navigate, userId]);

  const { mutate, isPending, error } = useVerifyOtp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpSchemaType>({
    resolver: zodResolver(verifyOtpSchema),
  });

  const onSubmit = (data: VerifyOtpSchemaType) => {
    if (!userId) {
      navigate("/login");
      return;
    }

    console.log("Submitting OTP form:", { ...data, userId });

    mutate(
      { ...data, userId }, // attach userId outside the schema
      {
        onSuccess: () => {
          localStorage.removeItem("userId");
          navigate("/dashboard");
        },
      }
    );
  };

  return (
    <div className="max-w-md p-6 mx-auto mt-20 bg-white rounded shadow">
      <h2 className="mb-4 text-2xl font-bold text-center">Enter OTP</h2>

      {message && (
        <div className="p-2 mb-4 text-sm text-green-800 bg-green-100 rounded">
          {message}
        </div>
      )}

      {error && (
        <div className="p-2 mb-4 text-sm text-red-800 bg-red-100 rounded">
          {(error as Error).message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          {...register("code")}
          placeholder="Enter 6-digit OTP"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.code && (
          <p className="text-sm text-red-600">{errors.code.message}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className={`w-full py-2 font-semibold text-white rounded ${
            isPending ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isPending ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};
