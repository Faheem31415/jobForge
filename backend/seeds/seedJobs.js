import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";

dotenv.config({});

const recruiterSeed = {
  fullname: "Seed Recruiter",
  email: "seed.recruiter@jobforge.dev",
  phoneNumber: 9876543210,
  role: "recruiter",
  password: "Password@123"
};

const companySeeds = [
  {
    name: "NovaTech Labs",
    description: "Building scalable hiring and productivity platforms.",
    website: "https://novatech.example.com",
    location: "San Francisco, CA"
  },
  {
    name: "BrightPixel Studio",
    description: "Design-first product engineering for startups.",
    website: "https://brightpixel.example.com",
    location: "Austin, TX"
  },
  {
    name: "CloudBridge Systems",
    description: "Cloud modernization and developer tooling.",
    website: "https://cloudbridge.example.com",
    location: "Seattle, WA"
  }
];

const jobSeeds = [
  {
    title: "Frontend Developer",
    description: "Build responsive UI components in React and optimize UX performance.",
    requirements: ["React", "JavaScript", "Tailwind CSS"],
    salary: 14,
    experienceLevel: 2,
    location: "Remote",
    jobType: "Full-time",
    position: 2,
    companyName: "NovaTech Labs"
  },
  {
    title: "Backend Engineer",
    description: "Develop and maintain secure REST APIs using Node.js and MongoDB.",
    requirements: ["Node.js", "Express", "MongoDB"],
    salary: 18,
    experienceLevel: 3,
    location: "Seattle, WA",
    jobType: "Full-time",
    position: 1,
    companyName: "CloudBridge Systems"
  },
  {
    title: "UI/UX Designer",
    description: "Create design systems and high-fidelity product experiences.",
    requirements: ["Figma", "Wireframing", "Prototyping"],
    salary: 11,
    experienceLevel: 2,
    location: "Austin, TX",
    jobType: "Full-time",
    position: 1,
    companyName: "BrightPixel Studio"
  },
  {
    title: "DevOps Engineer",
    description: "Automate deployments and improve infrastructure reliability across environments.",
    requirements: ["Docker", "CI/CD", "AWS"],
    salary: 20,
    experienceLevel: 4,
    location: "Remote",
    jobType: "Full-time",
    position: 1,
    companyName: "CloudBridge Systems"
  },
  {
    title: "Product Manager",
    description: "Drive roadmap planning and cross-functional delivery for hiring workflows.",
    requirements: ["Roadmapping", "Agile", "Stakeholder Management"],
    salary: 16,
    experienceLevel: 3,
    location: "San Francisco, CA",
    jobType: "Full-time",
    position: 1,
    companyName: "NovaTech Labs"
  },
  {
    title: "QA Automation Engineer",
    description: "Build and maintain robust automated test suites for web applications.",
    requirements: ["Cypress", "Testing", "JavaScript"],
    salary: 13,
    experienceLevel: 2,
    location: "Remote",
    jobType: "Contract",
    position: 2,
    companyName: "BrightPixel Studio"
  }
];

const seedJobs = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in environment variables.");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash(recruiterSeed.password, 10);

  const recruiter = await User.findOneAndUpdate(
    { email: recruiterSeed.email },
    {
      fullname: recruiterSeed.fullname,
      phoneNumber: recruiterSeed.phoneNumber,
      role: recruiterSeed.role,
      password: hashedPassword
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const companyMap = new Map();
  for (const companySeed of companySeeds) {
    const company = await Company.findOneAndUpdate(
      { name: companySeed.name },
      {
        ...companySeed,
        userId: recruiter._id
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    companyMap.set(company.name, company._id);
  }

  let seededCount = 0;

  for (const jobSeed of jobSeeds) {
    const companyId = companyMap.get(jobSeed.companyName);

    if (!companyId) {
      continue;
    }

    const existingJob = await Job.findOne({
      title: jobSeed.title,
      company: companyId,
      created_by: recruiter._id
    });

    if (existingJob) {
      continue;
    }

    await Job.create({
      title: jobSeed.title,
      description: jobSeed.description,
      requirements: jobSeed.requirements,
      salary: jobSeed.salary,
      experienceLevel: jobSeed.experienceLevel,
      location: jobSeed.location,
      jobType: jobSeed.jobType,
      position: jobSeed.position,
      company: companyId,
      created_by: recruiter._id
    });

    seededCount += 1;
  }

  console.log(`Seed completed. ${seededCount} new jobs inserted.`);
  await mongoose.connection.close();
};

seedJobs().catch(async (error) => {
  console.error("Failed to seed jobs:", error.message);
  await mongoose.connection.close();
  process.exit(1);
});
