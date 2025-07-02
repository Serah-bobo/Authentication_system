import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordSchemaType } from "../schemas/resetPassword";
import { useResetPassword } from "../api/auth";
import { useParams, useNavigate } from "react-router-dom";

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { mutate, isPending, error, isSuccess } = useResetPassword();

  const onSubmit = (data: ResetPasswordSchemaType) => {
    if (token) {
      mutate(
        { token, password: data.password },
        {
          onSuccess: () => {
            navigate("/login");
          },
        }
      );
    }
  };

  return (
    <div className="max-w-md p-6 mx-auto mt-20 bg-white rounded shadow">
      <h2 className="mb-4 text-2xl font-bold text-center">Reset Password</h2>

      {error && (
        <div className="p-2 mb-4 text-red-800 bg-red-100 rounded">
          {(error as Error).message}
        </div>
      )}

      {isSuccess && (
        <div className="p-2 mb-4 text-green-800 bg-green-100 rounded">
          Password reset successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="password"
          {...register("password")}
          placeholder="New Password"
          className="w-full px-3 py-2 border rounded"
        />
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}

        <input
          type="password"
          {...register("confirmPassword")}
          placeholder="Confirm New Password"
          className="w-full px-3 py-2 border rounded"
        />
        {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          {isPending ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};
