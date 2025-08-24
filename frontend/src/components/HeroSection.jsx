import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    const backgroundImages = [
        "/images/banners/hero1.png",
        "/images/banners/hero2.jpg",
        "/images/banners/hero3.jpg"
    ];

    return (
        <section className="relative min-h-screen md:min-h-screen flex items-center justify-center text-white overflow-hidden">
            {/* Background Images - All displayed simultaneously */}
            <div className="absolute inset-0 flex">
                {backgroundImages.map((image, index) => (
                    <div
                        key={index}
                        className="flex-1 relative"
                        style={{
                            backgroundImage: `url("${image}")`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    />
                ))}
            </div>

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>

            {/* Content */}
            <div className="relative z-10  text-center px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Main Heading - More mobile responsive */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                        "Picture-Perfect Moments,
                    </h1>

                    {/* Subheading - Better mobile scaling */}
                   
                    {/* Description - More compact on mobile */}
                    <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
                        Explore our diverse range of gift options tailored for every special moment.
                    </p>

                    {/* CTA Button - More mobile friendly */}
                    <Link to="/listing" className="btn-primary text-black sm:text-lg px-6  sm:py-3 mb-8 md:mb-16 inline-block">
                        Shop Now
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
