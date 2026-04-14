import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    return (
        <div onClick={()=> navigate(`/description/${job._id}`)} className='cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl'>
            <div>
                <h1 className='text-lg font-semibold text-slate-900'>{job?.company?.name}</h1>
                <p className='text-sm text-slate-500'>India</p>
            </div>
            <div>
                <h1 className='my-2 text-lg font-bold text-slate-900'>{job?.title}</h1>
                <p className='line-clamp-3 text-sm text-slate-600'>{job?.description}</p>
            </div>
            <div className='mt-4 flex flex-wrap items-center gap-2'>
                <Badge className={'rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'rounded-full bg-rose-50 px-3 py-1 font-semibold text-rose-600'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'rounded-full bg-violet-50 px-3 py-1 font-semibold text-violet-700'} variant="ghost">{job?.salary}LPA</Badge>
            </div>

        </div>
    )
}

export default LatestJobCards
