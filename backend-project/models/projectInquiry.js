const mongoose = require("mongoose");

const projectInquirySchema = new mongoose.Schema(
  {
    fullName: String,
    companyName: String,
    email: String,
    phone: String,
    service: String,
    budget: String,
    timeline: String,
    currentProblem: String,
    projectGoals: String,
    features: String,
    referenceUrl: String,
    additionalNotes: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ProjectInquiry",
  projectInquirySchema
);