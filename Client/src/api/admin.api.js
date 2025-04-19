import axiosClient from "../Middleware/AxiosClient";

export const getStats = async () => {
    try {
        const res = await axiosClient.get("/api/admin/", {
            withCredentials: true,
        });
        return res.data.data;
    }
    catch(err) {
        if (err.response.status) {
            return err.response.status;
        }
    }
}

export const getAllUsers = async () => {
    try {
        const res = await axiosClient.get("/api/admin/users", {
            withCredentials: true,
        });
        return res.data.data;
    }
    catch(err) {
        if (err.response.status) {
            return err.response.status;
        }
    }
}