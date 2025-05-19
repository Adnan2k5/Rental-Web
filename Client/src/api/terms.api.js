import axios from "../Middleware/AxiosClient";

export const getLiveTerms = async () => {
  try {
    const response = await axios.get("/api/terms");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching live terms:", error);
    throw error;
  }
};

export const getAllTerms = async () => {
  try {
    const response = await axios.get("/api/terms/admin");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all terms:", error);
    throw error;
  }
};

export const saveDraftTerms = async (content, version) => {
  try {
    const response = await axios.post("/api/terms/draft", {
      content,
      version
    });
    return response.data.data;
  } catch (error) {
    console.error("Error saving draft terms:", error);
    throw error;
  }
};

export const publishTerms = async (content, version, publishedBy) => {
  try {
    const response = await axios.post("/api/terms/publish", {
      content,
      version,
      publishedBy
    });
    return response.data.data;
  } catch (error) {
    console.error("Error publishing terms:", error);
    throw error;
  }
};
