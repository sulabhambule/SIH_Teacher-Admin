import { asyncHandler } from "../utils/AsyncHandler2.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Chapter } from "../models/chapter.models.2.js";
import { ApiError } from "../utils/ApiErrors.js";

// Add a new chapter
const addChapter = asyncHandler(async (req, res) => {
  const {
    title,
    authors,
    publicationDate,
    book,
    volume,
    pages,
    publisher,
    publication,
    h5_index,
    h5_median,
    owner,
  } = req.body;

  if (!title || !authors || !publicationDate || !publication || !owner) {
    throw new ApiError(400, "Required fields: title, authors, publicationDate, publication, owner");
  }

  const chapter = await Chapter.create({
    title,
    authors,
    publicationDate,
    book,
    volume,
    pages,
    publisher,
    publication,
    h5_index,
    h5_median,
    owner,
  });

  if (chapter) {
    res.status(201).json(new ApiResponse(201, chapter, "Chapter added successfully"));
  } else {
    throw new ApiError(500, "Failed to add chapter");
  }
});

// Get all chapters
const getChapters = asyncHandler(async (req, res) => {
  const chapters = await Chapter.find().populate("owner", "name email");
  res.status(200).json(new ApiResponse(200, chapters));
});

// Update a chapter
const updateChapter = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    authors,
    publicationDate,
    book,
    volume,
    pages,
    publisher,
    publication,
    h5_index,
    h5_median,
  } = req.body;

  const chapter = await Chapter.findById(id);

  if (!chapter) {
    throw new ApiError(404, "Chapter not found");
  }

  chapter.title = title || chapter.title;
  chapter.authors = authors || chapter.authors;
  chapter.publicationDate = publicationDate || chapter.publicationDate;
  chapter.book = book || chapter.book;
  chapter.volume = volume || chapter.volume;
  chapter.pages = pages || chapter.pages;
  chapter.publisher = publisher || chapter.publisher;
  chapter.publication = publication || chapter.publication;
  chapter.h5_index = h5_index !== undefined ? h5_index : chapter.h5_index;
  chapter.h5_median = h5_median !== undefined ? h5_median : chapter.h5_median;

  const updatedChapter = await chapter.save();

  res.status(200).json(new ApiResponse(200, updatedChapter, "Chapter updated successfully"));
});

// Delete a chapter
const deleteChapter = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const chapter = await Chapter.findById(id);

  if (!chapter) {
    throw new ApiError(400, "Chapter not found");
  }

  await chapter.deleteOne();

  res.status(200).json(new ApiResponse(200, "Chapter deleted successfully"));
});

export { addChapter, getChapters, updateChapter, deleteChapter };
