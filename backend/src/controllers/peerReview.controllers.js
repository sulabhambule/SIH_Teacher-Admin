import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { ApiError } from "../utils/ApiErrors.js";
import { PeerReview } from "../models/peerReview.models.js";
import { Teacher } from "../models/teachers.models.js";
import mongoose from "mongoose";

const fetchAllPeers = asyncHandler(async (req, res) => {
    const { teacherId } = req.params;
  
    // Validate teacherId
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      throw new ApiError(404, "Invalid Teacher ID");
    }
  
    // Fetch the department of the given teacher
    const teacher = await Teacher.findById(teacherId).select("department");
    if (!teacher) {
      throw new ApiError(404, "Teacher not found");
    }
  
    // Find all teachers in the same department, excluding the given teacher
    const peers = await Teacher.find({ 
      department: teacher.department, 
      _id: { $ne: teacherId },
    }).select("name email department");
  
    res.status(200).json(new ApiResponse(200, {
      success: true,
      data: peers,
    }, "Peers fetched successfully"));
});
  
const fillFeedbackForTeacher = asyncHandler(async (req, res) => {
    const {
      revieweeId,
      reviewerId,
      question1_rating,
      question2_rating,
      question3_rating,
      question4_rating,
      question5_rating,
      question6_rating,
      question7_rating,
      question8_rating,
      question9_rating,
      question10_rating,
      feedback,
    } = req.body;
  
    // Validate the reviewee and reviewer IDs
    if (!mongoose.Types.ObjectId.isValid(revieweeId)) {
      throw new ApiError(404, "Invalid Reviewee ID");
    }
    if (!mongoose.Types.ObjectId.isValid(reviewerId)) {
      throw new ApiError(404, "Invalid Reviewer ID");
    }
  
    // Ensure the reviewee and reviewer are not the same
    if (revieweeId === reviewerId) {
      throw new ApiError(400, "A reviewer cannot review themselves");
    }
  
    // Ensure all ratings are valid (e.g., between 1 and 5)
    const ratings = [
      question1_rating,
      question2_rating,
      question3_rating,
      question4_rating,
      question5_rating,
      question6_rating,
      question7_rating,
      question8_rating,
      question9_rating,
      question10_rating,
    ];
    const isValidRatings = ratings.every((rating) => rating >= 1 && rating <= 5);
    if (!isValidRatings) {
      throw new ApiError(400, "All ratings must be between 1 and 5");
    }
  
    // Create a new peer review document
    const peerReview = new PeerReview({
      reviewee: revieweeId,
      reviewer: reviewerId,
      question1_rating,
      question2_rating,
      question3_rating,
      question4_rating,
      question5_rating,
      question6_rating,
      question7_rating,
      question8_rating,
      question9_rating,
      question10_rating,
      feedback,
      submissionTime: new Date(),
    });
  
    // Save the peer review to the database
    await peerReview.save();
  
    res.status(201).json(new ApiResponse(201, {
      success: true,
      message: "Feedback submitted successfully",
      data: peerReview,
    }, "Feedback submitted successfully"));
});  