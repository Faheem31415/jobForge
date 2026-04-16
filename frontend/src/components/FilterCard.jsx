import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'

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
        <div className='w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:sticky md:top-20'>
            <h1 className='text-lg font-bold text-slate-900'>Filter Jobs</h1>
            <hr className='mt-3 border-slate-200' />

            <div>
                {filterData?.map((data, index) => (
                    <div key={index}>
                        <h1 className='mt-4 text-sm font-semibold uppercase tracking-wide text-slate-500'>
                            {data.filterType}
                        </h1>

                        <RadioGroup
                            value={selectedFilters[data.filterType] || ''}
                            onValueChange={(value) => changeHandler(data.filterType, value)}
                        >
                            {data.array.map((item, idx) => {
                                const itemId = `id${index}-${idx}`;
                                return (
                                    <div
                                        key={itemId}
                                        className='my-2 flex items-center space-x-2 rounded-lg px-1 py-1 transition hover:bg-slate-50'
                                    >
                                        <RadioGroupItem value={item} id={itemId} />
                                        <Label htmlFor={itemId}>{item}</Label>
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