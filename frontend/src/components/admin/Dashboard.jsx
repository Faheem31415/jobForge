import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Briefcase, Users } from 'lucide-react'

const COLORS = ['#f59e0b', '#10b981', '#ef4444']; // Pending (Yellow), Accepted (Green), Rejected (Red)

const Dashboard = () => {
    const { user } = useSelector(store => store.auth);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/analytics`, { withCredentials: true });
                if (res.data.success) {
                    setAnalytics(res.data);
                }
            } catch (error) {
                console.log("Error fetching analytics:", error);
            }
            setLoading(false);
        }
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className='min-h-screen bg-slate-50'>
                <Navbar />
                <div className='flex justify-center items-center h-[80vh]'>
                    <div className='animate-pulse text-xl text-slate-500 font-semibold'>Loading Dashboard...</div>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-slate-50'>
            <Navbar />
            <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
                <h1 className='text-3xl font-bold text-slate-900 mb-8'>Analytics Dashboard</h1>
                
                {/* Metrics Cards */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                    <div className='bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-4'>
                        <div className='p-4 bg-indigo-100 rounded-full text-indigo-600'>
                            <Briefcase size={32} />
                        </div>
                        <div>
                            <p className='text-sm text-slate-500 font-medium uppercase tracking-wide'>Total Jobs Posted</p>
                            <h2 className='text-4xl font-bold text-slate-900'>{analytics?.stats?.totalJobs || 0}</h2>
                        </div>
                    </div>
                    <div className='bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-4'>
                        <div className='p-4 bg-purple-100 rounded-full text-purple-600'>
                            <Users size={32} />
                        </div>
                        <div>
                            <p className='text-sm text-slate-500 font-medium uppercase tracking-wide'>Total Applications Received</p>
                            <h2 className='text-4xl font-bold text-slate-900'>{analytics?.stats?.totalApplications || 0}</h2>
                        </div>
                    </div>
                </div>

                {/* Charts Area */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    
                    {/* Line Chart */}
                    <div className='bg-white rounded-2xl shadow-sm border border-slate-200 p-6'>
                        <h2 className='text-xl font-semibold text-slate-800 mb-6'>Applications Over Time</h2>
                        {analytics?.timelineData?.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={analytics.timelineData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                                    <Line type="monotone" dataKey="applications" stroke="#8B5CF6" strokeWidth={3} dot={{r: 4, fill: '#8B5CF6'}} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className='h-[300px] flex items-center justify-center text-slate-400 border-2 border-dashed rounded-xl'>No timeline data yet</div>
                        )}
                    </div>

                    {/* Pie Chart */}
                    <div className='bg-white rounded-2xl shadow-sm border border-slate-200 p-6'>
                        <h2 className='text-xl font-semibold text-slate-800 mb-6'>Application Status Distribution</h2>
                        {analytics?.statusData?.some(d => d.value > 0) ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={analytics.statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {analytics.statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className='h-[300px] flex items-center justify-center text-slate-400 border-2 border-dashed rounded-xl'>No application data yet</div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Dashboard
