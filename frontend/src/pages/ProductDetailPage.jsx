import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { productAPI, cartAPI } from "../services/api";


const ProductDetailPage = () => {
  const [products, setProducts] = useState([]);
  const { productId } = useParams();

  // data
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ui state
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartData, setCartData] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
        try {
            const data = await productAPI.getProducts();
            
            const featuredProducts = data.filter((product) => product.isFeatured === 1);
            // Only show first 6 products
            setProducts(featuredProducts.slice(0, 4));
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    fetchFeaturedProducts();
}, []);

  // fetch product + related
  useEffect(() => {
    const run = async () => {
      if (!productId) return;
      try {
        setLoading(true);
        setError(null);

        const p = await productAPI.getProduct(Number(productId));
        setProduct(p);
        setSelectedImage(p?.images?.[0] || "");

        const all = await productAPI.getProducts();
        const rel = all.filter((x) => x.id !== Number(productId)).slice(0, 4);
        setRelatedProducts(rel);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [productId]);

  // fetch cart (non-blocking)
  useEffect(() => {
    (async () => {
      try {
        const cart = await cartAPI.getCart();
        setCartData(cart);
      } catch {}
    })();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="text-lg">Loading product…</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="text-lg text-red-600">{error || "Product not found"}</div>
      </div>
    );
  }

  const toggleSection = (key) =>
    setExpandedSection((cur) => (cur === key ? null : key));

  const addToCart = async () => {
    if (!selectedSize) {
      alert("Please select a size first");
      return;
    }
    try {
      await cartAPI.addToCart(product.id, selectedSize, 1);
      const updated = await cartAPI.getCart();
      setCartData(updated);
      setIsCartOpen(true);
    } catch {
      alert("Failed to add item to cart");
    }
  };

  const updateQuantity = async (itemId, q) => {
    try {
      if (q < 1) await cartAPI.removeCartItem(itemId);
      else await cartAPI.updateCartItem(itemId, q);
      const updated = await cartAPI.getCart();
      setCartData(updated);
    } catch {
      alert("Failed to update cart item");
    }
  };

  const addRelatedProductToCart = async (id) => {
    try {
      await cartAPI.addToCart(id, undefined, 1);
      const updated = await cartAPI.getCart();
      setCartData(updated);
      setIsCartOpen(true);
    } catch {
      alert("Failed to add item to cart");
    }
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString()}`;
  };

  const handleAddToCart = async (productId) => {
    try {
      await cartAPI.addToCart(productId, undefined, 1);
      const updated = await cartAPI.getCart();
      setCartData(updated);
      setIsCartOpen(true);
    } catch (error) {
      alert('Failed to add product to cart');
    }
  };

  const renderStars = (rating) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`h-4 w-4 ${
            s <= Math.round(rating) ? "text-amber-500" : "text-gray-300"
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  const price = product.price;
  const mrp = product.originalPrice;
  const discount = product.discount;

  return (
    <div className="">
      <div className="px-10 mt-16">
        {/* ===== top: two-column ===== */}
        <div className="mb-12 grid grid-cols-1 gap-8 lg:mb-16 lg:grid-cols-2">
          {/* left: gallery */}
          <div>
            {/* main image */}
            <div className="mb-4 overflow-hidden rounded-xl bg-gray-100">
              <img
                src={selectedImage}
                alt={product.name}
                className="h-full w-full object-cover"
                style={{ aspectRatio: "4/5" }}
              />
            </div>
            {/* thumbs */}
            <div className="grid grid-cols-4 gap-3">
              {(product.images || []).slice(0, 4).map((img, i) => {
                const active = selectedImage === img;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`overflow-hidden rounded-lg border ${
                      active ? "border-[#FF7500]" : "border-transparent"
                    }`}
                    style={{ aspectRatio: "1/1" }}
                    aria-label={`Image ${i + 1}`}
                  >
                    <img
                      src={img}
                      alt={`Thumb ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* right: info */}
          <div>
            {/* title */}
            <h1 className="mb-3 text-2xl font-bold text-[#121212] sm:text-3xl lg:text-[28px] leading-snug text-left">
              {product.name}
            </h1>

            {/* price + ratings line */}
            <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-lg text-[#8C8C8C] line-through">
                ₹ {mrp.toLocaleString()}
              </span>
              <span className="text-[22px] font-semibold text-[#121212]">
                ₹ {price.toLocaleString()}
              </span>
              <span className="text-sm font-semibold text-[#33A22B]">
                ({discount}% off)
              </span>
              <span className="text-xs text-[#8C8C8C]">Inc. of all taxes</span>
            </div>

            {/* rating */}
            <div className="mb-4 flex items-center gap-2">
              {renderStars(product.rating)}
              <span className="text-xs text-[#6B6B6B]">
                ({product.reviews} ratings)
              </span>
            </div>

            {/* shipping badges */}
            <div className="mb-6 space-y-1 text-left">
              <p className="text-sm text-[#6B6B6B] font-medium">
                Express Shipping Available
              </p>
              <p className="text-sm text-[#6B6B6B] font-medium">
                In stock , ready to ship
              </p>
            </div>

            <div className="mb-6 border-t border-[#D9D9D9]" />

            {/* size & guide */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-xl font-bold text-[#121212]">Select Size</h3>
              <div className="flex items-center gap-6">
                <button className="text-sm font-semibold text-[#FF7500] inline-flex items-center gap-1">
                  ADD ADDITIONAL INFORMATION
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="inline-block"
                  >
                    <path
                      d="M12 5V19M5 12H19"
                      stroke="#FF7500"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <button className="text-sm font-semibold text-[#2B2B2B] underline underline-offset-4">
                  Size Guide
                </button>
              </div>
            </div>

            {/* size chips */}
            <div className="mb-6 flex flex-wrap gap-3">
              {product.sizes.map((s) => {
                const active = selectedSize === s;
                return (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`h-12 w-12 rounded-full border text-center text-base font-medium transition ${
                      active
                        ? "border-[#131F35] bg-[#131F35] text-white"
                        : "border-[#CBCBCB] bg-white text-[#222]"
                    }`}
                    aria-pressed={active}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            {/* wishlist + add to bag */}
            <div className="mb-6 flex gap-3">
              <button
                className="flex-1 rounded-lg border border-[#D8D8D8] bg-white px-5 py-3 text-sm font-semibold text-[#131F35] hover:bg-[#F4F4F4]"
                type="button"
              >
                Add to Wishlist
              </button>
              <button
                onClick={addToCart}
                className="flex-1 rounded-lg bg-[#131F35] px-5 py-3 text-sm font-bold text-white hover:opacity-95"
                type="button"
              >
                Add to Bag
              </button>
            </div>

            <div className="mb-6 border-t border-[#D9D9D9]" />

            {/* accordions */}
            <div className="divide-y divide-[#7E7E7E]/50">
              {[
                ["description", "Description", product.description],
                [
                  "returns",
                  "Return & Refund Policy",
                  product.returnPolicy ||
                    "30-day easy returns and exchanges. Free return shipping.",
                ],
                [
                  "care",
                  "Care 7 Cleaning",
                  product.care ||
                    "Dry clean only. Store in a cool, dry place. Avoid direct sunlight.",
                ],
                ["reviews", "Reviews", "Customer reviews will be displayed here."],
              ].map(([key, label, body]) => (
                <div key={key} className="py-4">
                  <button
                    className="flex w-full items-center justify-between"
                    onClick={() => toggleSection(key)}
                  >
                    <span className="text-[18px] font-bold text-[#000]">
                      {label}
                    </span>
                    <svg
                      className={`h-5 w-5 transform transition-transform ${
                        expandedSection === key ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#252525"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {expandedSection === key && (
                    <div className="mt-3 text-[15px] leading-relaxed text-[#000]">
                      {body}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== you may also like ===== */}
        <section className="rounded-lg mt-20 ">
          <h2
            className="mb-8 text-center"
            style={{
              color: "#252525",
              fontWeight: 700,
              fontSize: "40px",
            }}
          >
            You May Also Like
          </h2>
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
        </section>

        {/* ===== wide promo banner ===== */}
        <div className="relative mt-16 -mx-[calc((100vw-100%)/2)] mb-[-32px]">
        <div
          className="relative h-[720px] min-h-[480px] w-screen bg-gray-200"
          style={{
            backgroundImage: 'url("/images/banners/promotioanl-banner-2.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
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
      </div>

      </div>

      {/* ===== cart drawer ===== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-white shadow-xl">
            <div className="border-b border-black p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[24px] font-bold text-[#252525]">Cart</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 transition-opacity hover:opacity-70"
                  aria-label="Close cart"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#252525"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 p-6">
              {!cartData || cartData.items.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-[16px] font-semibold text-[#252525]">
                    Your cart is empty
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cartData.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 text-[24px] font-semibold leading-tight text-[#252525]">
                          {item.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div
                            className="flex items-center overflow-hidden rounded-lg"
                            style={{ backgroundColor: "#131F35" }}
                          >
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="px-3 py-1 text-white hover:opacity-80"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="px-3 py-1 text-white hover:opacity-80"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <span className="text-[20px] font-medium text-[#252525]">
                            ₹ {item.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartData && cartData.items.length > 0 && (
              <div className="border-t border-gray-300 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-[20px] font-semibold text-[#252525]">
                    Subtotal
                  </span>
                  <span className="text-[20px] font-medium text-[#252525]">
                    ₹ {cartData.subtotal.toLocaleString()}
                  </span>
                </div>
                <button
                  className="w-full rounded-lg bg-[#2D2D4B] py-4 text-xl font-bold text-white transition hover:opacity-95"
                  onClick={() => {
                    alert("Proceeding to payment...");
                    setIsCartOpen(false);
                  }}
                >
                  Proceed to Pay
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
