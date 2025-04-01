import axiosClient from "../Middleware/AxiosClient"

export const fetchAllItems = async () => {
    const res = await axiosClient.get("/api/item/discover");
    return res
}

export const createItems = async (data) => {
    console.log("data", data);
    const res = await axiosClient.post("/api/item/upload", data, {withCredentials: true, headers: { "Content-Type": "multipart/form-data" }});
    console.log(res);
}