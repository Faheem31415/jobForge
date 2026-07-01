import React, { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT, resolveApiAssetUrl } from '@/utils/constant';
import axios from 'axios';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const [scheduleOpen, setScheduleOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [interviewData, setInterviewData] = useState({ date: '', link: '' });

    const statusHandler = async (status, id) => {
        if (status === "Accepted") {
            setSelectedApp(id);
            setScheduleOpen(true);
            return;
        }

        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error");
        }
    }

    const scheduleInterviewHandler = async () => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${selectedApp}/update`, { 
                status: "Accepted",
                interviewDate: interviewData.date,
                interviewLink: interviewData.link
            });
            if (res.data.success) {
                toast.success(res.data.message);
                setScheduleOpen(false);
                setInterviewData({ date: '', link: '' });
                setSelectedApp(null);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error");
        }
    }

    const downloadResume = async (resumeUrl, resumeName) => {
        try {
            const response = await fetch(resolveApiAssetUrl(resumeUrl));
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = resumeName || 'resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
            toast.success("Downloading resume...");
        } catch (e) {
            window.open(resolveApiAssetUrl(resumeUrl), '_blank');
        }
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied user</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants?.applications?.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item?.applicant?.fullname}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell >
                                    {
                                        item.applicant?.profile?.resume ? (
                                            <span 
                                                className="text-blue-600 cursor-pointer hover:underline" 
                                                onClick={() => downloadResume(item?.applicant?.profile?.resume, item?.applicant?.profile?.resumeOriginalName)}
                                            >
                                                {item?.applicant?.profile?.resumeOriginalName}
                                            </span>
                                        ) : <span>NA</span>
                                    }
                                </TableCell>
                                <TableCell>{item?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell className="float-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            {
                                                shortlistingStatus.map((status, index) => {
                                                    return (
                                                        <div onClick={() => statusHandler(status, item?._id)} key={index} className='flex w-fit items-center my-2 cursor-pointer hover:text-indigo-600'>
                                                            <span>{status}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>

            <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Schedule Interview</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="date">Date & Time</Label>
                            <Input 
                                id="date" 
                                type="datetime-local" 
                                value={interviewData.date}
                                onChange={(e) => setInterviewData({...interviewData, date: e.target.value})}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="link">Meeting Link (Zoom/Meet)</Label>
                            <Input 
                                id="link" 
                                type="url" 
                                placeholder="https://meet.google.com/..."
                                value={interviewData.link}
                                onChange={(e) => setInterviewData({...interviewData, link: e.target.value})}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setScheduleOpen(false)}>Cancel</Button>
                        <Button onClick={scheduleInterviewHandler} className="bg-indigo-600 hover:bg-indigo-700">Accept & Invite</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ApplicantsTable
