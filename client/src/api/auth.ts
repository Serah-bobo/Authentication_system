import {useMutation} from '@tanstack/react-query';
import {registerSchemaType} from '../schemas/registerSchema'
import { LoginSchemaType } from '../schemas/LoginSchema';
import { VerifyOtpSchemaType } from '../schemas/OtpSchema';
import { ForgotPasswordSchemaType } from '../schemas/forgotPasswordSchema';
;const API_URL = "http://localhost:5000/api/auth";

export const useRegister= () => {
    return useMutation({
        //usemutation is used for creating, updating or deleting data
        //it returns an object with properties like isLoading, isError, error, data,
        //mutationfn is a function that performs the mutation
        mutationFn: async(data: registerSchemaType) => {
            const response= await fetch(`${API_URL}/signup`,{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(data)
            } )
            const resData= await response.json();
            if(!response.ok){
                throw new Error(resData.message || 'Something went wrong');
            }
            return resData;
        }
    })
}

export const useLogin = () => {
    return useMutation({
        mutationFn: async (data: LoginSchemaType) => {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(data)
            });
            const resData = await response.json();
            if (!response.ok) {
                throw new Error(resData.message || 'Something went wrong');
            }
            return resData;
        }
    })
}

//verify otp
export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: async (data: VerifyOtpSchemaType) => {
      console.log("Sending payload to server:", data);

      const res = await fetch(`${API_URL}/verify-2fa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // So cookies work with HTTP-only
        body: JSON.stringify({
          userId: localStorage.getItem("userId"), // 🔷 send userId from localStorage
          code: data.code, // 🔷 send as `code`
        }),
        
      });

      const resData = await res.json();
console.log("Response status", res.status);

      if (!res.ok) {
        throw new Error(resData.message || "Failed to verify OTP");
      }

      return resData;
    },
  });
};


//forgot password
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordSchemaType) => {
      const res = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || "Failed to send reset email");
      }

      return resData;
    },
  });
};

//reset password
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async ({ token, password }: { token: string; password: string }) => {
      const res = await fetch(`${API_URL}/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ newPassword:password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password");

      return data;
    },
  });
};