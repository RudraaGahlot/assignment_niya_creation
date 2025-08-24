import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, cartAPI } from '../services/api';

const GiftSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const data = await productAPI.getProducts();
                
                const featuredProducts = data.filter((product) => product.isFeatured === 1);
                // Only show first 6 products
                setProducts(featuredProducts.slice(18, 22));
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    const handleAddToCart = async (productId) => {
        try {
            await cartAPI.addToCart(productId, undefined, 1);
            alert('Product added to cart!');
        } catch (error) {
            alert('Failed to add product to cart');
        }
    };

    const formatPrice = (price) => {
        return `₹${price.toLocaleString()}`;
    };

    return (
        <section className="py-8 sm:py-12 md:py-16 ">
            <div className="px-10 mb-14">
            <div className="text-center pt-24 px-20 mb-10">
                <div className="flex justify-center gap-2 mb-4">
                        <Link to="/listing" className="btn-secondary text-sm px-4 py-1">
                            Other Collection
                        </Link>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-900 mb-4 px-4">
                    Explore Our Corporate Gifting Hampers
                    </h2>
                    

                </div>

                {/* Products Grid - Mobile optimized */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 px-4 sm:px-0 [&>*:nth-child(4n+1)]:ml-0 [&>*:nth-child(4n+1)]:mr-2 [&>*:nth-child(4n+2)]:mx-1 [&>*:nth-child(4n+3)]:mx-1 [&>*:nth-child(4n)]:ml-2 [&>*:nth-child(4n)]:mr-0">
                    {loading ? (
                        // Loading skeleton
                        [...Array(4)].map((_, index) => (
                            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
                                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                                <div className="p-4">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-2/3"></div>
                                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                        ))
                    ) : (
                        products.map((product) => (
                            <div
                              key={product.id}
                              className="group bg-transparent rounded-2xl overflow-hidden"
                            >
                              {/* Image */}
                              <Link
                                to={`/product/${product.id}`}
                                className="relative block aspect-[3/4] rounded-2xl overflow-hidden"
                              >
                                <img
                                  src={product.images[0] || "/images/products/placeholder.png"}
                                  alt={product.name}
                                  className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                                />
                          
                                {/* Heart (no discount badge per screenshot) */}
                                <button
                                  type="button"
                                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md ring-1 ring-white/70"
                                  aria-label="Add to wishlist"
                                >
                                  <img
                                    src="/images/icons/heart-icon.svg"
                                    alt=""
                                    className="w-5 h-5"
                                  />
                                </button>
                              </Link>
                          
                              {/* Details */}
                              <div className="px-1 pt-3">
                                <Link to={`/product/${product.id}`}>
                                  <h3 className="text-left font-semibold text-[#1F2937] leading-snug text-[12px] sm:text-[16px] line-clamp-2">
                                    {product.name}
                                  </h3>
                                </Link>
                          
                                <div className="mt-2 text-left">
                                  <div className="flex items-baseline gap-2 flex-wrap">
                                    {product.originalPrice > product.price && (
                                      <span className="text-gray-400 line-through text-[18px]">
                                        {formatPrice(product.originalPrice)}
                                      </span>
                                    )}
                                    <span className="text-[#111827] font-semibold text-[20px]">
                                      {formatPrice(product.price)}
                                    </span>
                                    {product.discount > 0 && (
                                      <span className="text-[#16A34A] font-semibold text-[16px]">
                                        ( {product.discount} % Off )
                                      </span>
                                    )}
                                  </div>
                                </div>
                          
                                {/* Full-width CTA */}
                                <button
                                  onClick={() => handleAddToCart(product.id)}
                                  className="mt-4 w-full rounded-xl bg-[#101C34] py-2 text-center text-white text-[18px] font-semibold hover:opacity-95 transition"
                                >
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </section>
    );
};

export default GiftSection;
