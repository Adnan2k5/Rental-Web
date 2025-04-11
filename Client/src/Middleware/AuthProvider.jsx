import { setUser, loginFailure } from "../Store/UserSlice";
import { useEffect, useState, createContext, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "./AxiosClient";
import { Loader } from "../Components/loader";
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const { user } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const verifyToken = async () => {
        try {
            const res = await axiosClient.get('/api/user/me', { withCredentials: true });
            dispatch(setUser(res.data.data))
        }
        catch (err) {
            dispatch(loginFailure(err.response?.status || 500));
        }
        finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        verifyToken();
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {loading ? <Loader /> : children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};

