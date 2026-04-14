import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <section className='mx-auto max-w-7xl px-4 pt-14 text-center sm:px-6 lg:px-8'>
            <div className='relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-4 py-12 shadow-sm sm:px-8'>
                <div className='absolute -left-20 -top-20 h-52 w-52 rounded-full bg-violet-200/40 blur-3xl' />
                <div className='absolute -bottom-20 -right-20 h-52 w-52 rounded-full bg-indigo-200/40 blur-3xl' />
                <div className='relative flex flex-col items-center gap-5'>
                <span className='rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700'>No. 1 Job Hunt Website</span>
                <h1 className='text-3xl font-bold leading-tight sm:text-5xl'>Search, Apply & <br /> Get Your <span className='text-violet-600'>Dream Jobs</span></h1>
                <p className='max-w-2xl text-sm text-slate-600 sm:text-base'>Find the right opportunities with a clean job discovery experience designed for speed and clarity.</p>
                <div className='flex w-full max-w-2xl items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-md'>
                    <input
                        type="text"
                        placeholder='Find your dream jobs'
                        onChange={(e) => setQuery(e.target.value)}
                        className='h-11 w-full rounded-xl border-none bg-transparent px-3 text-sm outline-none ring-0 placeholder:text-slate-400'

                    />
                    <Button onClick={searchJobHandler} className="h-11 rounded-xl bg-violet-600 px-5 hover:bg-violet-700">
                        <Search className='h-5 w-5' />
                    </Button>
                </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
