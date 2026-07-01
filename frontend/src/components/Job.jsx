import React from 'react'
import { Button } from './ui/button'
import { Bookmark, MapPin, Briefcase, DollarSign, Calendar } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setSavedJobs } from '@/redux/authSlice'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

const Job = ({ job }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    const isSaved = user?.profile?.savedJobs?.includes(job?._id);

    const handleSaveJob = async () => {
        if (!user) {
            toast.error("Please login to save jobs.");
            return;
        }
        try {
            const res = await axios.post(`${USER_API_END_POINT}/profile/saved/${job?._id}`, {}, {
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setSavedJobs(res.data.savedJobs));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong.");
        }
    }

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    }

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className='group flex flex-col h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900'
        >
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400'>
                    <Calendar className='h-3 w-3' />
                    <span>
                        {daysAgoFunction(job?.createdAt) === 0
                            ? "Posted Today"
                            : `${daysAgoFunction(job?.createdAt)} days ago`}
                    </span>
                </div>

                <Button
                    onClick={handleSaveJob}
                    variant="ghost"
                    size="icon"
                    className={`h-9 w-9 rounded-xl transition-colors ${isSaved ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-primary/10 hover:text-primary'}`}
                >
                    <Bookmark className='h-4 w-4' fill={isSaved ? "currentColor" : "none"} />
                </Button>
            </div>

            <div className='my-5 flex items-center gap-4'>
                <div 
                    onClick={() => navigate(`/company/${job?.company?._id}`)} 
                    className="h-14 w-14 cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-white p-1 transition-transform hover:scale-105 dark:border-slate-800"
                >
                    <Avatar className="h-full w-full rounded-xl">
                        <AvatarImage src={job?.company?.logo} className="object-contain" />
                    </Avatar>
                </div>

                <div>
                    <h2 
                        onClick={() => navigate(`/company/${job?.company?._id}`)} 
                        className='cursor-pointer text-sm font-bold text-primary hover:underline'
                    >
                        {job?.company?.name}
                    </h2>
                    <div className='flex items-center gap-1 text-xs text-slate-500'>
                        <MapPin className='h-3 w-3' />
                        <span>India</span>
                    </div>
                </div>
            </div>

            <div className='flex-1'>
                <h1 className='text-xl font-extrabold text-slate-900 transition-colors group-hover:text-primary dark:text-white'>
                    {job?.title}
                </h1>
                <p className='mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400'>
                    {job?.description}
                </p>
            </div>

            <div className='mt-6 flex flex-wrap items-center gap-2'>
                <Badge variant="secondary" className='rounded-xl bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase text-blue-700 dark:bg-blue-900/30'>
                    {job?.position} Roles
                </Badge>
                <Badge variant="secondary" className='rounded-xl bg-rose-50 px-2.5 py-1 text-[10px] font-bold uppercase text-rose-600 dark:bg-rose-900/30'>
                    {job?.jobType}
                </Badge>
                <Badge variant="secondary" className='rounded-xl bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase text-primary'>
                    ₹{job?.salary} LPA
                </Badge>
            </div>

            <div className='mt-6 grid grid-cols-1 gap-3 border-t border-slate-50 pt-6 dark:border-slate-800'>
                <Button
                    onClick={() => navigate(`/description/${job?._id}`)}
                    className='h-11 w-full rounded-xl bg-primary font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90'
                >
                    Apply Now
                </Button>
            </div>
        </motion.div>
    )
}

export default Job