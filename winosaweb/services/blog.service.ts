import api from "@/lib/axios";

export const getBlogs = async () => {
  const res = await api.get("/blogs");
  return res.data.data;
};