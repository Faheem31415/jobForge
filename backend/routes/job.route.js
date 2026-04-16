import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob, getSavedJobs, getAnalytics, getJobMatchScore } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/analytics").get(isAuthenticated, getAnalytics);
router.route("/get/:id").get(getJobById);
router.route("/match/:id").get(isAuthenticated, getJobMatchScore);
router.route("/saved").get(isAuthenticated, getSavedJobs);

export default router;
