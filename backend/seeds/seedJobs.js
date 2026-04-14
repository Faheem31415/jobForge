import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import dns from "dns";

//change dns
dns.setServers(["1.1.1.1","8.8.8.8"]);

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
    description: "Building scalable hiring platforms.",
    website: "https://novatech.example.com",
    location: "San Francisco, CA"
  },
  {
    name: "BrightPixel Studio",
    description: "Design-first product engineering.",
    website: "https://brightpixel.example.com",
    location: "Austin, TX"
  },
  {
    name: "CloudBridge Systems",
    description: "Cloud modernization solutions.",
    website: "https://cloudbridge.example.com",
    location: "Seattle, WA"
  },

  // 🔥 NEW COMPANIES

  {
    name: "CodeCraft Solutions",
    description: "Custom software development company.",
    website: "https://codecraft.example.com",
    location: "New York, NY"
  },
  {
    name: "DataNest Analytics",
    description: "Data-driven insights and analytics.",
    website: "https://datanest.example.com",
    location: "Chicago, IL"
  },
  {
    name: "NextGen AI",
    description: "AI-powered solutions and automation.",
    website: "https://nextgenai.example.com",
    location: "Boston, MA"
  },
  {
    name: "PixelForge Tech",
    description: "Creative web and mobile applications.",
    website: "https://pixelforge.example.com",
    location: "Los Angeles, CA"
  },
  {
    name: "SecureNet Systems",
    description: "Cybersecurity and network protection.",
    website: "https://securenet.example.com",
    location: "Dallas, TX"
  },
  {
    name: "DevMatrix",
    description: "Developer tools and SaaS products.",
    website: "https://devmatrix.example.com",
    location: "San Jose, CA"
  },
  {
    name: "InnoSoft Labs",
    description: "Innovative enterprise solutions.",
    website: "https://innosoft.example.com",
    location: "Denver, CO"
  },
  {
    name: "Skyline Tech",
    description: "Cloud-native app development.",
    website: "https://skyline.example.com",
    location: "San Diego, CA"
  },
  {
    name: "QuantumLeap Tech",
    description: "Next-gen computing and AI research.",
    website: "https://quantumleap.example.com",
    location: "Palo Alto, CA"
  }
];

const jobSeeds = [
  {
    title: "Frontend Developer",
    description: "Build UI with React.",
    requirements: ["React", "JS"],
    salary: 14,
    experienceLevel: 2,
    location: "Remote",
    jobType: "Full-time",
    position: 2,
    companyName: "NovaTech Labs"
  },
  {
    title: "Backend Engineer",
    description: "Build APIs with Node.js.",
    requirements: ["Node.js", "MongoDB"],
    salary: 18,
    experienceLevel: 3,
    location: "Seattle, WA",
    jobType: "Full-time",
    position: 1,
    companyName: "CloudBridge Systems"
  },
  {
    title: "UI Designer",
    description: "Design modern UI systems.",
    requirements: ["Figma"],
    salary: 11,
    experienceLevel: 2,
    location: "Austin, TX",
    jobType: "Full-time",
    position: 1,
    companyName: "BrightPixel Studio"
  },
  {
    title: "DevOps Engineer",
    description: "Manage CI/CD pipelines.",
    requirements: ["Docker", "AWS"],
    salary: 20,
    experienceLevel: 4,
    location: "Remote",
    jobType: "Full-time",
    position: 1,
    companyName: "CloudBridge Systems"
  },
  {
    title: "Product Manager",
    description: "Manage product lifecycle.",
    requirements: ["Agile"],
    salary: 16,
    experienceLevel: 3,
    location: "SF",
    jobType: "Full-time",
    position: 1,
    companyName: "NovaTech Labs"
  },
  {
    title: "QA Engineer",
    description: "Automate testing.",
    requirements: ["Cypress"],
    salary: 13,
    experienceLevel: 2,
    location: "Remote",
    jobType: "Contract",
    position: 2,
    companyName: "BrightPixel Studio"
  },

  // 🔥 6 MORE (covering all companies)

  {
    title: "Full Stack Developer",
    description: "MERN stack development.",
    requirements: ["React", "Node"],
    salary: 17,
    experienceLevel: 3,
    location: "Remote",
    jobType: "Full-time",
    position: 2,
    companyName: "CodeCraft Solutions"
  },
  {
    title: "Data Analyst",
    description: "Analyze datasets.",
    requirements: ["SQL", "Python"],
    salary: 12,
    experienceLevel: 2,
    location: "Chicago",
    jobType: "Full-time",
    position: 1,
    companyName: "DataNest Analytics"
  },
  {
    title: "ML Engineer",
    description: "Build ML models.",
    requirements: ["Python", "ML"],
    salary: 22,
    experienceLevel: 4,
    location: "Remote",
    jobType: "Full-time",
    position: 1,
    companyName: "NextGen AI"
  },
  {
    title: "Security Engineer",
    description: "Secure systems.",
    requirements: ["Cybersecurity"],
    salary: 19,
    experienceLevel: 3,
    location: "Dallas",
    jobType: "Full-time",
    position: 1,
    companyName: "SecureNet Systems"
  },
  {
    title: "System Admin",
    description: "Maintain servers.",
    requirements: ["Linux"],
    salary: 10,
    experienceLevel: 2,
    location: "Denver",
    jobType: "Full-time",
    position: 1,
    companyName: "InnoSoft Labs"
  },
  {
    title: "Cloud Engineer",
    description: "Cloud infrastructure.",
    requirements: ["AWS", "Kubernetes"],
    salary: 21,
    experienceLevel: 3,
    location: "San Diego",
    jobType: "Full-time",
    position: 1,
    companyName: "Skyline Tech"
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
