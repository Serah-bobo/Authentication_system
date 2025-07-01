import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOtpSchema, VerifyOtpSchemaType } from "../schemas/OtpSchema";
import { useVerifyOtp } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const VerifyOtp = () => {
  const navigate = useNavigate();

  // Load userId from localStorage
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    // Redirect if userId is not found
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOtpSchemaType>({
    resolver: zodResolver(verifyOtpSchema),
  });

  const { mutate, isPending, error } = useVerifyOtp();

  // Define a type that includes userId
  type VerifyOtpWithUserId = VerifyOtpSchemaType & { userId: string };

  const onSubmit = (data: VerifyOtpSchemaType) => {
    if (!userId) return;

    mutate(
      { ...data, userId } as VerifyOtpWithUserId, // attach userId and cast to correct type
      {
        onSuccess: () => {
          localStorage.removeItem("userId"); // clear it after success
          navigate("/dashboard");
        },
      }
    );
  };

  return (
    <div className="max-w-md p-6 mx-auto mt-20 bg-white rounded shadow">
      <h2 className="mb-4 text-2xl font-bold text-center">Enter OTP</h2>

      {error && (
        <div className="p-2 mb-4 text-sm text-red-800 bg-red-100 rounded">
          {(error as Error).message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          {...register("otp")}
          placeholder="Enter 6-digit OTP"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.otp && (
          <p className="text-sm text-red-600">{errors.otp.message}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          {isPending ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};
