import React from 'react';
import HeroSection from '../components/HeroSection';
import CategoriesSection from '../components/CategoriesSection';
import FeaturedProducts from '../components/FeaturedProducts';
import TimerSection from '../components/TimerSection';
import TestimonialSection from '../components/TestimonialSection';




const HomePage = () => {
    return (
        <div>
            <HeroSection />
            <CategoriesSection />
            <TimerSection /> 
            <FeaturedProducts />
            <TestimonialSection />
            
        </div>
    );
};

export default HomePage;
