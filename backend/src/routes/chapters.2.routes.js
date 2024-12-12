import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";
import { addChapter, getChapters, updateChapter } from "../controllers/chapter.controllers.2.js";

const router = Router();

router.post("/chapter/add", verifyTeacherJWT, addChapter);
router.get("/chapter/:id", verifyTeacherJWT, getChapters);
router.patch("/chapter/edit/:id", verifyTeacherJWT, updateChapter);
// router.delete("/chapter/delete/:id", verifyTeacherJWT, deleteChapter);



export default router;
