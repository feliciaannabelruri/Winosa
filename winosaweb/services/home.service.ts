import api from "@/lib/axios";

export const getHomeData = async () => {
  const [servicesRes, portfolioRes, blogRes] = await Promise.all([
    api.get("/services"),
    api.get("/portfolios"),
    api.get("/blogs"),
  ]);

  return {
    services: servicesRes.data.data,
    portfolios: portfolioRes.data.data,
    blogs: blogRes.data.data,
  };
};