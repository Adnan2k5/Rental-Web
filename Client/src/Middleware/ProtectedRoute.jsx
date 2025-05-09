import { useAuth } from "./AuthProvider";

export const ProtectedRoute = ({ children }) => {
    const user = useAuth();
    const isAdmin = user?.user?.role === 'admin';

    if (isAdmin) {
        return children;
    }
    else {
        return <h1 className="text-3xl text-center">Restricted Page</h1>
    }
};
