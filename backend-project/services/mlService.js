const axios = require("axios");
const Blog = require("../models/Blog");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL;

async function trainML() {
  const blogs = await Blog.find({ isPublished: true })
    .select("title slug excerpt image author tags views readTime createdAt")
    .lean();

  const res = await axios.post(`${ML_SERVICE_URL}/train`, {
    blogs
  });

  return res.data;
}

module.exports = { trainML };