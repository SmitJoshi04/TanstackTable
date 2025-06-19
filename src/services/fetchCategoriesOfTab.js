import axiosInstance from "../lib/axios";

export const GetTab = async () => {
  try {
    const response = await axiosInstance.get("/categories");
    return response.data;
  } catch (error) {
    // Log the error for debugging purposes (optional)
    console.error("Error fetching tabs:", error);

    // Optionally customize the error message
    throw new Error(
      error?.response?.data?.message || "Failed to fetch tab categories"
    );
  }
};
