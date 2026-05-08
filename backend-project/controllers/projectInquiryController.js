const ProjectInquiry = require("../models/projectInquiry");

const createInquiry = async (req, res) => {
  try {
    const inquiry = await ProjectInquiry.create(req.body);

    res.status(201).json({
      success: true,
      data: inquiry,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to submit inquiry",
    });
  }
};

module.exports = {
  createInquiry,
};