import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);

    useEffect(() => {
        if (searchedQuery && typeof searchedQuery === 'object') {
            const hasSelections = Object.values(searchedQuery).some(arr => arr.length > 0);
            if (!hasSelections) {
                setFilterJobs(allJobs);
                return;
            }

            const filteredJobs = allJobs.filter((job) => {
                let locationMatch = true;
                let industryMatch = true;
                let salaryMatch = true;

                if (searchedQuery.Location && searchedQuery.Location.length > 0) {
                    locationMatch = searchedQuery.Location.some(loc => job?.location?.toLowerCase().includes(loc.toLowerCase()));
                }

                if (searchedQuery.Industry && searchedQuery.Industry.length > 0) {
                    industryMatch = searchedQuery.Industry.some(ind => job?.title?.toLowerCase().includes(ind.toLowerCase()) || job?.description?.toLowerCase().includes(ind.toLowerCase()));
                }

                if (searchedQuery.Salary && searchedQuery.Salary.length > 0) {
                    salaryMatch = searchedQuery.Salary.some(sal => {
                        const jobSalary = Number(job?.salary) || 0;
                        if (sal === '0-40k') return jobSalary >= 0 && jobSalary <= 40;
                        if (sal === '42-1lakh') return jobSalary >= 42 && jobSalary <= 100;
                        if (sal === '1lakh to 5lakh') return jobSalary > 100 && jobSalary <= 500;
                        return false;
                    });
                }

                return locationMatch && industryMatch && salaryMatch;
            });
            setFilterJobs(filteredJobs);
        } else if (searchedQuery && typeof searchedQuery === 'string') {
            const query = searchedQuery.toLowerCase();
            const filteredJobs = allJobs.filter((job) => {
                const textMatch = job?.title?.toLowerCase().includes(query) ||
                    job?.description?.toLowerCase().includes(query) ||
                    job?.location?.toLowerCase().includes(query);

                let salaryMatch = false;
                const jobSalary = Number(job?.salary) || 0;
                if (query === '0-40k') {
                    salaryMatch = jobSalary >= 0 && jobSalary <= 40;
                } else if (query === '42-1lakh') {
                    salaryMatch = jobSalary >= 42 && jobSalary <= 100;
                } else if (query === '1lakh to 5lakh') {
                    salaryMatch = jobSalary > 100 && jobSalary <= 500;
                }

                return textMatch || salaryMatch;
            });
            setFilterJobs(filteredJobs);
        } else {
            setFilterJobs(allJobs)
        }
    }, [allJobs, searchedQuery]);

    return (
        <div className='min-h-screen bg-slate-50 dark:bg-slate-950'>
            <Navbar />
            <div className='mx-auto mt-8 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8'>
                <div className='flex flex-col gap-8 lg:flex-row'>
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='w-full lg:w-80'
                    >
                        <FilterCard />
                    </motion.div>
                    
                    {
                        filterJobs.length <= 0 ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className='flex-1 rounded-[32px] border border-dashed border-slate-200 bg-white p-20 text-center dark:border-slate-800 dark:bg-slate-900'
                            >
                                <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800'>
                                    <span className='text-3xl text-slate-300'>🔍</span>
                                </div>
                                <h3 className='mt-5 text-xl font-bold text-slate-900 dark:text-white'>No jobs found</h3>
                                <p className='mt-2 text-slate-500'>Try adjusting your filters or search keywords.</p>
                            </motion.div>
                        ) : (
                            <div className='flex-1'>
                                <motion.div 
                                    layout
                                    className='grid gap-6 sm:grid-cols-2 xl:grid-cols-2'
                                >
                                    <AnimatePresence>
                                        {
                                            filterJobs.map((job) => (
                                                <motion.div
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    transition={{ duration: 0.3 }}
                                                    key={job?._id}>
                                                    <Job job={job} />
                                                </motion.div>
                                            ))
                                        }
                                    </AnimatePresence>
                                </motion.div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Jobs

