import { Link } from 'react-router-dom';

const EmailVerified = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 bg-gray-50">
      <div className="max-w-md p-6 text-center bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-green-600">Email Verified!</h2>
        <p className="mb-6 text-gray-700">
          Your email has been successfully verified. You can now log in to your account.
        </p>
        <Link
          to="/login"
          className="inline-block px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default EmailVerified;
