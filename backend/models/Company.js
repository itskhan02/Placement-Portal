const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    location: { type: String },
    website: { type: String },
    logo: { type: String, default: "" },
    logoPublicId: { type: String, default: "" },
    logoResourceType: { type: String, default: "image" },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublic: { type: Boolean, default: true },

    // status: {
    //   type: String,
    //   enum: ["pending", "approved", "rejected"],
    //   default: "pending",
    // },
    // approvalNotes: { type: String, default: "" },
    // approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // approvedAt: { type: Date },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.models.Company || mongoose.model("Company", companySchema);
