import {useMutation} from '@tanstack/react-query';
import {registerSchemaType} from '../schemas/registerSchema'

const API_URL = "http://localhost:5000/api/auth";

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
