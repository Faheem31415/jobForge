import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Bot, Loader2, MapPin, Briefcase, DollarSign, Calendar, Users, Star } from 'lucide-react';
import Navbar from './shared/Navbar';
import { motion } from 'framer-motion'

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant?.toString() === user?._id?.toString()) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);
    const [matchScore, setMatchScore] = useState(null);
    const [matchReason, setMatchReason] = useState("");
    const [loadingMatch, setLoadingMatch] = useState(false);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const applyJobHandler = async () => {
        if (!user) {
            toast.error("Please login first to apply for this job.");
            navigate('/login');
            return;
        }
        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {}, { withCredentials: true });

            if (res.data.success) {
                setIsApplied(true); // Update the local state
                const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] }
                dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
                toast.success(res.data.message);

            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to apply");
        }
    }

    const generateMatchScore = async () => {
        if (!user || user.role !== 'student') {
            toast.error("Please login as a student to generate your AI match score.");
            return;
        }
        setLoadingMatch(true);
        try {
            const res = await axios.get(`${JOB_API_END_POINT}/match/${jobId}`, { withCredentials: true });
            if (res.data.success) {
                setMatchScore(res.data.score);
                setMatchReason(res.data.reasoning);
                toast.success("Match score generated!");
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to generate match score.");
        }
        setLoadingMatch(false);
    }

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application => application.applicant?.toString() === user?._id?.toString())) // Ensure the state is in sync with fetched data
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    return (
        <div className='min-h-screen bg-slate-50 dark:bg-slate-950'>
            <Navbar />
            <div className='mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8'>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='rounded-[40px] border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-12'
                >
                    <div className='flex flex-col items-start justify-between gap-6 lg:flex-row'>
                        <div className='flex-1'>
                            <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl'>
                                {singleJob?.title}
                            </h1>
                            <div className='mt-6 flex flex-wrap items-center gap-3'>
                                <Badge variant="secondary" className='rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase text-blue-700 dark:bg-blue-900/30'>
                                    {singleJob?.position} Positions
                                </Badge>
                                <Badge variant="secondary" className='rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-bold uppercase text-rose-600 dark:bg-rose-900/30'>
                                    {singleJob?.jobType}
                                </Badge>
                                <Badge variant="secondary" className='rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase text-primary'>
                                    ₹{singleJob?.salary} LPA
                                </Badge>
                            </div>
                        </div>
                        <div className='flex w-full shrink-0 items-center gap-4 lg:w-auto'>
                            <Button
                                onClick={applyJobHandler}
                                disabled={isApplied}
                                className={`h-14 flex-1 rounded-2xl px-10 text-lg font-bold shadow-lg transition-all lg:flex-none ${isApplied ? 'bg-slate-100 text-slate-400 dark:bg-slate-800' : 'bg-primary text-white shadow-primary/20 hover:bg-primary/90 hover:scale-105'}`}
                            >
                                {isApplied ? 'Applied' : 'Apply Now'}
                            </Button>
                        </div>
                    </div>

                    {/* AI Match Feature */}
                    {user && user.role === 'student' && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className='mt-12 overflow-hidden rounded-3xl border border-primary/20 bg-primary/5 p-8'
                        >
                            <div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
                                <div className='flex items-start gap-4'>
                                    <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20'>
                                        <Bot className='h-6 w-6' />
                                    </div>
                                    <div>
                                        <h3 className='text-xl font-bold text-slate-900 dark:text-white'>
                                            AI Personal Match
                                        </h3>
                                        <p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>
                                            See how well your skills align with this role before applying.
                                        </p>
                                    </div>
                                </div>
                                {matchScore === null ? (
                                    <Button
                                        onClick={generateMatchScore}
                                        disabled={loadingMatch}
                                        className="h-12 w-full rounded-xl border-primary bg-white px-6 font-bold text-primary shadow-sm hover:bg-primary/5 sm:w-auto dark:bg-slate-950"
                                        variant="outline"
                                    >
                                        {loadingMatch ? <><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Analyzing...</> : "Generate Score"}
                                    </Button>
                                ) : (
                                    <div className='flex items-center gap-4 text-center sm:text-right'>
                                        <div className='hidden h-12 w-[1px] bg-primary/20 sm:block' />
                                        <div>
                                            <p className='text-xs font-bold uppercase tracking-widest text-slate-400'>Match Score</p>
                                            <h1 className={`text-5xl font-black ${matchScore > 75 ? 'text-green-600' : matchScore > 40 ? 'text-amber-500' : 'text-rose-600'}`}>
                                                {matchScore}%
                                            </h1>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {matchReason && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className='mt-6 rounded-2xl bg-white p-5 text-sm leading-relaxed text-slate-700 shadow-sm dark:bg-slate-950 dark:text-slate-300'
                                >
                                    <Star className='mb-2 h-4 w-4 text-amber-500' fill="currentColor" />
                                    <span className='italic'>&ldquo;{matchReason}&rdquo;</span>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    <div className='mt-12'>
                        <h2 className='text-xl font-bold text-slate-900 dark:text-white'>Job Overview</h2>
                        <div className='mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                            {[
                                { icon: Briefcase, label: 'Role', value: singleJob?.title },
                                { icon: MapPin, label: 'Location', value: singleJob?.location },
                                { icon: Calendar, label: 'Posted Date', value: singleJob?.createdAt?.split("T")[0] },
                                { icon: Star, label: 'Experience', value: `${singleJob?.experienceLevel} Years` },
                                { icon: DollarSign, label: 'Salary', value: `${singleJob?.salary} LPA` },
                                { icon: Users, label: 'Applicants', value: singleJob?.applications?.length },
                            ].map((item, idx) => (
                                <div key={idx} className='flex items-center gap-4 rounded-2xl border border-slate-100 p-4 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50'>
                                    <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-primary dark:bg-slate-800'>
                                        <item.icon className='h-5 w-5' />
                                    </div>
                                    <div>
                                        <p className='text-[10px] font-bold uppercase tracking-wider text-slate-400'>{item.label}</p>
                                        <p className='text-sm font-bold text-slate-800 dark:text-slate-200'>{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='mt-12'>
                        <h2 className='text-xl font-bold text-slate-900 dark:text-white'>Description</h2>
                        <div className='mt-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base'>
                            {singleJob?.description}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default JobDescription