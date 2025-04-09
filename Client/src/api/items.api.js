import axiosClient from "../Middleware/AxiosClient"

export const fetchAllItems = async ({ priceRange, categories, brands, availability, rating }) => {
    const res = await axiosClient.get("/api/item/discover", { 
        withCredentials: true, 
        params: { 
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            category: categories, 
            brands, 
            availability,
            rating 
        } 
    });
    return res;
}

export const createItems = async (data) => {
    console.log("data", data);
    const res = await axiosClient.post("/api/item/upload", data, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } });
    console.log(res);
}


export const deleteItem = async (id) => {
    const res = await axiosClient.delete(`/api/item/${id}`, { withCredentials: true });
    return res
}