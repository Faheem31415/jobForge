import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { resolveApiAssetUrl } from '@/utils/constant'

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    return (
        <div className='min-h-screen bg-slate-50'>
            <Navbar />
            <div className='mx-auto my-8 max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8'>
                <div className='flex flex-col justify-between gap-4 sm:flex-row'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullname}</h1>
                            <p>{user?.profile?.bio}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="self-start rounded-xl border-slate-300 text-right" variant="outline"><Pen /></Button>
                </div>
                <div className='my-6'>
                    <div className='my-2 flex items-center gap-3 text-slate-700'>
                        <Mail />
                        <span>{user?.email}</span>
                    </div>
                    <div className='my-2 flex items-center gap-3 text-slate-700'>
                        <Contact />
                        <span>{user?.phoneNumber}</span>
                    </div>
                </div>
                <div className='my-5'>
                    <h1 className='text-sm font-semibold uppercase tracking-wide text-slate-500'>Skills</h1>
                    <div className='mt-2 flex flex-wrap items-center gap-2'>
                        {
                            user?.profile?.skills?.length ? user?.profile?.skills.map((item, index) => <Badge key={index}>{item}</Badge>) : <span>NA</span>
                        }
                    </div>
                </div>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className="text-md font-bold text-slate-500">Resume</Label>
                    {
                        user?.profile?.resume ? (
                            <div className='flex items-center gap-3 flex-wrap'>


                                {/* Download: fetches as blob so Chrome never blocks it */}
                                <button
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
                                        } catch (e) {
                                            // fallback: just open in new tab
                                            window.open(resolveApiAssetUrl(user.profile.resume), '_blank');
                                        }
                                    }}
                                    className='text-xs text-white bg-violet-600 hover:bg-violet-700 px-3 py-1 rounded-lg transition'
                                >
                                    ⬇ Download
                                </button>
                            </div>
                        ) : <span>NA</span>
                    }
                </div>
            </div>
            <div className='mx-auto mb-8 max-w-4xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'>
                <h1 className='my-2 text-lg font-bold text-slate-900'>Applied Jobs</h1>
                {/* Applied Job Table   */}
                <AppliedJobTable />
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile
