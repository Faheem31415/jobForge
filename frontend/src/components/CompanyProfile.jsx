import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { motion } from 'framer-motion';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { MapPin, Globe } from 'lucide-react';

const CompanyProfile = () => {
    const params = useParams();
    const [companyData, setCompanyData] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCompanyProfile = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/profile/${params.id}`);
                if (res.data.success) {
                    setCompanyData(res.data.company);
                    // Add company data to jobs so JobCard can render properly
                    const populatedJobs = res.data.jobs.map(job => ({ ...job, company: res.data.company }));
                    setJobs(populatedJobs);
                }
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        }
        fetchCompanyProfile();
    }, [params.id]);

    return (
        <div className='min-h-screen bg-slate-50'>
            <Navbar />
            <div className='mx-auto mt-6 max-w-7xl px-4 pb-10 sm:px-6 lg:px-8'>
                {loading ? (
                    <div className='flex justify-center my-10 animate-pulse text-xl text-slate-500 font-semibold'>Loading completely...</div> 
                ) : !companyData ? (
                    <div className='rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500'>Company not found</div> 
                ) : (
                    <>
                        <div className='bg-white shadow-sm rounded-2xl p-8 border border-slate-200 mb-8'>
                            <div className='flex flex-col md:flex-row items-center gap-6'>
                                <Avatar className="h-28 w-28 border border-slate-200 shadow-sm bg-white">
                                    <AvatarImage src={companyData?.logo} alt={companyData?.name} className="object-contain p-2" />
                                </Avatar>
                                <div className='flex flex-col items-center md:items-start text-center md:text-left flex-1'>
                                    <h1 className='text-3xl font-bold text-slate-900'>{companyData?.name}</h1>
                                    <div className='flex gap-4 mt-2 text-slate-500'>
                                        {companyData?.location && (
                                            <div className='flex items-center gap-1'>
                                                <MapPin className="h-4 w-4" />
                                                <span>{companyData?.location}</span>
                                            </div>
                                        )}
                                        {companyData?.website && (
                                            <div className='flex items-center gap-1'>
                                                <Globe className="h-4 w-4" />
                                                <a href={companyData?.website} target="_blank" rel="noopener noreferrer" className='hover:underline text-blue-600'>Website</a>
                                            </div>
                                        )}
                                    </div>
                                    <p className='mt-4 text-slate-700 max-w-3xl'>
                                        {companyData?.description || "No description provided."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className='text-2xl font-bold text-slate-900 mb-6'>Active Job Openings <Badge variant="secondary" className="ml-2 bg-indigo-100 text-indigo-700">{jobs.length}</Badge></h2>
                            {jobs.length <= 0 ? (
                                <div className='rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500'>
                                    No active jobs posted by this company.
                                </div>
                            ) : (
                                <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                                    {jobs.map((job) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 50 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            key={job?._id}>
                                            <Job job={job} />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default CompanyProfile
