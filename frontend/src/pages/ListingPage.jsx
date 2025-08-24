import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { productAPI, cartAPI } from '../services/api';
import FilterModal from '../components/FilterModal';

const ListingPage = () => {
    const { categoryId } = useParams();
    
    const [searchParams] = useSearchParams();
    const [sortBy, setSortBy] = useState('best-match');
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(16); // Show 12 products per page
    const [filters, setFilters] = useState({
        priceRange: { min: 0, max: 50000 },
        categories: [],
        colors: [],
        sizes: [],
        discount: false,
        inStock: false,
    });

  


    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Check both query params (?category=slug) and URL params (/category/:categoryId)
                const categorySlug = searchParams.get('category') || categoryId;

                let products;
                if (categorySlug) {
                    products = await productAPI.getProductsByCategory(categorySlug);
                } else {
                    products = await productAPI.getProducts();
                }

                // Add wishlist status (defaulting to false for now)
                const listingProducts = products.map(product => ({
                    ...product,
                    isWishlisted: false
                }));

                setAllProducts(listingProducts);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchParams, categoryId]);

    // Reset to first page when products change
    useEffect(() => {
        setCurrentPage(1);
    }, [allProducts, filters, sortBy]);

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

    // Filter and sort products
    const getFilteredProducts = () => {
        let filtered = [...allProducts];

        // Filter by price range
        filtered = filtered.filter(
            (product) => product.price >= filters.priceRange.min && product.price <= filters.priceRange.max
        );

        // Filter by categories
        if (filters.categories.length > 0) {
            filtered = filtered.filter((product) =>
                product.category && filters.categories.includes(product.category)
            );
        }

        // Filter by colors - Skip for now as colors aren't stored separately in database

        // Filter by sizes
        if (filters.sizes.length > 0) {
            filtered = filtered.filter((product) =>
                product.sizes && product.sizes.some((size) => filters.sizes.includes(size))
            );
        }

        // Filter by discount
        if (filters.discount) {
            filtered = filtered.filter((product) => product.discount > 0);
        }

        // Filter by stock
        if (filters.inStock) {
            filtered = filtered.filter((product) => product.inStock);
        }

        // Sort products
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                filtered.sort((a, b) => b.id - a.id);
                break;
            case 'popularity':
                filtered.sort((a, b) => a.id - b.id);
                break;
            default:
                break;
        }

        return filtered;
    };

    const allFilteredProducts = getFilteredProducts();

    // Calculate pagination
    const totalProducts = allFilteredProducts.length;
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const products = allFilteredProducts.slice(startIndex, endIndex);

    // Pagination functions
    const goToPage = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    };

    // Get page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    // Get category name based on categoryId
    const getCategoryName = (id) => {
        switch (id) {
            case 'pashmina-shawls':
                return 'Pashmina Shawls';
            case 'pashmina-stoles':
                return 'Pashmina Stoles';
            case 'capes':
                return 'Capes';
            default:
                return 'Products';
        }
    };

  

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
    };

    const handleClearFilters = () => {
        setFilters({
            priceRange: { min: 0, max: 50000 },
            categories: [],
            colors: [],
            sizes: [],
            discount: false,
            inStock: false,
        });
    };

    return (
        <div className="bg-white px-10 mt-4">
            {/* Category Header - Mobile Responsive */}
            <div className="py-6">
                <div className='mt-6 mb-10 w-100 text-start'>
                        <h1 className="text-xl sm:text-2xl font-bold text-dark-900">
                            {getCategoryName(searchParams.get('category') || categoryId)}
                        </h1>
                    </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center         justify-between mb-10 sm:mb-6  gap-4 px-4 sm:px-0">
                    <div className="flex flex-col gap-4 ">
                          
                        
                        <div className="flex items-center gap-4">
                       
                          <button
                            onClick={() => setIsFilterOpen(true)}
                            className="flex items-center gap-1 sm:gap-2 bg-white border border-dark-900 rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-dark-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-400 whitespace-nowrap"
                        >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                            </svg>
                            <span className="hidden sm:inline">Filters</span>
                            {(filters.categories.length > 0 || filters.colors.length > 0 || filters.sizes.length > 0 || filters.discount || filters.inStock) && (
                                <span className="ml-0.5 sm:ml-1 bg-primary-400 text-white text-xs px-1.5 sm:px-2 py-0.5 rounded-full">
                                    {filters.categories.length + filters.colors.length + filters.sizes.length + (filters.discount ? 1 : 0) + (filters.inStock ? 1 : 0)}
                                </span>
                            )}
                        </button>
                            </div>
                        </div>

                    <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-initial">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-white border border-dark-900 rounded-md px-3 sm:px-4 py-2 pr-6 sm:pr-8 text-xs sm:text-sm font-medium text-dark-900 focus:outline-none focus:ring-2 focus:ring-primary-400 w-full sm:w-auto"
                            >
                                <option value="best-match">Sort By</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="newest">Newest First</option>
                                <option value="popularity">Most Popular</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-dark-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
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
               

                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-8 sm:mt-10 md:mt-12 gap-1 sm:gap-2 px-4 sm:px-0">
                        {/* Previous button */}
                        <button
                            className={`p-1.5 sm:p-2 rounded-md  hover:bg-gray-50 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                        >
                            Prev
                            {/* <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg> */}
                        </button>

                        {/* Page numbers */}
                        {getPageNumbers().map((page, index) => {
                            if (page === '...') {
                                return (
                                    <span key={`ellipsis-${index}`} className="px-1 sm:px-2 text-sm text-gray-500">
                                        ...
                                    </span>
                                );
                            }

                            const pageNum = page;
                            return (
                                <button
                                    key={pageNum}
                                    className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md font-medium text-sm transition-colors ${currentPage === pageNum
                                        ? 'bg-[#131F35] text-white'
                                        : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                    onClick={() => goToPage(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        {/* Next button */}
                        <button
                            className={`text-[#131F35] p-1.5 sm:p-2 rounded-md  hover:bg-gray-50 transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                        >
                            {/* <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg> */}
                            Next
                        </button>
                    </div>
                )}

                {/* Product count info */}
                <div className="text-center text-sm text-gray-500 mt-4">
                    Showing {products.length} of {totalProducts} products
                    {totalPages > 1 && (
                        <span> (Page {currentPage} of {totalPages})</span>
                    )}
                </div>

                {/* Filter Modal */}
                <FilterModal
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    filters={filters}
                    onApplyFilters={handleApplyFilters}
                    onClearFilters={handleClearFilters}
                />
            </div>
        </div>
    );
};

export default ListingPage;
