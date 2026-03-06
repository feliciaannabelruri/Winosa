import api from "@/lib/axios";

export const getPortfolios = async () => {
  const res = await api.get("/portfolio");
  return res.data.data;
};