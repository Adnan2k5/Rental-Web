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

export const getAllUsers = async (page = 1, limit = 10) => {
    try {
        const res = await axiosClient.get(`/api/admin/users?page=${page}&limit=${limit}`, {
            withCredentials: true,
        });
        return res.data.data;
    }
    catch(err) {
        if (err.response && err.response.status) {
            return err.response.status;
        }
    }
}

export const changeUserStatus = async (userId, status) => {
    try {
        const res = await axiosClient.post(`/api/admin/users/${userId}`, { status }, {
            withCredentials: true,
        });
        return res.data.data;
    }
    catch(err) {
        console.error(err);
    }
}