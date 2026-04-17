import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';

const SavedJobs = () => {
    const { user } = useSelector(store => store.auth);
    const [savedJobsData, setSavedJobsData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSavedJobs = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/saved`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    // Deduplicate jobs (in case old bug resulted in duplicate IDs in DB)
                    const uniqueJobs = res.data.savedJobs.filter((job, index, self) => 
                        index === self.findIndex((t) => (
                            t._id === job._id
                        ))
                    );
                    // Reverse to show latest saved first if order is not already reverse
                    setSavedJobsData(uniqueJobs.reverse());
                }
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        }
        if (user) {
            fetchSavedJobs();
        }
    }, [user?.profile?.savedJobs]); // Re-fetch whenever the ID array changes

    return (
        <div className='min-h-screen bg-slate-50'>
            <Navbar />
            <div className='mx-auto mt-6 max-w-7xl px-4 pb-10 sm:px-6 lg:px-8'>
                <h1 className='text-3xl font-bold text-gray-900 mb-6'>Saved Jobs</h1>
                {
                    loading ? <div className='flex justify-center my-10 animate-pulse text-xl text-slate-500 font-semibold'>Loading saved jobs...</div> :
                    savedJobsData.length <= 0 ? <div className='rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500'>You haven't saved any jobs yet.</div> : (
                        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                            {
                                savedJobsData.map((job) => (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                        key={job?._id}>
                                        <Job job={job} />
                                    </motion.div>
                                ))
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default SavedJobs
