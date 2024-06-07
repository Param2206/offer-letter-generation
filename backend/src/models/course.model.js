import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    totalAnnualTuitionFee: {
      type: Number,
      required: true,
    },
    hostelMessAndOtherFees: {
      type: Number,
      required: true,
    },
    totalAnnualFees: {
      type: Number,
      required: true,
    },
    specialScholarshipFromInstitute: {
      type: Number,
      default: 0,
    },
    MUPresidentsSpecialScholarship: {
      type: Number,
      default: 0,
    },
    netAnnualFeePayable: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Capitalize string fields and uppercase studentId before saving
courseSchema.pre("save", async function (next) {
  const stringFields = ["courseName", "qualification"];

  stringFields.forEach((field) => {
    if (this.isModified(field)) {
      this[field] = this[field].replace(/\b\w/g, (char) => char.toUpperCase());
    }
  });

  next();
});

export const Course = mongoose.model("Course", courseSchema);
