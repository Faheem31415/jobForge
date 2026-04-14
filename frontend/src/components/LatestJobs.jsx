import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux'; 



const LatestJobs = () => {
    const {allJobs} = useSelector(store=>store.job);
   
    return (
        <section className='mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8'>
            <h1 className='text-2xl font-bold text-slate-900 sm:text-4xl'><span className='text-violet-600'>Latest & Top </span> Job Openings</h1>
            <div className='mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {
                    allJobs.length <= 0 ? (
                        <div className='col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500'>No Job Available</div>
                    ) : allJobs?.slice(0,6).map((job) => <LatestJobCards key={job._id} job={job}/>)
                }
            </div>
        </section>
    )
}

export default LatestJobs
