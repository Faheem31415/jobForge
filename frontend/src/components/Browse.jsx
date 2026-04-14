import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';

// const randomJobs = [1, 2,45];

const Browse = () => {
    useGetAllJobs();
    const {allJobs} = useSelector(store=>store.job);
    const dispatch = useDispatch();
    useEffect(()=>{
        return ()=>{
            dispatch(setSearchedQuery(""));
        }
    },[])
    return (
        <div className='min-h-screen bg-slate-50'>
            <Navbar />
            <div className='mx-auto my-10 max-w-7xl px-4 sm:px-6 lg:px-8'>
                <h1 className='my-8 text-xl font-bold text-slate-900 sm:text-2xl'>Search Results ({allJobs.length})</h1>
                <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                    {
                        allJobs.length <= 0 ? <div className='col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500'>No matching jobs available yet.</div> : allJobs.map((job) => {
                            return (
                                <Job key={job._id} job={job}/>
                            )
                        })
                    }
                </div>

            </div>
        </div>
    )
}

export default Browse
