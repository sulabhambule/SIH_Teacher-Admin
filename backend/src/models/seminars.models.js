import mongoose, { Schema } from "mongoose";
import { Point } from "./points.models.js";
import { SeminarFeedback } from "./feedback-seminars.models.js";
import { DomainPoint } from "./domainpoints.models.js";

const seminarSchema = new Schema(
  {
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    report: {
      type: String,
      required: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    feedbackReleased: {
      type: Boolean,
      default: false,
    },
    activeUntil: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Helper function to fetch base points for a domain
const getPointsForDomain = async (domain) => {
  const domainPoint = await DomainPoint.findOne({ domain });
  return domainPoint?.points || 0;
};

// Ensure a seminar points record exists for every teacher
seminarSchema.post("save", async function (doc) {
  const basePoints = await getPointsForDomain("Seminar");
  const existingPoint = await Point.findOne({ owner: doc.owner, domain: "Seminar" });

  if (existingPoint) {
    // Update existing points record with new seminar base points
    await Point.findByIdAndUpdate(
      existingPoint._id,
      { $inc: { points: basePoints } },
      { new: true }
    );
  } else {
    // Create a new points record if none exists
    await Point.create({
      date: new Date(), // Use the current date
      points: basePoints,
      domain: "Seminar",
      owner: doc.owner,
    });
  }
});

// Before saving, ensure feedbackReleased is updated based on activeUntil
seminarSchema.pre("save", function (next) {
  if (this.activeUntil && this.activeUntil < new Date()) {
    this.feedbackReleased = false;
  }
  next();
});

// Method to allocate feedback points to the seminar's points record
seminarSchema.methods.allocateFeedbackPoints = async function () {
  if (!this.feedbackReleased && this.activeUntil && this.activeUntil < new Date()) {
    const feedbacks = await SeminarFeedback.find({ seminar: this._id });

    if (feedbacks.length > 0) {
      const averageRating =
        feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length;

      const seminarPoint = await Point.findOne({
        owner: this.owner,
        domain: "Seminar",
      });

      if (seminarPoint) {
        // Add feedback points to the existing seminar points record
        await Point.findByIdAndUpdate(
          seminarPoint._id,
          { $inc: { points: averageRating } },
          { new: true }
        );
      }
    }
  }
};

// Ensure points and feedback are cleaned up after seminar deletion
seminarSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;

  const basePoints = await getPointsForDomain("Seminar");

  const seminarPoint = await Point.findOne({
    owner: doc.owner,
    domain: "Seminar",
  });

  if (seminarPoint) {
    // Deduct base points related to the deleted seminar
    await Point.findByIdAndUpdate(
      seminarPoint._id,
      { $inc: { points: -basePoints } },
      { new: true }
    );
  }

  // Remove all feedback related to the seminar
  await SeminarFeedback.deleteMany({ seminar: doc._id });
});

export const Seminar = mongoose.model("Seminar", seminarSchema);