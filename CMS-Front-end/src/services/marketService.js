import { apiRequest } from "../lib/apiClient";

export async function getPublicProducts() {
  const response = await apiRequest("/market/products/public");
  return response?.data || [];
}
