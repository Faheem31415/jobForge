import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { Button } from '../ui/button';

const ErrorPage = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow flex flex-col items-center justify-center p-4 bg-slate-50">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm text-center border border-slate-100">
                    <h1 className="text-4xl font-bold text-red-500 mb-4">Oops!</h1>
                    <p className="text-lg text-slate-700 mb-2">Sorry, an unexpected error has occurred.</p>
                    <p className="text-slate-500 mb-6 italic">
                        {error?.statusText || error?.message || 'Page not found or a crash occurred.'}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button onClick={() => navigate(-1)} variant="outline" className="rounded-xl">Go Back</Button>
                        <Button onClick={() => navigate('/')} className="rounded-xl bg-violet-600 hover:bg-violet-700">Home Page</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
