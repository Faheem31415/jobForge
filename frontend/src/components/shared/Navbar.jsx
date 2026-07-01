import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, Menu, User2, X, Briefcase, LayoutDashboard, Building2, Home as HomeIcon, Search, Heart } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
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
            toast.error(error?.response?.data?.message || "Logout failed");
        }
    }

    const navLinks = [
        ...(user?.role === 'recruiter' ? [
            { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
            { name: 'Companies', path: '/admin/companies', icon: Building2 },
            { name: 'Jobs', path: '/admin/jobs', icon: Briefcase },
        ] : [
            { name: 'Home', path: '/', icon: HomeIcon },
            { name: 'Jobs', path: '/jobs', icon: Search },
            { name: 'Browse', path: '/browse', icon: Briefcase },
            ...(user ? [{ name: 'Saved', path: '/saved-jobs', icon: Heart }] : []),
        ])
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <header className='sticky top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-xl transition-all duration-300 dark:bg-slate-950/70'>
            <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link to="/" className='group flex items-center gap-2'>
                        <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-105'>
                            <Briefcase className='h-5 w-5' />
                        </div>
                        <h1 className='text-xl font-bold tracking-tight text-slate-900 dark:text-white'>Job<span className='text-primary'>Forge</span></h1>
                    </Link>
                </motion.div>

                {/* Desktop Nav */}
                <nav className='hidden items-center gap-8 md:flex'>
                    <ul className='flex items-center gap-6'>
                        {navLinks.map((link) => (
                            <li key={link.path}>
                                <Link 
                                    to={link.path} 
                                    className={`relative px-1 py-2 text-sm font-medium transition-colors hover:text-primary ${isActive(link.path) ? 'text-primary' : 'text-slate-600 dark:text-slate-400'}`}
                                >
                                    {link.name}
                                    {isActive(link.path) && (
                                        <motion.div 
                                            layoutId="activeNav"
                                            className="absolute -bottom-[21px] left-0 h-[2px] w-full bg-primary"
                                        />
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className='h-6 w-[1px] bg-slate-200 dark:bg-slate-800' />

                    {
                        !user ? (
                            <div className='flex items-center gap-3'>
                                <Link to="/login">
                                    <Button variant="ghost" className="rounded-xl font-medium">Login</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="rounded-xl bg-primary px-6 font-medium shadow-lg shadow-primary/20 hover:bg-primary/90">Join Now</Button>
                                </Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Avatar className="h-9 w-9 cursor-pointer border-2 border-primary/10 transition-colors hover:border-primary">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                        </Avatar>
                                    </motion.div>
                                </PopoverTrigger>
                                <PopoverContent className="mt-2 w-72 rounded-2xl border-white/20 bg-white/90 p-0 shadow-2xl backdrop-blur-xl dark:bg-slate-900/90">
                                    <div className='p-4'>
                                        <div className='flex items-center gap-3 pb-3'>
                                            <Avatar className="h-10 w-10 border border-primary/20">
                                                <AvatarImage src={user?.profile?.profilePhoto} />
                                            </Avatar>
                                            <div className='overflow-hidden'>
                                                <h4 className='truncate font-semibold text-slate-900 dark:text-white'>{user?.fullname}</h4>
                                                <p className='truncate text-xs text-slate-500'>{user?.email}</p>
                                            </div>
                                        </div>
                                        <div className='space-y-1 pt-2'>
                                            {user.role === 'student' && (
                                                <Link to="/profile">
                                                    <Button variant="ghost" className="w-full justify-start rounded-xl gap-2 font-medium">
                                                        <User2 className='h-4 w-4' /> View Profile
                                                    </Button>
                                                </Link>
                                            )}
                                            <Button 
                                                onClick={logoutHandler} 
                                                variant="ghost" 
                                                className="w-full justify-start rounded-xl gap-2 font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/30"
                                            >
                                                <LogOut className='h-4 w-4' /> Sign Out
                                            </Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }
                </nav>

                {/* Mobile Menu Button */}
                <button 
                    onClick={() => setMobileOpen(!mobileOpen)} 
                    className='flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition-colors hover:bg-slate-50 md:hidden dark:border-slate-800 dark:bg-slate-900'
                >
                    {mobileOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
                </button>
            </div>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className='overflow-hidden border-t border-slate-100 bg-white/90 backdrop-blur-xl md:hidden dark:border-slate-800 dark:bg-slate-950/90'
                    >
                        <div className='flex flex-col gap-1 p-4'>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                                        isActive(link.path) 
                                        ? 'bg-primary/10 text-primary' 
                                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900'
                                    }`}
                                >
                                    <link.icon className='h-4 w-4' />
                                    {link.name}
                                </Link>
                            ))}
                            <div className='my-2 h-[1px] bg-slate-100 dark:bg-slate-800' />
                            {!user ? (
                                <div className='grid grid-cols-2 gap-3 p-2'>
                                    <Link to="/login" onClick={() => setMobileOpen(false)}>
                                        <Button variant="outline" className="w-full rounded-xl">Login</Button>
                                    </Link>
                                    <Link to="/signup" onClick={() => setMobileOpen(false)}>
                                        <Button className="w-full rounded-xl bg-primary">Join</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className='p-2'>
                                    <Button 
                                        onClick={() => { logoutHandler(); setMobileOpen(false); }} 
                                        variant="outline" 
                                        className="w-full rounded-xl gap-2 border-rose-200 text-rose-600 hover:bg-rose-50"
                                    >
                                        <LogOut className='h-4 w-4' /> Log Out
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

export default Navbar

