'use client';
import React, { useState, useEffect } from 'react';
import {
    ChevronRight,
    Zap,
    Shield,
    BarChart3,
    Rocket,
    Mail,
    Users,
    Globe,
    ArrowRight,
    Menu,
    X,
    Check,
} from 'lucide-react';

// Navigation Component
const Navigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className='fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-green-500/20'>
            <div className='max-w-7xl mx-auto px-6'>
                <div className='flex items-center justify-between h-16'>
                    <div className='flex items-center space-x-2'>
                        <div className='w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center'>
                            <Mail className='w-5 h-5 text-black' />
                        </div>
                        <span className='text-xl font-bold text-white'>SendStuff</span>
                    </div>

                    <div className='hidden md:flex items-center space-x-8'>
                        <a href='#features' className='text-gray-300 hover:text-green-400 transition-colors'>
                            Features
                        </a>
                        <a href='#pricing' className='text-gray-300 hover:text-green-400 transition-colors'>
                            Pricing
                        </a>
                        <a href='#about' className='text-gray-300 hover:text-green-400 transition-colors'>
                            About
                        </a>
                        <button className='bg-green-500 hover:bg-green-600 text-black font-semibold px-4 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-green-500/25'>
                            Get Started
                        </button>
                    </div>

                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className='md:hidden text-white'>
                        {isMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
                    </button>
                </div>

                {isMenuOpen && (
                    <div className='md:hidden absolute top-16 left-0 right-0 bg-black/95 backdrop-blur-md border-b border-green-500/20'>
                        <div className='px-6 py-4 space-y-4'>
                            <a href='#features' className='block text-gray-300 hover:text-green-400'>
                                Features
                            </a>
                            <a href='#pricing' className='block text-gray-300 hover:text-green-400'>
                                Pricing
                            </a>
                            <a href='#about' className='block text-gray-300 hover:text-green-400'>
                                About
                            </a>
                            <button className='w-full bg-green-500 hover:bg-green-600 text-black font-semibold px-4 py-2 rounded-lg'>
                                Get Started
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

// Hero Section Component
const HeroSection = () => {
    const [glitchText, setGlitchText] = useState('SendStuff');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const interval = setInterval(() => {
            const glitches = ['S3ndStuff', 'SendSt#ff', 'SendStuff', 'S€ndStuff', 'SendStuff'];
            const randomIndex = Math.floor(Math.random() * glitches.length);
            const randomGlitch = glitches[randomIndex] || 'SendStuff';
            setGlitchText(randomGlitch);

            setTimeout(() => setGlitchText('SendStuff'), 150);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    // Don't render until mounted to prevent hydration issues
    if (!mounted) {
        return (
            <section className='min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black'>
                <div className='relative z-10 text-center max-w-6xl mx-auto px-6'>
                    <h1 className='text-6xl md:text-8xl font-bold mb-6'>
                        <span className='bg-gradient-to-r from-white via-green-100 to-green-400 bg-clip-text text-transparent'>
                            SendStuff
                        </span>
                    </h1>
                </div>
            </section>
        );
    }

    return (
        <section className='min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black'>
            {/* Background effects */}
            <div className='absolute inset-0'>
                <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse'></div>
                <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse delay-1000'></div>
            </div>

            {/* Grid pattern */}
            <div className='absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:50px_50px]'></div>

            <div className='relative z-10 text-center max-w-6xl mx-auto px-6'>
                <div className='mb-6'>
                    <span className='inline-block px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-sm font-medium mb-8'>
                         Enterprise-Grade Newsletter Platform
                    </span>
                </div>

                <h1 className='text-6xl md:text-8xl font-bold mb-6'>
                    <span className='bg-gradient-to-r from-white via-green-100 to-green-400 bg-clip-text text-transparent'>
                        {glitchText}
                    </span>
                </h1>

                <p className='text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed'>
                    Highly scalable, enterprise-grade newsletter management platform built with
                    <span className='text-green-400 font-semibold'> modern architecture patterns</span>
                </p>

                <div className='flex flex-col md:flex-row gap-4 justify-center items-center mb-12'>
                    <button className='group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-black font-bold px-8 py-4 rounded-xl transition-all hover:shadow-2xl hover:shadow-green-500/25 hover:scale-105'>
                        Start Building
                        <ArrowRight className='inline ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform' />
                    </button>
                    <button className='group border border-green-500/50 hover:border-green-400 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:bg-green-500/10'>
                        View Documentation
                        <ChevronRight className='inline ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform' />
                    </button>
                </div>

                {/* Stats */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
                    <div className='text-center'>
                        <div className='text-3xl font-bold text-green-400 mb-2'>99.9%</div>
                        <div className='text-gray-400'>Uptime Guarantee</div>
                    </div>
                    <div className='text-center'>
                        <div className='text-3xl font-bold text-green-400 mb-2'>10M+</div>
                        <div className='text-gray-400'>Emails Delivered</div>
                    </div>
                    <div className='text-center'>
                        <div className='text-3xl font-bold text-green-400 mb-2'>500+</div>
                        <div className='text-gray-400'>Enterprise Clients</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Features Section Component
const FeaturesSection = () => {
    const features = [
        {
            icon: Rocket,
            title: 'Turborepo Architecture',
            description:
                'Leverages Turborepo for build orchestration with maximum code reuse and maintainability across microservices.',
        },
        {
            icon: Zap,
            title: 'Lightning Fast',
            description: 'Optimized performance with smart caching, CDN distribution, and intelligent load balancing.',
        },
        {
            icon: Shield,
            title: 'Enterprise Security',
            description: 'SOC 2 compliant with end-to-end encryption, advanced threat protection, and audit logging.',
        },
        {
            icon: BarChart3,
            title: 'Advanced Analytics',
            description:
                'Real-time insights with detailed metrics, A/B testing, and predictive analytics for better engagement.',
        },
        {
            icon: Users,
            title: 'Team Collaboration',
            description:
                'Built for teams with role-based access, approval workflows, and collaborative editing features.',
        },
        {
            icon: Globe,
            title: 'Global Scale',
            description:
                'Multi-region deployment with auto-scaling infrastructure to handle millions of subscribers worldwide.',
        },
    ];

    return (
        <section id='features' className='py-24 bg-gradient-to-b from-black to-gray-900 relative'>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.03)_0%,transparent_50%)]'></div>

            <div className='max-w-7xl mx-auto px-6 relative z-10'>
                <div className='text-center mb-16'>
                    <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
                        Built for <span className='text-green-400'>Modern Teams</span>
                    </h2>
                    <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
                        Microservices-oriented design with shared packages for maximum efficiency and scalability
                    </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className='group p-6 bg-gray-900/50 border border-gray-800 hover:border-green-500/50 rounded-xl transition-all hover:shadow-xl hover:shadow-green-500/10 hover:scale-105'
                        >
                            <div className='w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                <feature.icon className='w-6 h-6 text-black' />
                            </div>
                            <h3 className='text-xl font-semibold text-white mb-3'>{feature.title}</h3>
                            <p className='text-gray-400 leading-relaxed'>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Pricing Section Component
const PricingSection = () => {
    const plans = [
        {
            name: 'Starter',
            price: '$29',
            period: '/month',
            description: 'Perfect for small teams getting started',
            features: [
                'Up to 10K subscribers',
                '5 team members',
                'Basic analytics',
                'Email support',
                'Core API access',
            ],
        },
        {
            name: 'Professional',
            price: '$99',
            period: '/month',
            description: 'Advanced features for growing businesses',
            features: [
                'Up to 100K subscribers',
                '25 team members',
                'Advanced analytics',
                'Priority support',
                'Full API access',
                'A/B testing',
                'Custom domains',
            ],
            popular: true,
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            period: '',
            description: 'Tailored solutions for large organizations',
            features: [
                'Unlimited subscribers',
                'Unlimited team members',
                'White-label solution',
                '24/7 phone support',
                'Custom integrations',
                'SLA guarantee',
                'Dedicated CSM',
            ],
        },
    ];

    return (
        <section id='pricing' className='py-24 bg-gradient-to-b from-gray-900 to-black'>
            <div className='max-w-7xl mx-auto px-6'>
                <div className='text-center mb-16'>
                    <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
                        Simple, <span className='text-green-400'>Transparent</span> Pricing
                    </h2>
                    <p className='text-xl text-gray-300'>Choose the plan that scales with your business</p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative p-8 rounded-2xl border transition-all hover:scale-105 ${
                                plan.popular
                                    ? 'border-green-500 bg-gradient-to-b from-green-500/10 to-transparent shadow-xl shadow-green-500/20'
                                    : 'border-gray-800 bg-gray-900/50 hover:border-green-500/30'
                            }`}
                        >
                            {plan.popular && (
                                <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
                                    <span className='bg-gradient-to-r from-green-400 to-green-600 text-black px-4 py-1 rounded-full text-sm font-bold'>
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className='text-center mb-8'>
                                <h3 className='text-2xl font-bold text-white mb-2'>{plan.name}</h3>
                                <div className='flex items-end justify-center mb-2'>
                                    <span className='text-4xl font-bold text-green-400'>{plan.price}</span>
                                    <span className='text-gray-400 ml-1'>{plan.period}</span>
                                </div>
                                <p className='text-gray-400'>{plan.description}</p>
                            </div>

                            <ul className='space-y-4 mb-8'>
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className='flex items-center text-gray-300'>
                                        <Check className='w-5 h-5 text-green-400 mr-3 flex-shrink-0' />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                                    plan.popular
                                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-black hover:from-green-400 hover:to-green-500'
                                        : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700 hover:border-green-500/50'
                                }`}
                            >
                                Get Started
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Footer Component
const Footer = () => {
    return (
        <footer className='bg-black border-t border-gray-800 py-12'>
            <div className='max-w-7xl mx-auto px-6'>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
                    <div>
                        <div className='flex items-center space-x-2 mb-4'>
                            <div className='w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center'>
                                <Mail className='w-5 h-5 text-black' />
                            </div>
                            <span className='text-xl font-bold text-white'>SendStuff</span>
                        </div>
                        <p className='text-gray-400 mb-4'>
                            Enterprise-grade newsletter management platform built for modern teams.
                        </p>
                    </div>

                    <div>
                        <h4 className='text-white font-semibold mb-4'>Product</h4>
                        <ul className='space-y-2'>
                            <li>
                                <a href='#' className='text-gray-400 hover:text-green-400 transition-colors'>
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href='#' className='text-gray-400 hover:text-green-400 transition-colors'>
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a href='#' className='text-gray-400 hover:text-green-400 transition-colors'>
                                    API
                                </a>
                            </li>
                            <li>
                                <a href='#' className='text-gray-400 hover:text-green-400 transition-colors'>
                                    Documentation
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className='text-white font-semibold mb-4'>Company</h4>
                        <ul className='space-y-2'>
                            <li>
                                <a href='#' className='text-gray-400 hover:text-green-400 transition-colors'>
                                    About
                                </a>
                            </li>
                            <li>
                                <a href='#' className='text-gray-400 hover:text-green-400 transition-colors'>
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href='#' className='text-gray-400 hover:text-green-400 transition-colors'>
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a href='#' className='text-gray-400 hover:text-green-400 transition-colors'>
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className='text-white font-semibold mb-4'>Support</h4>
                        <ul className='space-y-2'>
                            <li>
                                <a href='#' className='text-gray-400 hover:text-green-400 transition-colors'>
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href='#' className='text-gray-400 hover:text-green-400 transition-colors'>
                                    Status
                                </a>
                            </li>
                            <li>
                                <a href='#' className='text-gray-400 hover:text-green-400 transition-colors'>
                                    Security
                                </a>
                            </li>
                            <li>
                                <a href='#' className='text-gray-400 hover:text-green-400 transition-colors'>
                                    Privacy
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className='border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center'>
                    <p className='text-gray-400 text-sm'>© 2025 SendStuff. All rights reserved.</p>
                    <div className='flex space-x-6 mt-4 md:mt-0'>
                        <a href='#' className='text-gray-400 hover:text-green-400 transition-colors'>
                            Terms
                        </a>
                        <a href='#' className='text-gray-400 hover:text-green-400 transition-colors'>
                            Privacy
                        </a>
                        <a href='#' className='text-gray-400 hover:text-green-400 transition-colors'>
                            Cookies
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// Main App Component
const App = () => {
    return (
        <div className='min-h-screen bg-black text-white overflow-x-hidden'>
            <Navigation />
            <HeroSection />
            <FeaturesSection />
            <PricingSection />
            <Footer />
        </div>
    );
};

export default App;
