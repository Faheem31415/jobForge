import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setSavedJobs } from '@/redux/authSlice'
import { toast } from 'sonner'

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
        <div className='group p-6 rounded-2xl shadow-md bg-white border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300'>
            
            {/* Top Section */}
            <div className='flex items-center justify-between'>
                <p className='text-xs text-gray-400 font-medium'>
                    {daysAgoFunction(job?.createdAt) === 0
                        ? "Today"
                        : `${daysAgoFunction(job?.createdAt)} days ago`}
                </p>

                <Button
                    onClick={handleSaveJob}
                    variant="outline"
                    size="icon"
                    className={`rounded-full transition ${isSaved ? 'bg-purple-100 text-purple-600' : 'hover:bg-purple-100 hover:text-purple-600'}`}
                >
                    <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                </Button>
            </div>

            {/* Company Info */}
            <div className='flex items-center gap-3 my-4'>
                <div onClick={() => navigate(`/company/${job?.company?._id}`)} className="cursor-pointer p-1 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 hover:scale-105 transition-transform">
                    <Avatar className="bg-white">
                        <AvatarImage src={job?.company?.logo} />
                    </Avatar>
                </div>

                <div>
                    <h1 onClick={() => navigate(`/company/${job?.company?._id}`)} className='cursor-pointer font-semibold text-lg text-gray-800 hover:text-purple-600 transition-colors'>
                        {job?.company?.name}
                    </h1>
                    <p className='text-xs text-gray-400'>India</p>
                </div>
            </div>

            {/* Job Info */}
            <div>
                <h1 className='font-bold text-xl text-gray-900 group-hover:text-purple-600 transition'>
                    {job?.title}
                </h1>

                <p className='text-sm text-gray-600 mt-2 line-clamp-2'>
                    {job?.description}
                </p>
            </div>

            {/* Badges */}
            <div className='flex flex-wrap items-center gap-2 mt-4'>
                <Badge className='bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-full'>
                    {job?.position} Positions
                </Badge>

                <Badge className='bg-red-50 text-red-600 font-semibold px-3 py-1 rounded-full'>
                    {job?.jobType}
                </Badge>

                <Badge className='bg-purple-50 text-purple-700 font-semibold px-3 py-1 rounded-full'>
                    ₹{job?.salary} LPA
                </Badge>
            </div>

            {/* Action Buttons */}
            <div className='flex items-center gap-3 mt-6'>
                
                <Button
                    onClick={() => navigate(`/description/${job?._id}`)}
                    className='w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg shadow-md transition-all duration-300'
                >
                    Apply Now
                </Button>

            </div>
        </div>
    )
}

export default Job