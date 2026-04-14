import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'

const fitlerData = [
    {
        fitlerType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        fitlerType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {
        fitlerType: "Salary",
        array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
    },
]

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const dispatch = useDispatch();
    const changeHandler = (value) => {
        setSelectedValue(value);
    }
    useEffect(()=>{
        dispatch(setSearchedQuery(selectedValue));
    },[selectedValue]);
    return (
    <div className='w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:sticky md:top-20'>
        <h1 className='text-lg font-bold text-slate-900'>Filter Jobs</h1>
        <hr className='mt-3 border-slate-200' />

        <RadioGroup value={selectedValue} onValueChange={changeHandler}>
            {fitlerData?.map((data, index) => (
                <div key={index}>
                    <h1 className='mt-4 text-sm font-semibold uppercase tracking-wide text-slate-500'>
                        {data.fitlerType}
                    </h1>

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
                </div>
            ))}
        </RadioGroup>
    </div>
);
}

export default FilterCard
