import axiosInstance from "../lib/axios";

export const GetTableData = async ({
  search,
  infrastructure_id,
  limit,
  page,
}) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (infrastructure_id) params.append("infrastructure_id", infrastructure_id); // ✅ FIXED
  if (limit) params.append("limit", limit);
  if (page) params.append("page", page);

  try {
    const response = await axiosInstance.get(
      `/submission-list?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching table data:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch table data"
    );
  }
};
