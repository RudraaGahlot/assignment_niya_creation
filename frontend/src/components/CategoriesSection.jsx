import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryAPI } from '../services/api';
import FeaturedProducts from './FeaturedProducts';
import Collection from './Collection';
import GiftSection from './GiftSection';

const CategoriesSection = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryAPI.getCategories();
                setCategories(data);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <section className="py-8 sm:py-12 md:py-16 bg-white">
            <div className="px-10">
                
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-black pb-10 mt-20">
                        "Thoughtfully Curated Gifts for Every Occasion"
                    </h2>

               

                {/* Categories Grid - Mobile optimized */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-4 sm:px-0">
                    {loading ? (
                        // Loading skeleton
                        [...Array(3)].map((_, index) => (
                            <div key={index} className="aspect-square bg-gray-200 rounded-xl sm:rounded-2xl animate-pulse"></div>
                        ))
                    ) : (
                        categories.map((category) => (
                            <Link
                                key={category.id}
                                to={`/listing?category=${category.slug}`}
                                className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gray-100 aspect-square cursor-pointer transition-transform duration-300 hover:scale-105 block"
                            >
                                {/* Category Image */}
                                <div className="absolute inset-0">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                </div>

                                
                                <div className="absolute inset-0 flex items-center justify-center text-white">
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-center px-4">
                                        {category.name}
                                    </h3>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                {/* Bottom Section - Corporate Gifting */}

                <div className="text-center pt-24">
                <div className="flex justify-center gap-2 mb-4">
                        <Link to="/listing" className="btn-secondary text-sm px-4 py-1">
                            Our Products
                        </Link>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-900 mb-4 px-4">
                        Explore Our New Collection
                    </h2>
                    
                </div>

               <Collection />
    
            </div>

            {/* Full-Width Corporate Gifting Section - Mobile Responsive */}
    <div className="relative mt-16 -mx-[calc((100vw-100%)/2)] mb-[-32px]">
        <div
          className="relative h-[720px] min-h-[480px] w-full bg-gray-200 object-cover "
          style={{
            backgroundImage: 'url("/images/banners/promotional-banner.png")',
            backgroundSize: "cover",
            backgroundPosition: "center 20%",
          }}
        >
          {/* Light overlay for legibility (so photo still shows through) */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Centered content */}
          <div className="absolute inset-0 grid place-items-center">
            <div className="px-6 text-center text-white opacity-85">
              <h1 className="mx-auto mb-8 max-w-5xl text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl lg:text-[56px] lg:leading-[1.15] tracking-tight">
                Gifts That Speak From the Heart
              </h1>

              <p className="mx-auto mb-8 max-w-3xl text-sm sm:text-base md:text-lg opacity-85">
                Curated collections for family, friends, and loved ones. Shop unique finds across
                categories to make any celebration unforgettable.
              </p>

              <Link
                to="/listing"
                className="inline-block rounded-md border border-white/90 px-14 py-3 text-base font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/80 opacity-85"
              >
                Explore More
              </Link>
            </div>
          </div>
           
        </div>
        <GiftSection/>  
                   

        
               
             
      </div>

      
                
           
                
        </section>
    );
};

export default CategoriesSection;






