import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, Menu, User2, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Request failed");
        }
    }

    const NavLinks = () => (
        <ul className='flex flex-col gap-3 text-sm font-medium text-slate-700 md:flex-row md:items-center md:gap-6'>
            {
                user && user.role === 'recruiter' ? (
                    <>
                        <li><Link className='transition hover:text-violet-600' to="/admin/companies">Companies</Link></li>
                        <li><Link className='transition hover:text-violet-600' to="/admin/jobs">Jobs</Link></li>
                    </>
                ) : (
                    <>
                        <li><Link className='transition hover:text-violet-600' to="/">Home</Link></li>
                        <li><Link className='transition hover:text-violet-600' to="/jobs">Jobs</Link></li>
                        <li><Link className='transition hover:text-violet-600' to="/browse">Browse</Link></li>
                    </>
                )
            }
        </ul>
    )

    return (
        <header id="top" className='sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur'>
            <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
                <div>
                    <h1 className='text-2xl font-bold tracking-tight text-slate-900'>Job<span className='text-violet-600'>Portal</span></h1>
                </div>
                <button onClick={() => setMobileOpen(!mobileOpen)} className='rounded-lg border border-slate-200 p-2 text-slate-700 md:hidden'>
                    {mobileOpen ? <X className='h-4 w-4' /> : <Menu className='h-4 w-4' />}
                </button>
                <div className='hidden items-center gap-10 md:flex'>
                    <NavLinks />
                    {
                        !user ? (
                            <div className='flex items-center gap-2'>
                                <Link to="/login"><Button variant="outline" className="rounded-xl border-slate-300">Login</Button></Link>
                                <Link to="/signup"><Button className="rounded-xl bg-violet-600 hover:bg-violet-700">Signup</Button></Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 rounded-2xl border-slate-200">
                                    <div className=''>
                                        <div className='flex gap-2 space-y-2'>
                                            <Avatar className="cursor-pointer">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                            </Avatar>
                                            <div>
                                                <h4 className='font-medium'>{user?.fullname}</h4>
                                                <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                                            </div>
                                        </div>
                                        <div className='flex flex-col my-2 text-gray-600'>
                                            {
                                                user && user.role === 'student' && (
                                                    <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                        <User2 />
                                                        <Button variant="link"> <Link to="/profile">View Profile</Link></Button>
                                                    </div>
                                                )
                                            }

                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                <LogOut />
                                                <Button onClick={logoutHandler} variant="link">Logout</Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }

                </div>
            </div>
            {mobileOpen && (
                <div className='border-t border-slate-200 bg-white px-4 py-4 md:hidden'>
                    <div className='space-y-4'>
                        <NavLinks />
                        {!user ? (
                            <div className='grid grid-cols-2 gap-2'>
                                <Link to="/login"><Button variant="outline" className="w-full rounded-xl">Login</Button></Link>
                                <Link to="/signup"><Button className="w-full rounded-xl bg-violet-600 hover:bg-violet-700">Signup</Button></Link>
                            </div>
                        ) : (
                            <Button onClick={logoutHandler} variant="outline" className="w-full rounded-xl">Logout</Button>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar
