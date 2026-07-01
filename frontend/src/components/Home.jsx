import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { Button } from './ui/button'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { BriefcaseBusiness, Rocket, ShieldCheck, Sparkles, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

const Home = () => {
    useGetAllJobs();
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role === 'recruiter') {
            navigate("/admin/companies");
        }
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className='min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white'>
            <Navbar />
            <HeroSection />

            {/* Features Section */}
            <section id="features" className='mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8'>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='mb-16 text-center'
                >
                    <p className='text-sm font-bold uppercase tracking-widest text-primary'>Why Choose Us</p>
                    <h2 className='mt-3 text-3xl font-extrabold sm:text-4xl'>Built for the next generation of talent</h2>
                    <p className='mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400'>
                        We've redefined the job search experience with tools that actually help you get hired.
                    </p>
                </motion.div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className='grid gap-8 sm:grid-cols-2 lg:grid-cols-4'
                >
                    {[
                        { icon: BriefcaseBusiness, title: 'Curated Jobs', desc: 'Hand-picked opportunities from top-tier companies and high-growth startups.' },
                        { icon: Rocket, title: 'Instant Apply', desc: 'Apply to multiple roles with a single click using your verified profile.' },
                        { icon: ShieldCheck, title: 'Verified Roles', desc: 'Every job posting is audited for authenticity to ensure your safety.' },
                        { icon: Sparkles, title: 'Smart Matching', desc: 'Our AI suggests roles that perfectly align with your skillset and goals.' }
                    ].map((feature) => (
                        <motion.div 
                            key={feature.title} 
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className='group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-primary/20 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900'
                        >
                            <div className='mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white'>
                                <feature.icon className='h-6 w-6' />
                            </div>
                            <h3 className='text-lg font-bold'>{feature.title}</h3>
                            <p className='mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400'>{feature.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Steps Section */}
            <section id="how-it-works" className='bg-white py-24 dark:bg-slate-900/50'>
                <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                    <div className='grid items-center gap-16 lg:grid-cols-2'>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className='text-3xl font-extrabold sm:text-4xl'>Your journey to a new career starts here</h2>
                            <div className='mt-10 space-y-8'>
                                {[
                                    { step: '01', title: 'Create Account', desc: 'Set up your professional identity and upload your resume.' },
                                    { step: '02', title: 'Discover Roles', desc: 'Use advanced filters to find the perfect fit for your lifestyle.' },
                                    { step: '03', title: 'Land the Job', desc: 'Apply securely and track your application status in real-time.' }
                                ].map((item) => (
                                    <div key={item.step} className='flex gap-6'>
                                        <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white'>
                                            {item.step}
                                        </div>
                                        <div>
                                            <h3 className='text-lg font-bold'>{item.title}</h3>
                                            <p className='mt-1 text-slate-600 dark:text-slate-400'>{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className='relative'
                        >
                            <div className='aspect-square rounded-3xl bg-gradient-to-tr from-primary/20 to-indigo-500/20 p-8 shadow-inner'>
                                <div className='h-full w-full rounded-2xl bg-white shadow-2xl dark:bg-slate-800 flex items-center justify-center'>
                                     {/* This would ideally be an illustration or image */}
                                     <BriefcaseBusiness className='h-32 w-32 text-primary opacity-20' />
                                </div>
                            </div>
                            <div className='absolute -bottom-6 -right-6 h-32 w-32 rounded-3xl bg-indigo-600 p-4 shadow-xl flex flex-col justify-center text-white'>
                                <span className='text-2xl font-bold'>10k+</span>
                                <span className='text-xs opacity-80'>Active Jobs</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <CategoryCarousel />
            <LatestJobs />

            {/* CTA Section */}
            <section className='mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8'>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className='relative overflow-hidden rounded-[40px] bg-slate-900 px-8 py-16 text-center text-white shadow-2xl dark:bg-primary'
                >
                    <div className='absolute inset-0 opacity-20 bg-[url("https://www.transparenttextures.com/patterns/cubes.png")]' />
                    <div className='relative z-10 mx-auto max-w-3xl'>
                        <h2 className='text-3xl font-extrabold sm:text-5xl'>Ready to land your next role?</h2>
                        <p className='mt-6 text-lg text-slate-300'>Join thousands of professionals using JobForge to find opportunities faster and smarter.</p>
                        <div className='mt-10 flex flex-wrap justify-center gap-4'>
                            <Button className="h-14 rounded-2xl bg-white px-8 text-lg font-bold text-slate-900 transition-transform hover:scale-105 active:scale-95 dark:text-primary">
                                Get Started Now
                            </Button>
                            <Button variant="outline" className="h-14 rounded-2xl border-white/20 bg-white/10 px-8 text-lg font-bold text-white backdrop-blur-md transition-transform hover:bg-white/20 hover:scale-105">
                                Browse Companies
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </div>
    )
}

export default Home

