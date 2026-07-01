import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2, User, Mail, Phone, Lock, Upload, UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'

const Signup = () => {

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.role) {
            toast.error("Please select a role.");
            return;
        }
        const formData = new FormData();    //formdata object
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Request failed");
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [navigate, user])

    return (
        <div className='min-h-screen bg-slate-50 dark:bg-slate-950'>
            <Navbar />
            <div className='mx-auto flex max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8'>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='relative w-full max-w-2xl'
                >
                    <div className='absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl' />
                    <div className='absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl' />

                    <form 
                        onSubmit={submitHandler} 
                        className='relative overflow-hidden rounded-[40px] border border-white bg-white/70 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70 sm:p-12'
                    >
                        <div className='mb-10 text-center'>
                            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary'>
                                <UserPlus className='h-8 w-8' />
                            </div>
                            <h1 className='text-3xl font-black tracking-tight text-slate-900 dark:text-white'>Create Account</h1>
                            <p className='mt-2 text-sm font-medium text-slate-500'>Join JobForge today and start your journey</p>
                        </div>

                        <div className='grid gap-6 sm:grid-cols-2'>
                            <div className='space-y-2'>
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Name</Label>
                                <div className='relative'>
                                    <User className='absolute left-4 top-3 h-5 w-5 text-slate-300' />
                                    <Input
                                        type="text"
                                        value={input.fullname}
                                        name="fullname"
                                        onChange={changeEventHandler}
                                        placeholder="Faheem"
                                        className="h-11 rounded-xl border-slate-200 bg-white pl-12 shadow-sm focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-950"
                                    />
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</Label>
                                <div className='relative'>
                                    <Mail className='absolute left-4 top-3 h-5 w-5 text-slate-300' />
                                    <Input
                                        type="email"
                                        value={input.email}
                                        name="email"
                                        onChange={changeEventHandler}
                                        placeholder="faheem@example.com"
                                        className="h-11 rounded-xl border-slate-200 bg-white pl-12 shadow-sm focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-950"
                                    />
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Phone Number</Label>
                                <div className='relative'>
                                    <Phone className='absolute left-4 top-3 h-5 w-5 text-slate-300' />
                                    <Input
                                        type="text"
                                        value={input.phoneNumber}
                                        name="phoneNumber"
                                        onChange={changeEventHandler}
                                        placeholder="+91 8080808080"
                                        className="h-11 rounded-xl border-slate-200 bg-white pl-12 shadow-sm focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-950"
                                    />
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Password</Label>
                                <div className='relative'>
                                    <Lock className='absolute left-4 top-3 h-5 w-5 text-slate-300' />
                                    <Input
                                        type="password"
                                        value={input.password}
                                        name="password"
                                        onChange={changeEventHandler}
                                        placeholder="••••••••"
                                        className="h-11 rounded-xl border-slate-200 bg-white pl-12 shadow-sm focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-950"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='mt-8 space-y-6'>
                            <div className='rounded-2xl border border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-950/50'>
                                <div className='flex flex-col flex-wrap justify-between gap-6 sm:flex-row sm:items-center'>
                                    <div className='space-y-3'>
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Join as</Label>
                                        <RadioGroup className="flex items-center gap-6">
                                            <div className="flex items-center space-x-2">
                                                <Input
                                                    type="radio"
                                                    name="role"
                                                    id="signup-r1"
                                                    value="student"
                                                    checked={input.role === 'student'}
                                                    onChange={changeEventHandler}
                                                    className="h-4 w-4 cursor-pointer accent-primary"
                                                />
                                                <Label htmlFor="signup-r1" className="cursor-pointer font-bold text-slate-700 dark:text-slate-300">Student</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Input
                                                    type="radio"
                                                    name="role"
                                                    id="signup-r2"
                                                    value="recruiter"
                                                    checked={input.role === 'recruiter'}
                                                    onChange={changeEventHandler}
                                                    className="h-4 w-4 cursor-pointer accent-primary"
                                                />
                                                <Label htmlFor="signup-r2" className="cursor-pointer font-bold text-slate-700 dark:text-slate-300">Recruiter</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                    <div className='space-y-3'>
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Profile Picture</Label>
                                        <div className='relative'>
                                            <Input
                                                accept="image/*"
                                                type="file"
                                                onChange={changeFileHandler}
                                                className="h-11 cursor-pointer rounded-xl border-slate-200 bg-white shadow-sm file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-bold file:text-white dark:border-slate-800 dark:bg-slate-950"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='mt-10'>
                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="h-14 w-full rounded-2xl bg-primary text-lg font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {loading ? (
                                    <><Loader2 className='mr-2 h-5 w-5 animate-spin' /> Creating Account...</>
                                ) : (
                                    <>Create Account</>
                                )}
                            </Button>
                        </div>
                        
                        <div className='mt-10 text-center text-sm font-medium'>
                            <span className='text-slate-500 font-medium'>Already have an account? </span>
                            <Link to="/login" className='font-bold text-primary hover:underline'>Sign In</Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}

export default Signup

