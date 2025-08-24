import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-dark-900 text-primary-400 relative z-50">
            <div className=" py-4 w-full">
                <div className="flex items-center justify-between pl-8">
                    {/* Left - Navigation */}

                    <nav className={`hidden lg:flex items-center gap-8 pl-6 text-primary-400`}>
          <Link to="/" className={`font-medium text-primary-400 hover:text-white`}>Home</Link>

          <Link to="/listing" className={`font-medium inline-flex items-center gap-2 text-primary-400 hover:text-white`}>
            <span>Shop</span>
            {/* caret */}
            <svg width="12" height="12" viewBox="0 0 24 24" className="stroke-current" fill="none">
              <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          <Link to="/listing" className={`font-medium text-primary-400 hover:text-white`}>Best Collection</Link>
          <Link to="/contact" className={`font-medium text-primary-400 hover:text-white`}>Contact Us</Link>
        </nav>


                    {/* Mobile Menu Button - Left side on mobile */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 hover:bg-gray-800 rounded-full transition-colors"
                        aria-label="Toggle menu"
                    >
                        <img
                            src="/images/icons/hamburger-icon.svg"
                            alt="Menu"
                            className="w-5 h-5"
                        />
                    </button>

                    {/* Center - Logo */}
                 <div className="pointer-events-auto absolute left-1/2 -translate-x-1/2 md:-bottom-10 -bottom-5">
                     <Link to="/">
                     <img
                          src="/images/ui/logo-niya-celebration.png"
                          alt="Niya Celebration"
                         className="h-14 lg:h-24 select-none"
                      />
                     </Link>
                     </div>

                    {/* Right - Icons */}
                    <div className="flex items-center space-x-4 flex-shrink-0 pr-8 ">
                        {/* User Icon */}
                        <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                            <img
                                src="/images/icons/user-icon.svg"
                                alt="User Account"
                                className="w-5 h-5"
                            />
                        </button>

                        {/* Favorites Icon */}
                        <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                            <img
                                src="/images/icons/heart-icon.svg"
                                alt="Favorites"
                                className="w-5 h-5"
                            />
                        </button>

                        {/* Cart Icon */}
                        <Link to="/" className={`flex items-center gap-2 `} aria-label="Cart">
            <svg width="20" height="22" viewBox="0 0 24 24" className="stroke-current" fill="none">
              <circle cx="9" cy="20" r="1.6" />
              <circle cx="17" cy="20" r="1.6"  />
              <path d="M3 4h2l2.3 11.2a2 2 0 002 1.6h7.7a2 2 0 002-1.6L21 8H7.1"  strokeLinecap="round" />
            </svg>
            <span className="">{`Cart(${String(0).padStart(1, "0")})`}</span>
          </Link>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 right-0 bg-dark-900 border-t border-gray-700 z-40">
                        <nav className="container-custom py-4">
                            <ul className="space-y-4">
                                <li>
                                    <Link
                                        to="/"
                                        className="block text-primary-400 hover:text-white transition-colors py-2 font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Home
                                    </Link>
                                </li>
                            
                                <li>
                                    <Link
                                        to="/listing"
                                        className="block text-primary-400 hover:text-white transition-colors py-2 font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Shop Now
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/"
                                        className="block text-primary-400 hover:text-white transition-colors py-2 font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Best Collection
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/"
                                        className="block text-primary-400 hover:text-white transition-colors py-2 font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
