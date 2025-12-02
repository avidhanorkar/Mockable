import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const useGoogleAuth = () => {
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    const login = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (authResult) => {
            if (authResult.code) {
                const result = await axios.post(`http://localhost:3000/v1/auth/google?code=${authResult.code}`, {}, {
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