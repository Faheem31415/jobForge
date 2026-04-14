import mongoose from "mongoose";
import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Required fields are missing.",
                success: false,
            });
        }

        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({
                message: "Invalid company id.",
                success: false,
            });
        }

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false,
            });
        }

        const requirementsList = String(requirements)
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

        const job = await Job.create({
            title: title.trim(),
            description: description.trim(),
            requirements: requirementsList,
            salary: Number(salary),
            location: location.trim(),
            jobType: jobType.trim(),
            experienceLevel: Number(experience),
            position: Number(position),
            company: companyId,
            created_by: userId,
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true,
        });
    } catch (error) {
        console.error("Post Job Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const getAllJobs = async (req, res) => {
    try {
        const keyword = escapeRegex(req.query.keyword || "");
        const query = keyword
            ? {
                  $or: [
                      { title: { $regex: keyword, $options: "i" } },
                      { description: { $regex: keyword, $options: "i" } },
                  ],
              }
            : {};

        const jobs = await Job.find(query).populate({ path: "company" }).sort({ createdAt: -1 });

        return res.status(200).json({
            jobs,
            success: true,
        });
    } catch (error) {
        console.error("Get All Jobs Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Invalid job id.",
                success: false,
            });
        }

        const job = await Job.findById(jobId).populate({
            path: "applications",
            select: "applicant status createdAt",
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false,
            });
        }

        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.error("Get Job By Id Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId })
            .populate({ path: "company" })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            jobs,
            success: true,
        });
    } catch (error) {
        console.error("Get Admin Jobs Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};
