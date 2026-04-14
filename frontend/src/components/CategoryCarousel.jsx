import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const category = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer"
]

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
    <section className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='mb-6 flex items-end justify-between'>
            <h2 className='text-xl font-bold text-slate-900 sm:text-2xl'>Explore by category</h2>
        </div>
        <Carousel className="mx-auto w-full max-w-5xl">
            <CarouselContent>
                {category?.map((cat, index) => (
                    <CarouselItem 
                        key={index} 
                        className="basis-1/2 sm:basis-1/3 lg:basis-1/4"
                    >
                        <Button 
                            onClick={() => searchJobHandler(cat)} 
                            variant="outline" 
                            className="w-full rounded-2xl border-slate-200 bg-white py-5 text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                        >
                            {cat}
                        </Button>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    </section>
);
}

export default CategoryCarousel
