import { Link } from "react-router-dom";

const VerifyFailed = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-red-50">
      <h1 className="mb-4 text-3xl font-bold text-red-600">Verification Failed ❌</h1>
      <p className="mb-6 text-lg text-gray-700">
        The verification link is invalid or has expired.
      </p>
      <Link
        to="/"
        className="px-6 py-2 text-white transition bg-red-600 rounded hover:bg-red-700"
      >
        Go Back to Register
      </Link>
    </div>
  );
};

export default VerifyFailed;
