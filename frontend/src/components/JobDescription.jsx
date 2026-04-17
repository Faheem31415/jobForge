import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Bot, Loader2 } from 'lucide-react';
import Navbar from './shared/Navbar';

const JobDescription = () => {
    const {singleJob} = useSelector(store => store.job);
    const {user} = useSelector(store=>store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
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
            const res = await axios.post(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {}, {withCredentials:true});
            
            if(res.data.success){
                setIsApplied(true); // Update the local state
                const updatedSingleJob = {...singleJob, applications:[...singleJob.applications,{applicant:user?._id}]}
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
            const res = await axios.get(`${JOB_API_END_POINT}/match/${jobId}`, {withCredentials:true});
            if(res.data.success){
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

    useEffect(()=>{
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application=>application.applicant === user?._id)) // Ensure the state is in sync with fetched data
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob(); 
    },[jobId,dispatch, user?._id]);

    return (
        <div className='min-h-screen bg-slate-50'>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 bg-white p-8 rounded-2xl shadow-sm border border-slate-200'>
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='font-bold text-2xl text-slate-900'>{singleJob?.title}</h1>
                        <div className='flex items-center gap-2 mt-4'>
                            <Badge className={'text-blue-700 font-bold bg-blue-100'} variant="ghost">{singleJob?.position} Positions</Badge>
                            <Badge className={'text-[#F83002] font-bold bg-red-100'} variant="ghost">{singleJob?.jobType}</Badge>
                            <Badge className={'text-[#7209b7] font-bold bg-purple-100'} variant="ghost">{singleJob?.salary}LPA</Badge>
                        </div>
                    </div>
                    <div className='flex items-center gap-4'>
                        <Button
                        onClick={applyJobHandler}
                            disabled={isApplied}
                            className={`rounded-xl px-8 ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700'}`}>
                            {isApplied ? 'Already Applied' : 'Apply Now'}
                        </Button>
                    </div>
                </div>

                {/* AI Match Feature */}
                {user && user.role === 'student' && (
                    <div className='my-6 p-6 bg-gradient-to-tr from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <h3 className='text-lg font-bold flex items-center gap-2 text-indigo-900'>
                                    <Bot className='text-indigo-600'/> AI Job Match Score
                                </h3>
                                <p className='text-sm text-indigo-700 mt-1'>Check your compatibility based on your profile and skills before applying.</p>
                            </div>
                            {matchScore === null ? (
                                <Button 
                                    onClick={generateMatchScore} 
                                    disabled={loadingMatch}
                                    variant="outline" 
                                    className="border-indigo-300 text-indigo-700 hover:bg-indigo-100 rounded-xl">
                                    {loadingMatch ? <><Loader2 className='mr-2 h-4 w-4 animate-spin'/> Analyzing...</> : "Generate Score"}
                                </Button>
                            ) : (
                                <div className='text-right'>
                                    <h1 className={`text-4xl font-extrabold ${matchScore > 75 ? 'text-green-600' : matchScore > 40 ? 'text-yellow-600' : 'text-red-600'}`}>{matchScore}%</h1>
                                </div>
                            )}
                        </div>
                        {matchReason && (
                            <div className='mt-4 p-4 bg-white/80 rounded-xl text-sm text-slate-700 border border-indigo-100/50 italic'>
                                "{matchReason}"
                            </div>
                        )}
                    </div>
                )}

                <h1 className='border-b-2 border-slate-200 font-bold py-4 mt-8'>Job Description</h1>
                <div className='my-4 space-y-4'>
                    <h1 className='font-bold my-1 text-slate-800'>Role: <span className='pl-4 font-normal text-slate-600'>{singleJob?.title}</span></h1>
                    <h1 className='font-bold my-1 text-slate-800'>Location: <span className='pl-4 font-normal text-slate-600'>{singleJob?.location}</span></h1>
                    <h1 className='font-bold my-1 text-slate-800'>Description: <span className='pl-4 font-normal text-slate-600 leading-relaxed block mt-2'>{singleJob?.description}</span></h1>
                    <h1 className='font-bold my-1 text-slate-800'>Experience: <span className='pl-4 font-normal text-slate-600'>{singleJob?.experienceLevel} yrs</span></h1>
                    <h1 className='font-bold my-1 text-slate-800'>Salary: <span className='pl-4 font-normal text-slate-600'>{singleJob?.salary}LPA</span></h1>
                    <h1 className='font-bold my-1 text-slate-800'>Total Applicants: <span className='pl-4 font-normal text-slate-600'>{singleJob?.applications?.length}</span></h1>
                    <h1 className='font-bold my-1 text-slate-800'>Posted Date: <span className='pl-4 font-normal text-slate-600'>{singleJob?.createdAt?.split("T")[0]}</span></h1>
                </div>
            </div>
        </div>
    )
}

export default JobDescription