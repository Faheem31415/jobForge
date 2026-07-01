import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search, Sparkles } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <section className='relative overflow-hidden bg-slate-50 pt-16 pb-20 dark:bg-slate-950'>
            {/* Background Decorative Elements */}
            <div className='absolute left-1/2 top-0 -translate-x-1/2 blur-[120px] opacity-30 dark:opacity-20'>
                <div className='h-[400px] w-[600px] rounded-full bg-gradient-to-br from-primary to-indigo-400' />
            </div>
            
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='relative flex flex-col items-center text-center'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className='mb-6 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary'
                    >
                        <Sparkles className='h-4 w-4' />
                        <span>The Future of Hiring is Here</span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className='mb-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl dark:text-white'
                    >
                        Find Your Next <br /> 
                        <span className='bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent'>Career Milestone</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className='mb-10 max-w-2xl text-lg text-slate-600 dark:text-slate-400'
                    >
                        Discover thousands of job opportunities with all the information you need. 
                        Its your time to shine and land that dream job.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className='group relative w-full max-w-2xl'
                    >
                        <div className='absolute -inset-1 rounded-[22px] bg-gradient-to-r from-primary to-indigo-600 opacity-20 blur transition duration-1000 group-hover:opacity-40 group-hover:duration-200' />
                        <div className='relative flex w-full items-center gap-2 rounded-[20px] border border-white/20 bg-white p-2 shadow-2xl dark:bg-slate-900'>
                            <div className='flex flex-1 items-center px-4'>
                                <Search className='h-5 w-5 text-slate-400' />
                                <input
                                    type="text"
                                    placeholder='Job title, keywords, or company...'
                                    onChange={(e) => setQuery(e.target.value)}
                                    className='h-12 w-full border-none bg-transparent px-3 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:ring-0 dark:text-white'
                                />
                            </div>
                            <Button 
                                onClick={searchJobHandler} 
                                className="h-12 rounded-[14px] bg-primary px-8 font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl"
                            >
                                Search
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className='mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-slate-500 dark:text-slate-500'
                    >
                        <span>Popular: UI Designer, Frontend Developer, Product Manager</span>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection

