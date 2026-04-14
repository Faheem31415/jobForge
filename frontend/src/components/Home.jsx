import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { BriefcaseBusiness, Rocket, ShieldCheck, Sparkles } from 'lucide-react'

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate("/admin/companies");
    }
  }, []);
  return (
    <div className='min-h-screen bg-slate-50 text-slate-900'>
      <Navbar />
      <HeroSection />
      <section id="features" className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='mb-8 text-center'>
          <p className='text-sm font-semibold uppercase tracking-wider text-violet-600'>Features</p>
          <h2 className='mt-2 text-2xl font-bold sm:text-3xl'>Built for modern hiring teams</h2>
        </div>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {[
            { icon: BriefcaseBusiness, title: 'Curated Jobs', desc: 'Discover high-quality opportunities from trusted companies.' },
            { icon: Rocket, title: 'Fast Apply', desc: 'Apply quickly with a smooth and mobile-friendly flow.' },
            { icon: ShieldCheck, title: 'Verified Employers', desc: 'Browse roles posted by verified recruiters and startups.' },
            { icon: Sparkles, title: 'Smart Discovery', desc: 'Find jobs by skills, role type, and compensation range.' }
          ].map((feature) => (
            <div key={feature.title} className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg'>
              <feature.icon className='mb-4 h-6 w-6 text-violet-600' />
              <h3 className='text-base font-semibold'>{feature.title}</h3>
              <p className='mt-2 text-sm leading-6 text-slate-600'>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="how-it-works" className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10'>
          <h2 className='text-2xl font-bold sm:text-3xl'>How it works</h2>
          <div className='mt-8 grid gap-6 md:grid-cols-3'>
            {['Create your profile in minutes', 'Search and filter roles by your preference', 'Apply and track your status'].map((step, index) => (
              <div key={step} className='rounded-2xl bg-slate-50 p-5'>
                <span className='text-sm font-semibold text-violet-600'>0{index + 1}</span>
                <p className='mt-2 text-sm text-slate-700'>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CategoryCarousel />
      <LatestJobs />
      <section className='mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8'>
        <div className='rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-white shadow-xl sm:p-10'>
          <h2 className='text-2xl font-bold sm:text-3xl'>Ready to land your next role?</h2>
          <p className='mt-3 text-sm text-violet-100 sm:text-base'>Join thousands of professionals using JobPortal to find opportunities faster.</p>
          <a href="#top" className='mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50'>Get Started</a>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default Home
