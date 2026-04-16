import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

// const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];

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
        <div className='min-h-screen bg-slate-50'>
            <Navbar />
            <div className='mx-auto mt-6 max-w-7xl px-4 pb-10 sm:px-6 lg:px-8'>
                <div className='flex flex-col gap-5 lg:flex-row'>
                    <div className='w-full lg:w-72'>
                        <FilterCard />
                    </div>
                    {
                        filterJobs.length <= 0 ? <div className='flex-1 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500'>Job not found</div> : (
                            <div className='flex-1 pb-5'>
                                <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}>
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>


        </div>
    )
}

export default Jobs
