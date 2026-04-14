import mongoose from "mongoose";
import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName?.trim()) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false,
            });
        }

        const normalizedName = companyName.trim();
        let company = await Company.findOne({ name: normalizedName });
        if (company) {
            return res.status(409).json({
                message: "You can't register the same company twice.",
                success: false,
            });
        }

        company = await Company.create({
            name: normalizedName,
            userId: req.id,
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true,
        });
    } catch (error) {
        console.error("Register Company Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const getCompany = async (req, res) => {
    try {
        const userId = req.id;
        const companies = await Company.find({ userId }).sort({ createdAt: -1 });
        return res.status(200).json({
            companies,
            success: true,
        });
    } catch (error) {
        console.error("Get Company Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;

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

        return res.status(200).json({
            company,
            success: true,
        });
    } catch (error) {
        console.error("Get Company By Id Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const companyId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({
                message: "Invalid company id.",
                success: false,
            });
        }

        const { name, description, website, location } = req.body;
        const updateData = { name, description, website, location };

        if (req.file) {
            const fileUri = getDataUri(req.file);
            if (fileUri?.content) {
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                updateData.logo = cloudResponse.secure_url;
            }
        }

        const company = await Company.findByIdAndUpdate(companyId, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Company information updated.",
            company,
            success: true,
        });
    } catch (error) {
        console.error("Update Company Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};
