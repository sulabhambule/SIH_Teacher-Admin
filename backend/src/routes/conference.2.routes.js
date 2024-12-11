import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  addConference,
  getAllConferences,
} from "../controllers/conference.controllers.2.js";
const router = Router();

router.post("/conference/add", verifyTeacherJWT, addConference);
router.get("/conference/get", verifyTeacherJWT, getAllConferences);
router.patch("/conference/get/:id", verifyTeacherJWT, updateConference);
router.delete("/conference/delete/:id", verifyTeacherJWT, deleteConference);

export default router;
