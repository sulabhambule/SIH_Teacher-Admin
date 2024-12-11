import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Conference2 } from "../models/conferences.models.2.js";
import { PublicationPoint } from "../models/publication-points.models.js";

const addConference = asyncHandler(async (req, res) => {
  const {
    title,
    authors,
    publicationDate,
    conference,
    volume,
    issue,
    pages,
    conferenceType,
    publication,
  } = req.body;

  const owner = req.teacher._id;

  // Check for mandatory fields
  if (
    !title ||
    !authors ||
    !publicationDate ||
    !conference ||
    !conferenceType
  ) {
    throw new ApiError(400, "Please provide all mandatory fields");
  }

  // Validate the publication ID if provided
  let h5_index = null;
  let h5_median = null;

  if (publication) {
    if (!mongoose.Types.ObjectId.isValid(publication)) {
      throw new ApiError(404, "Invalid publication ID");
    }

    const publications = await PublicationPoint.findById(publication);

    if (!publications) {
      throw new ApiError(404, "Publication not found");
    }

    h5_index = publications.hindex;
    h5_median = publications.median;
  }

  // Create the conference entry
  try {
    const conferenceEntry = await Conference.create({
      title,
      authors,
      publicationDate,
      conference,
      volume,
      issue,
      pages,
      conferenceType,
      h5_index,
      h5_median,
      owner,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, conferenceEntry, "Conference added successfully")
      );
  } catch (error) {
    throw new ApiError(500, "An error occurred while adding the conference");
  }
});

const updateConference = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    authors,
    publicationDate,
    conference,
    volume,
    issue,
    pages,
    conferenceType,
  } = req.body;

  const updatedConference = await Conference2.findByIdAndUpdate(
    id,
    {
      $set: {
        title,
        authors,
        publicationDate,
        conference,
        volume,
        issue,
        pages,
        conferenceType,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedConference) {
    throw new ApiError(404, "Conference not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedConference, "Conference updated successfully")
    );
});

const deleteConference = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedConference = await Conference.findByIdAndDelete(id);

  if (!deletedConference) {
    throw new ApiError(404, "Conference not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Conference deleted successfully"));
});

const getAllConferences = asyncHandler(async (req, res) => {
  const owner = req.teacher._id;
  const conferences = await Conference2.find({ owner }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        conferences,
        "All conferences retrieved successfully"
      )
    );
});

export { addConference, updateConference, deleteConference, getAllConferences };
