import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

import { useAuth } from "../context/authContext";

const useGoogleAuth = () => {

    const { login: authLogin } = useAuth();

    const login = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (authResult) => {
            if (authResult.code) {
                const result = await axios.post(`https://mockable.onrender.com/v1/auth/google?code=${authResult.code}`, {}, {
                    withCredentials: true
                })

                const { user, token } = result.data;

                authLogin(token, user);
            }
        },
        onError: (error) => {
            console.log("Error: " + error)
        }
    });

    return login;
}

export default useGoogleAuth;