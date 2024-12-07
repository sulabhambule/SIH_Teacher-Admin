import mongoose, { Schema } from "mongoose";

const peerReviewSchema = new Schema(
  {
    reviewee: {
      type: Schema.Types.ObjectId,
      ref: "Teacher", // The person being reviewed (e.g., a teacher or peer)
      required: true,
    },
    reviewer: {
      type: Schema.Types.ObjectId,
      ref: "Teacher", // The person providing the review
      required: true,
    },
    question1_rating: {
      type: Number,
      required: true,
    },
    question2_rating: {
      type: Number,
      required: true,
    },
    question3_rating: {
      type: Number,
      required: true,
    },
    question4_rating: {
      type: Number,
      required: true,
    },
    question5_rating: {
      type: Number,
      required: true,
    },
    question6_rating: {
      type: Number,
      required: true,
    },
    question7_rating: {
      type: Number,
      required: true,
    },
    question8_rating: {
      type: Number,
      required: true,
    },
    question9_rating: {
      type: Number,
      required: true,
    },
    question10_rating: {
      type: Number,
      required: true,
    },
    feedback: {
      type: String, // Feedback or comments provided by the reviewer
      required: true,
      trim: true,
    },
    submissionTime: {
      type: Date,
      required: true,
    },
    feedbackReleased: {
      type: Boolean, // Whether the feedback has been released to the reviewee
      default: false,
    },
    activeUntil: {
      type: Date, // The deadline for the reviewee to view the feedback
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Admin", // Admin or authority managing the peer review process
    },
  },
  { timestamps: true }
);

// Static method to reset feedbackReleased for expired reviews
peerReviewSchema.statics.resetExpiredFeedbacks = async function () {
  const now = new Date();

  const result = await this.updateMany(
    {
      feedbackReleased: true,
      activeUntil: { $lte: now },
    },
    { $set: { feedbackReleased: false } }
  );

  return result;
};

export const PeerReview = mongoose.model("PeerReview", peerReviewSchema);
