import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    reportData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // Automatically delete the cached document after 7 days (604,800 seconds)
      expires: 604800,
    },
  },
  {
    // Automatically manage updatedAt timestamps
    timestamps: true,
  }
);

// Indexing compound fields to speed up cache lookups
reportSchema.index({ companyName: 1, model: 1, temperature: 1 });

const Report = mongoose.model("Report", reportSchema);

export default Report;
