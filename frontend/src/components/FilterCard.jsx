import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { motion } from 'framer-motion'

const filterData = [
    {
        filterType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Remote", "San Francisco, CA"]
    },
    {
        filterType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "HR Manager", "Sales Executive", "Digital Marketing Specialist"]
    },
    {
        filterType: "Salary",
        array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
    },
]

const FilterCard = () => {
    const [selectedFilters, setSelectedFilters] = useState({});
    const dispatch = useDispatch();

    const changeHandler = (filterType, value) => {
        setSelectedFilters(prev => ({ ...prev, [filterType]: value }));
    }

    useEffect(() => {
        const formattedQuery = {};
        Object.keys(selectedFilters).forEach(key => {
            if (selectedFilters[key]) {
                formattedQuery[key] = [selectedFilters[key]];
            }
        });
        dispatch(setSearchedQuery(formattedQuery));
    }, [selectedFilters, dispatch]);

    return (
        <div className='w-full rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:sticky md:top-24'>
            <div className='flex items-center justify-between'>
                <h1 className='text-xl font-extrabold text-slate-900 dark:text-white'>Filters</h1>
                {Object.keys(selectedFilters).length > 0 && (
                    <button 
                        onClick={() => setSelectedFilters({})}
                        className='text-xs font-bold text-primary hover:underline'
                    >
                        Reset
                    </button>
                )}
            </div>
            
            <div className='mt-8 space-y-8'>
                {filterData?.map((data, index) => (
                    <div key={index}>
                        <h1 className='text-[10px] font-bold uppercase tracking-widest text-slate-400'>
                            {data.filterType}
                        </h1>

                        <RadioGroup
                            className="mt-4 gap-2"
                            value={selectedFilters[data.filterType] || ''}
                            onValueChange={(value) => changeHandler(data.filterType, value)}
                        >
                            {data.array.map((item, idx) => {
                                const itemId = `id${index}-${idx}`;
                                const isSelected = selectedFilters[data.filterType] === item;
                                return (
                                    <div
                                        key={itemId}
                                        className={`flex items-center space-x-3 rounded-xl px-3 py-2.5 transition-all ${isSelected ? 'bg-primary/5 ring-1 ring-primary/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                    >
                                        <RadioGroupItem 
                                            value={item} 
                                            id={itemId} 
                                            className={`${isSelected ? 'border-primary text-primary' : ''}`}
                                        />
                                        <Label 
                                            htmlFor={itemId}
                                            className={`text-sm cursor-pointer transition-colors ${isSelected ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}
                                        >
                                            {item}
                                        </Label>
                                    </div>
                                );
                            })}
                        </RadioGroup>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FilterCard