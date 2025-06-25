import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '../api/auth';
import { registerSchema, registerSchemaType } from '../schemas/registerSchema';
import { FaEye, FaEyeSlash, FaLock, FaUser } from 'react-icons/fa';
import { useState } from 'react';

export const RegisterUser = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<registerSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  const { mutateAsync, isPending, error } = useRegister();

  const onSubmit = async (data: registerSchemaType) => {
    try {
      await mutateAsync(data);
      setSuccessMessage(
        'Registration successful! Please check your email to verify your account.'
      );
    } catch (err) {
      // Handled by error state
    }
  };

  return (
    <div className="max-w-md p-6 mx-auto mt-10 bg-white border rounded-lg shadow-lg">
      <h2 className="mb-4 text-2xl font-bold text-center">Create Account</h2>

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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
            Name
          </label>
          <div className="relative">
            <span className="absolute text-gray-500 transform -translate-y-1/2 left-3 top-1/2">
              <FaUser />
            </span>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="w-full py-2 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <span className="absolute text-gray-500 transform -translate-y-1/2 left-3 top-1/2">
              <FaLock />
            </span>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className="w-full py-2 pl-10 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-gray-500 transform -translate-y-1/2 right-3 top-1/2"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isPending || isSubmitting}
          className="w-full py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          {isPending || isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};
