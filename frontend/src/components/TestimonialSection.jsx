import React, { useState } from 'react';


const TestimonialSection = () => {
    const testimonials = [
        {
            id: 1,
            name: "Lorem Ipsum",
            role: "Retail Seller",
            avatar: "/images/banners/testimonial-avatar.png",
            rating: 5,
            review: "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, Cum sociis"
        },
        {
            id: 2,
            name: "John Smith",
            role: "Business Owner",
            avatar: "/images/banners/testimonial-avatar.png",
            rating: 5,
            review: "Outstanding quality and service! The team at Niya Celebration exceeded our expectations. Their attention to detail and customer service is remarkable. Highly recommend for corporate gifting needs."
        },
        {
            id: 3,
            name: "Sarah Johnson",
            role: "Event Planner",
            avatar: "/images/banners/testimonial-avatar.png",
            rating: 4,
            review: "Beautiful products with excellent craftsmanship. The pashmina shawls are of premium quality and our clients absolutely loved them. Will definitely order again for future events."
        }
    ];

    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span
                key={index}
                className={`text-lg ${index < rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
            >
                ★
            </span>
        ));
    };

    return (
        <section id="testimonials" className="py-16 bg-white">
            <div className="">
                
            <div className="text-center pt-24 px-20 mb-10">
                <div className="flex justify-center gap-2 mb-4">
                        <button to="/listing" className="btn-secondary text-sm px-4 py-1">
                            Testimonial
                        </button>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-900 mb-4 px-4">
                    What they say about us
                    </h2>
                    

                </div>

                {/* Testimonial Card */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-50 rounded-2xl p-8 md:p-12 shadow-sm">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-200">
                                    <img
                                        src={testimonials[currentTestimonial].avatar}
                                        alt={testimonials[currentTestimonial].name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 text-center md:text-left">
                                {/* Rating */}
                                <div className="flex justify-center md:justify-start mb-3">
                                    {renderStars(testimonials[currentTestimonial].rating)}
                                </div>

                                {/* Name and Role */}
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-dark-900 mb-1">
                                        {testimonials[currentTestimonial].name}
                                    </h3>
                                    <p className="text-gray-600">
                                        {testimonials[currentTestimonial].role}
                                    </p>
                                </div>

                                {/* Review Text */}
                                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                                    "{testimonials[currentTestimonial].review}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Dots */}
                    <div className="flex justify-center space-x-3 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentTestimonial(index)}
                                className={`w-3 h-3 rounded-full transition-colors duration-200 ${index === currentTestimonial
                                    ? 'bg-primary-400'
                                    : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <div className="flex justify-between items-center mt-8 max-w-sm mx-auto">
                        <button
                            onClick={() => setCurrentTestimonial((prev) =>
                                prev === 0 ? testimonials.length - 1 : prev - 1
                            )}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            aria-label="Previous testimonial"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <span className="text-sm text-gray-500">
                            {currentTestimonial + 1} of {testimonials.length}
                        </span>

                        <button
                            onClick={() => setCurrentTestimonial((prev) =>
                                prev === testimonials.length - 1 ? 0 : prev + 1
                            )}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            aria-label="Next testimonial"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialSection;
