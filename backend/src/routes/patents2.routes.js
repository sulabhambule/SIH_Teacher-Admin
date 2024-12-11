import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyTeacherJWT } from "../middleware/teacher.auth.middleware.js";
import { addPatent, getAllPatents } from "../controllers/patents.controller.2.js";

const router = Router();

router.post("/patent/add", verifyTeacherJWT, addPatent);
router.get("/patent/get", verifyTeacherJWT, getAllPatents);
// router.patch("/patent/edit/:id", verifyTeacherJWT, updatePatent);

export default router;