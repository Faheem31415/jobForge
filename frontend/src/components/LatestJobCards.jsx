import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Clock, DollarSign, Briefcase } from 'lucide-react'

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();
    return (
        <motion.div 
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={() => navigate(`/description/${job._id}`)} 
            className='group cursor-pointer rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900'
        >
            <div className='flex items-start justify-between'>
                <div className='flex items-center gap-3'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300'>
                        {job?.company?.name?.charAt(0) || 'J'}
                    </div>
                    <div>
                        <h2 className='text-sm font-bold text-primary'>{job?.company?.name}</h2>
                        <div className='flex items-center gap-1 text-xs text-slate-500'>
                            <MapPin className='h-3 w-3' />
                            <span>India</span>
                        </div>
                    </div>
                </div>
                <Badge variant="outline" className="rounded-full border-slate-200 bg-slate-50 font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                    {job?.jobType}
                </Badge>
            </div>

            <div className='mt-6'>
                <h1 className='text-xl font-extrabold text-slate-900 group-hover:text-primary transition-colors dark:text-white'>{job?.title}</h1>
                <p className='mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400'>{job?.description}</p>
            </div>

            <div className='mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-6 dark:border-slate-800'>
                <div className='flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'>
                    <Briefcase className='h-3.5 w-3.5' />
                    <span>{job?.position} Roles</span>
                </div>
                <div className='flex items-center gap-1.5 rounded-xl bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'>
                    <DollarSign className='h-3.5 w-3.5' />
                    <span>{job?.salary}LPA</span>
                </div>
                <div className='flex items-center gap-1.5 rounded-xl bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'>
                    <Clock className='h-3.5 w-3.5' />
                    <span>24h ago</span>
                </div>
            </div>
        </motion.div>
    )
}

export default LatestJobCards

