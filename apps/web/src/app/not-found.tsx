'use client';
import React from 'react';
import { Home, ArrowLeft, Search, Mail } from 'lucide-react';
import Link from 'next/link';

const NotFound = () => {
    return (
        <div className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center relative overflow-hidden'>
            {/* Background effects */}
            <div className='absolute inset-0'>
                <div className='absolute top-1/3 left-1/3 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse'></div>
                <div className='absolute bottom-1/3 right-1/3 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse delay-1000'></div>
            </div>

            {/* Grid pattern */}
            <div className='absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:50px_50px]'></div>

            {/* Logo in top left */}
            <div className='absolute top-6 left-6 flex items-center space-x-2 z-20'>
                <div className='w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center'>
                    <Mail className='w-5 h-5 text-black' />
                </div>
                <span className='text-xl font-bold text-white'>SendStuff</span>
            </div>

            <div className='relative z-10 text-center max-w-4xl mx-auto px-6'>
                {/* 404 Number */}
                <div className='mb-8'>
                    <h1 className='text-9xl md:text-[12rem] font-bold text-transparent bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text leading-none'>
                        404
                    </h1>
                    <div className='h-1 w-32 bg-gradient-to-r from-transparent via-green-500 to-transparent mx-auto mt-4'></div>
                </div>

                {/* Error message */}
                <div className='mb-8'>
                    <h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>Page Not Found</h2>
                    <p className='text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed'>
                        Looks like this newsletter got lost in cyberspace. The page you're looking for doesn't exist or
                        has been moved.
                    </p>
                </div>

                {/* Action buttons */}
                <div className='flex flex-col md:flex-row gap-4 justify-center items-center mb-12'>
                    <Link href='/' className='group'>
                        <button className='flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-black font-bold px-8 py-4 rounded-xl transition-all hover:shadow-2xl hover:shadow-green-500/25 hover:scale-105'>
                            <Home className='w-5 h-5' />
                            <span>Back to Home</span>
                        </button>
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className='group flex items-center space-x-2 border border-green-500/50 hover:border-green-400 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:bg-green-500/10'
                    >
                        <ArrowLeft className='w-5 h-5 group-hover:-translate-x-1 transition-transform' />
                        <span>Go Back</span>
                    </button>
                </div>

                {/* Search suggestion */}
                <div className='bg-gray-900/50 border border-gray-800 rounded-2xl p-6 max-w-md mx-auto'>
                    <div className='flex items-center space-x-3 mb-4'>
                        <div className='w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center'>
                            <Search className='w-5 h-5 text-green-400' />
                        </div>
                        <h3 className='text-lg font-semibold text-white'>Quick Help</h3>
                    </div>
                    <p className='text-gray-400 text-sm leading-relaxed'>
                        Try checking the URL for typos, or visit our homepage to explore SendStuff's enterprise
                        newsletter platform.
                    </p>
                </div>

                {/* Status indicator */}
                <div className='mt-8 flex items-center justify-center space-x-2'>
                    <div className='w-2 h-2 bg-red-500 rounded-full animate-pulse'></div>
                    <span className='text-gray-500 text-sm font-mono'>ERROR 404</span>
                    <div className='w-2 h-2 bg-red-500 rounded-full animate-pulse delay-500'></div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className='absolute bottom-10 left-10 opacity-20'>
                <div className='w-16 h-16 border border-green-500/30 rounded-lg rotate-45'></div>
            </div>
            <div className='absolute top-20 right-10 opacity-20'>
                <div className='w-12 h-12 border border-green-500/30 rounded-full'></div>
            </div>
        </div>
    );
};

export default NotFound;
