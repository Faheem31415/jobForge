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
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2, Mail, Lock, LogIn } from 'lucide-react'
import { motion } from 'framer-motion'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
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
            <div className='mx-auto flex max-w-7xl items-center justify-center px-4 py-20 sm:px-6 lg:px-8'>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className='relative w-full max-w-lg'
                >
                    <div className='absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl' />
                    <div className='absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl' />

                    <form 
                        onSubmit={submitHandler} 
                        className='relative overflow-hidden rounded-[40px] border border-white bg-white/70 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70 sm:p-12'
                    >
                        <div className='mb-10 text-center'>
                            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary'>
                                <LogIn className='h-8 w-8' />
                            </div>
                            <h1 className='text-3xl font-black tracking-tight text-slate-900 dark:text-white'>Welcome Back</h1>
                            <p className='mt-2 text-sm font-medium text-slate-500'>Sign in to your account to continue</p>
                        </div>

                        <div className='space-y-6'>
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
                                        className="h-11 rounded-xl border-slate-200 bg-white pl-12 shadow-sm transition-all focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-950"
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
                                        className="h-11 rounded-xl border-slate-200 bg-white pl-12 shadow-sm transition-all focus:ring-primary/20 dark:border-slate-800 dark:bg-slate-950"
                                    />
                                </div>
                            </div>

                            <div className='py-2'>
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Portal Access</Label>
                                <RadioGroup className="mt-4 flex items-center gap-6">
                                    <div className="flex items-center space-x-2">
                                        <Input
                                            type="radio"
                                            name="role"
                                            id="r1"
                                            value="student"
                                            checked={input.role === 'student'}
                                            onChange={changeEventHandler}
                                            className="h-4 w-4 cursor-pointer accent-primary"
                                        />
                                        <Label htmlFor="r1" className="cursor-pointer font-bold text-slate-700 dark:text-slate-300">Student</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Input
                                            type="radio"
                                            name="role"
                                            id="r2"
                                            value="recruiter"
                                            checked={input.role === 'recruiter'}
                                            onChange={changeEventHandler}
                                            className="h-4 w-4 cursor-pointer accent-primary"
                                        />
                                        <Label htmlFor="r2" className="cursor-pointer font-bold text-slate-700 dark:text-slate-300">Recruiter</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>

                        <div className='mt-10'>
                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="h-14 w-full rounded-2xl bg-primary text-lg font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {loading ? (
                                    <><Loader2 className='mr-2 h-5 w-5 animate-spin' /> Processing...</>
                                ) : (
                                    <>Sign In</>
                                )}
                            </Button>
                        </div>
                        
                        <div className='mt-10 text-center text-sm font-medium'>
                            <span className='text-slate-500 font-medium'>New to JobForge? </span>
                            <Link to="/signup" className='font-bold text-primary hover:underline'>Create Account</Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}

export default Login

