import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, Download, Award, Briefcase } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { resolveApiAssetUrl } from '@/utils/constant'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    return (
        <div className='min-h-screen bg-slate-50 dark:bg-slate-950'>
            <Navbar />
            <div className='mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8'>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className='overflow-hidden rounded-[40px] border border-slate-200 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900'
                >
                    <div className='relative h-32 w-full bg-gradient-to-r from-primary to-indigo-600 sm:h-48' />
                    <div className='relative -mt-16 px-6 pb-12 sm:px-12'>
                        <div className='flex flex-col items-end justify-between gap-6 sm:flex-row'>
                            <div className='flex items-end gap-6'>
                                <div className='relative h-32 w-32 shrink-0 rounded-3xl border-[6px] border-white bg-white p-1 shadow-xl dark:border-slate-900 dark:bg-slate-900'>
                                    <Avatar className="h-full w-full rounded-2xl">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                                    </Avatar>
                                </div>
                                <div className='mb-2'>
                                    <h1 className='text-3xl font-black tracking-tight text-slate-900 dark:text-white'>{user?.fullname}</h1>
                                    <p className='mt-1 text-slate-500 font-medium'>{user?.profile?.bio || "No bio added yet"}</p>
                                </div>
                            </div>
                            <Button 
                                onClick={() => setOpen(true)} 
                                className="mb-2 rounded-2xl border-slate-200 bg-white px-6 font-bold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white" 
                                variant="outline"
                            >
                                <Pen className='mr-2 h-4 w-4' /> Edit Profile
                            </Button>
                        </div>

                        <div className='mt-12 grid gap-12 lg:grid-cols-3'>
                            <div className='lg:col-span-1'>
                                <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400'>
                                    <Contact className='h-4 w-4' /> Contact Info
                                </h2>
                                <div className='mt-6 space-y-4'>
                                    <div className='flex items-center gap-3 rounded-2xl border border-slate-50 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/50'>
                                        <Mail className='h-5 w-5 text-primary' />
                                        <span className='text-sm font-medium text-slate-700 dark:text-slate-300'>{user?.email}</span>
                                    </div>
                                    <div className='flex items-center gap-3 rounded-2xl border border-slate-50 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/50'>
                                        <Contact className='h-5 w-5 text-primary' />
                                        <span className='text-sm font-medium text-slate-700 dark:text-slate-300'>{user?.phoneNumber}</span>
                                    </div>
                                </div>

                                <h2 className='mt-12 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400'>
                                    <Award className='h-4 w-4' /> Skills & Expertise
                                </h2>
                                <div className='mt-6 flex flex-wrap gap-2'>
                                    {
                                        user?.profile?.skills?.length ? user?.profile?.skills.map((item, index) => (
                                            <Badge 
                                                key={index}
                                                className='rounded-xl border-slate-100 bg-white px-4 py-2 font-bold text-primary shadow-sm hover:bg-primary/5 dark:border-slate-800 dark:bg-slate-950'
                                            >
                                                {item}
                                            </Badge>
                                        )) : <span className='text-xs text-slate-400 font-medium'>Add skills to your profile</span>
                                    }
                                </div>
                            </div>

                            <div className='lg:col-span-2'>
                                <h2 className='flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400'>
                                    <Briefcase className='h-4 w-4' /> Professional Resume
                                </h2>
                                <div className='mt-6'>
                                    {
                                        user?.profile?.resume ? (
                                            <div className='flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-primary/20 bg-primary/5 p-6'>
                                                <div className='flex items-center gap-4'>
                                                    <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg'>
                                                        <Briefcase className='h-6 w-6' />
                                                    </div>
                                                    <div>
                                                        <p className='text-sm font-bold text-slate-900 dark:text-white'>{user?.profile?.resumeOriginalName || 'resume.pdf'}</p>
                                                        <p className='text-xs text-slate-500'>Available for recruiters</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={async () => {
                                                        try {
                                                            const response = await fetch(resolveApiAssetUrl(user.profile.resume));
                                                            const blob = await response.blob();
                                                            const blobUrl = URL.createObjectURL(blob);
                                                            const link = document.createElement('a');
                                                            link.href = blobUrl;
                                                            link.download = user?.profile?.resumeOriginalName || 'resume.pdf';
                                                            document.body.appendChild(link);
                                                            link.click();
                                                            document.body.removeChild(link);
                                                            URL.revokeObjectURL(blobUrl);
                                                            toast.success("Downloading resume...");
                                                        } catch (e) {
                                                            window.open(resolveApiAssetUrl(user.profile.resume), '_blank');
                                                        }
                                                    }}
                                                    className='rounded-xl bg-primary px-6 font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90'
                                                >
                                                    <Download className='mr-2 h-4 w-4' /> Download
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className='rounded-3xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800'>
                                                <p className='text-sm font-medium text-slate-500'>No resume uploaded yet</p>
                                            </div>
                                        )
                                    }
                                </div>

                                <h2 className='mt-12 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400'>
                                    Latest Applications
                                </h2>
                                <div className='mt-6 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950'>
                                    <AppliedJobTable />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile

