import mongoose from "mongoose";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Invalid job id.",
                success: false,
            });
        }

        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if (existingApplication) {
            return res.status(409).json({
                message: "You have already applied for this job.",
                success: false,
            });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false,
            });
        }

        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        });

        job.applications.push(newApplication._id);
        await job.save();

        return res.status(201).json({
            message: "Job applied successfully.",
            success: true,
        });
    } catch (error) {
        console.error("Apply Job Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: "job",
                populate: {
                    path: "company",
                },
            });

        return res.status(200).json({
            application,
            success: true,
        });
    } catch (error) {
        console.error("Get Applied Jobs Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const getApplicants = async (req, res) => {
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
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "applicant",
                select: "fullname email phoneNumber profile",
            },
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false,
            });
        }

        return res.status(200).json({
            job,
            success: true,
        });
    } catch (error) {
        console.error("Get Applicants Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { status, interviewDate, interviewLink } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({
                message: "status is required",
                success: false,
            });
        }

        if (!mongoose.Types.ObjectId.isValid(applicationId)) {
            return res.status(400).json({
                message: "Invalid application id.",
                success: false,
            });
        }

        const normalizedStatus = status.toLowerCase();
        const validStatuses = ["pending", "accepted", "rejected"];

        if (!validStatuses.includes(normalizedStatus)) {
            return res.status(400).json({
                message: "Invalid status value.",
                success: false,
            });
        }

        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false,
            });
        }

        application.status = normalizedStatus;
        
        if (normalizedStatus === 'accepted' && interviewDate) {
            application.interviewDate = new Date(interviewDate);
            application.interviewLink = interviewLink;

            // Trigger Email
            await application.populate('applicant');
            await application.populate({ path: 'job', populate: { path: 'company' } });
            
            if (application.applicant?.email && application.job) {
                const { sendInterviewEmail } = await import("../utils/email.js");
                await sendInterviewEmail(
                    application.applicant.email,
                    application.applicant.fullname,
                    application.job.title,
                    application.job.company?.name || 'our company',
                    interviewDate,
                    interviewLink
                );
            }
        }

        await application.save();

        // Socket.IO Notification
        try {
            const { io, getReceiverSocketId } = await import("../utils/socket.js");
            // If they didn't populate applicant yet, we don't have _id (it's populated above in accepted loop though)
            const applicantId = application.applicant?._id || application.applicant;
            const applicantSocketId = getReceiverSocketId(applicantId.toString());
            
            if (applicantSocketId) {
                io.to(applicantSocketId).emit("notification", {
                    message: `Your application status for a job has been updated to ${normalizedStatus}!`,
                    type: normalizedStatus
                });
            }
        } catch (socketError) {
            console.error("Socket notification error:", socketError);
        }

        return res.status(200).json({
            message: normalizedStatus === 'accepted' ? "Status updated & Interview invite sent." : "Status updated successfully.",
            success: true,
        });
    } catch (error) {
        console.error("Update Status Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};
