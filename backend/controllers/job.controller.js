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

export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.id;
        // Import User model dynamically if not imported at top to avoid circular deps if any, 
        // but importing at top is fine. Let's just require it or import it at the top of file.
        // I will do a dynamic import here to make it absolutely safe and localized.
        const { User } = await import("../models/user.model.js");

        const user = await User.findById(userId).populate({
            path: 'profile.savedJobs',
            populate: {
                path: 'company'
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found.", success: false });
        }

        return res.status(200).json({
            savedJobs: user.profile.savedJobs || [],
            success: true
        });
    } catch (error) {
        console.error("Get Saved Jobs Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const getAnalytics = async (req, res) => {
    try {
        const adminId = req.id;
        
        const jobs = await Job.find({ created_by: adminId }).populate('applications');
        
        const totalJobs = jobs.length;
        let totalApplications = 0;
        let statusDistribution = { pending: 0, accepted: 0, rejected: 0 };
        let applicationsPerDay = {};

        jobs.forEach((job) => {
            totalApplications += job.applications.length;
            job.applications.forEach(app => {
                if (app.status && statusDistribution[app.status] !== undefined) {
                    statusDistribution[app.status] += 1;
                }
                
                if (app.createdAt) {
                    const dateObj = new Date(app.createdAt);
                    const date = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
                    
                    if (!applicationsPerDay[date]) {
                        applicationsPerDay[date] = 0;
                    }
                    applicationsPerDay[date] += 1;
                }
            });
        });

        const statusData = [
            { name: "Pending", value: statusDistribution.pending },
            { name: "Accepted", value: statusDistribution.accepted },
            { name: "Rejected", value: statusDistribution.rejected }
        ];

        const timelineData = Object.keys(applicationsPerDay).sort().map(date => ({
            date: date,
            applications: applicationsPerDay[date]
        }));

        return res.status(200).json({
            stats: { totalJobs, totalApplications },
            statusData,
            timelineData,
            success: true
        });

    } catch (error) {
        console.error("Get Analytics Error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const getJobMatchScore = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found.", success: false });
        }

        const { User } = await import("../models/user.model.js");
        const user = await User.findById(userId);

        const candidateProfile = `${user.profile?.bio || ''} ${user.profile?.skills?.join(' ') || ''}`;
        const requirements = `${job.description} ${job.requirements?.join(' ') || ''}`;

        let score = 0;
        let reasoning = "Based on keyword overlap using local heuristic search.";
        
        // Attempt AI generation
        if (process.env.GEMINI_API_KEY) {
            try {
                const { GoogleGenerativeAI } = await import("@google/generative-ai");
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
                
                const prompt = `Compare the following candidate profile against the job requirements. 
                Candidate: ${candidateProfile}
                Requirements: ${requirements}
                Return ONLY a valid JSON object with exactly two keys: "score" (a Number between 0 and 100 representing the match percentage) and "reasoning" (a short 1-2 sentence string explaining why).`;
                
                const result = await model.generateContent(prompt);
                const responseText = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
                const parsed = JSON.parse(responseText);
                score = parsed.score;
                reasoning = parsed.reasoning;
            } catch (aiError) {
                console.error("AI Generation Error, falling back...", aiError);
            }
        } 
        
        // Fallback or if AI failed/unavailable
        if (score === 0 || !process.env.GEMINI_API_KEY) {
            const reqWords = requirements.toLowerCase().split(/\W+/).filter(w => w.length > 3);
            const profWords = candidateProfile.toLowerCase().split(/\W+/).filter(w => w.length > 3);
            
            let matches = 0;
            reqWords.forEach(w => {
                if (profWords.includes(w)) matches++;
            });
            score = Math.min(100, Math.round((matches / (reqWords.length || 1)) * 100 * 1.5));
            if (score > 80) reasoning = "Strong match! Your skills heavily overlap with the requirements.";
            else if (score > 50) reasoning = "Good match. You have several of the required skills.";
            else reasoning = "Partial match. You might want to highlight more relevant skills.";
        }

        return res.status(200).json({
            score,
            reasoning,
            success: true
        });

    } catch (error) {
        console.error("Get Match Score Error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};
