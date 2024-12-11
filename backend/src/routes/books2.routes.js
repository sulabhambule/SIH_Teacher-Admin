import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";
<<<<<<< HEAD
import { addBook, getBooks, deleteBook } from "../controllers/book.controllers.2.js";
=======
import { addBook, getBooks } from "../controllers/book.controllers.2.js";
>>>>>>> 7d3cc02a661246ddd23eef92bbfcce5fd2560d9f

const router = Router();

router.post("/book/add", verifyTeacherJWT, addBook);
router.get("/book/:id", verifyTeacherJWT, getBooks);
// router.patch("/book/edit/:id", verifyTeacherJWT, updateBook);
router.delete("/book/delete/:id", verifyTeacherJWT, deleteBook);

export default router;
