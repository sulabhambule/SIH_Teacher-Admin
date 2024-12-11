import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler2.js";
import { Book } from "../models/books.models.2.js";

// Add a new book
const addBook = asyncHandler(async (req, res) => {
  const {
    title,
    authors,
    publicationDate,
    volume,
    pages,
    publication,
    h5_index,
    h5_median,
    owner,
  } = req.body;

  if (!title || !authors || !publicationDate || !volume || !pages || !publication || !owner) {
    throw new ApiError(400, "All required fields must be provided");
  }

  const book = await Book.create({
    title,
    authors,
    publicationDate,
    volume,
    pages,
    publication,
    h5_index,
    h5_median,
    owner,
  });

  ApiResponse.success(res, 201, "Book added successfully", book);
});

// Get all books
const getBooks = asyncHandler(async (req, res) => {
  const books = await Book.find().populate("owner", "name email");
  ApiResponse.success(res, 200, "Books retrieved successfully", books);
});

// Update a book
const updateBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    authors,
    publicationDate,
    volume,
    pages,
    publication,
    h5_index,
    h5_median,
  } = req.body;

  const book = await Book.findById(id);

  if (!book) {
    throw new ApiError(404, "Book not found");
  }

  book.title = title || book.title;
  book.authors = authors || book.authors;
  book.publicationDate = publicationDate || book.publicationDate;
  book.volume = volume || book.volume;
  book.pages = pages || book.pages;
  book.publication = publication || book.publication;
  book.h5_index = h5_index !== undefined ? h5_index : book.h5_index;
  book.h5_median = h5_median !== undefined ? h5_median : book.h5_median;

  const updatedBook = await book.save();

  res.status(200).json(new ApiResponse(200, updatedBook, "Book updated successfully"));
});

// Delete a book
const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const book = await Book.findById(id);

  if (!book) {
    throw new ApiError(404, "Book not found");
  }

  await book.deleteOne();

  res.status(200).json(new ApiResponse(200, book, "Book deleted successfully"));
});

export { addBook, getBooks, updateBook, deleteBook };