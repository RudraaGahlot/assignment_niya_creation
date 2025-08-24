import React, { useMemo, useState } from "react";

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const FilterModal = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onClearFilters,
}) => {
  const [tempFilters, setTempFilters] = useState(filters);

  // bounds shown in the screenshot
  const ABS_MIN = 200;
  const ABS_MAX = 25000;
  const STEP = 100;

  // dual-thumb slider values (kept ordered) - must be before early return
  const sliderValues = useMemo(() => {
    const min = clamp(tempFilters.priceRange.min, ABS_MIN, ABS_MAX);
    const max = clamp(tempFilters.priceRange.max, min, ABS_MAX);
    return { min, max };
  }, [tempFilters, ABS_MIN, ABS_MAX]);

  if (!isOpen) return null;

  // ---------- handlers ----------
  const setPrice = (field, value) => {
    // keep numbers clean and clamped
    const v = Number.parseInt(value || 0, 10);
    setTempFilters((prev) => {
      const next = { ...prev, priceRange: { ...prev.priceRange } };
      if (field === "min") {
        next.priceRange.min = clamp(v, ABS_MIN, Math.min(prev.priceRange.max, ABS_MAX));
      } else {
        next.priceRange.max = clamp(v, Math.max(prev.priceRange.min, ABS_MIN), ABS_MAX);
      }
      return next;
    });
  };

  const handleApply = () => onApplyFilters(tempFilters);

  const handleClear = () => {
    const cleared = {
      priceRange: { min: ABS_MIN, max: ABS_MAX },
      categories: [],
      colors: [],
      sizes: [],
      discount: false,
      inStock: false,
    };
    setTempFilters(cleared);
    onClearFilters?.();
  };

  // ---------- UI ----------
  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom sheet (mobile) / side panel (sm+) */}
      <div className="ixed inset-x-0 bottom-0 sm:left-0 sm:top-0 sm:left-auto h-[25vh] sm:h-[85vh] w-full sm:w-96 bg-white shadow-xl transform transition-transform rounded-t-3xl sm:rounded-none flex flex-col">
        {/* Header */}
        <div className="relative px-6 pt-5 pb-3">
          {/* grabber (mobile) */}
          <div className="sm:hidden absolute left-1/2 -translate-x-1/2 -top-1.5 w-12 h-1.5 rounded-full bg-gray-300" />
          <div className="flex items-center">
            <h2 className="text-[28px] leading-8 font-semibold text-[#121212]">
              Filters
            </h2>
            <button
              onClick={onClose}
              className="ml-auto p-2 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="#121212"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <hr className="mt-4 border-t border-gray-200" />
        </div>

        {/* Content */}
        <div className="px-6 pb-6 overflow-y-auto max-h-[70vh] sm:max-h-[calc(100vh-140px)]">
          {/* Collapsed rows like screenshot */}
          <button
            type="button"
            className="w-full flex items-center justify-between py-5"
          >
            <span className="text-[22px] leading-7 text-[#222]">Category</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 6l6 6-6 6"
                stroke="#222"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <hr className="mt-4 border-t border-gray-200" />

          <button
            type="button"
            className="w-full flex items-center justify-between py-5"
          >
            <span className="text-[22px] leading-7 text-[#222]">Product type</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 6l6 6-6 6"
                stroke="#222"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <hr className="mt-4 border-t border-gray-200" />
          {/* Price */}
          <div className="py-6 border-b border-gray-200">
            <h3 className="text-[28px] leading-8 font-semibold text-[#121212]">
              Price
            </h3>

            <div className="mt-5 grid grid-cols-2 gap-4">
              {/* Min amount */}
              <div>
                <label className="block text-[18px] text-[#4B4B4B] mb-2">
                  Min. Amount
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={sliderValues.min}
                  onChange={(e) => setPrice("min", e.target.value)}
                  className="w-full rounded-md bg-[#F2F2F2] border border-[#E6E6E6] px-4 py-3 text-[22px] text-[#121212] focus:outline-none"
                  placeholder="200"
                />
              </div>

              {/* Max amount */}
              <div>
                <label className="block text-[18px] text-[#4B4B4B] mb-2">
                  Max. Amount
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={sliderValues.max}
                  onChange={(e) => setPrice("max", e.target.value)}
                  className="w-full rounded-md bg-[#F2F2F2] border border-[#E6E6E6] px-4 py-3 text-[22px] text-[#121212] focus:outline-none"
                  placeholder="15,000"
                />
              </div>
            </div>

            {/* Dual-thumb slider */}
            <div className="mt-6">
              <div className="relative h-6">
                {/* track */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[3px] rounded-full bg-[#E8D5A2]" />

                {/* range highlight */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-[#D9B96D]"
                  style={{
                    left: `${((sliderValues.min - ABS_MIN) / (ABS_MAX - ABS_MIN)) * 100}%`,
                    right: `${100 - ((sliderValues.max - ABS_MIN) / (ABS_MAX - ABS_MIN)) * 100}%`,
                  }}
                />

                {/* min thumb */}
                <input
                  type="range"
                  min={ABS_MIN}
                  max={ABS_MAX}
                  step={STEP}
                  value={sliderValues.min}
                  onChange={(e) => {
                    const v = Math.min(
                      clamp(parseInt(e.target.value, 10), ABS_MIN, ABS_MAX),
                      sliderValues.max
                    );
                    setPrice("min", v);
                  }}
                  className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-auto"
                  style={{ zIndex: 30 }}
                />
                {/* max thumb */}
                <input
                  type="range"
                  min={ABS_MIN}
                  max={ABS_MAX}
                  step={STEP}
                  value={sliderValues.max}
                  onChange={(e) => {
                    const v = Math.max(
                      clamp(parseInt(e.target.value, 10), ABS_MIN, ABS_MAX),
                      sliderValues.min
                    );
                    setPrice("max", v);
                  }}
                  className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-auto"
                  style={{ zIndex: 20 }}
                />

                {/* thumbs styling */}
                <style>{`
                  input[type="range"]::-webkit-slider-runnable-track { height: 3px; background: transparent; }
                  input[type="range"]::-moz-range-track { height: 3px; background: transparent; }
                  input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none; appearance: none;
                    width: 18px; height: 18px; border-radius: 9999px;
                    background: #D9B96D; border: 3px solid #F4E6BF; margin-top: -7.5px;
                    box-shadow: 0 0 0 1px rgba(0,0,0,0.06);
                  }
                  input[type="range"]::-moz-range-thumb {
                    width: 18px; height: 18px; border-radius: 9999px;
                    background: #D9B96D; border: 3px solid #F4E6BF;
                    box-shadow: 0 0 0 1px rgba(0,0,0,0.06);
                  }
                `}</style>
              </div>

              <div className="mt-3 flex justify-between text-[16px] text-[#4B4B4B]">
                <span>₹{ABS_MIN.toLocaleString("en-IN")}</span>
                <span>₹{ABS_MAX.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Apply */}
            <button
              onClick={handleApply}
              className="mt-6 w-full rounded-md bg-[#101C34] text-white text-[22px] font-semibold py-4"
            >
              Apply
            </button>
          </div>

          {/* Colour collapsed row */}
          <button
            type="button"
            className="w-full flex items-center justify-between py-5"
          >
            <span className="text-[22px] leading-7 text-[#222]">Colour</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 6l6 6-6 6"
                stroke="#222"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Footer (only Clear All per your original API; hidden in screenshot but kept for parity) */}
        <div className="hidden px-6 pb-6">
          <button
            onClick={handleClear}
            className="w-full rounded-md bg-gray-100 text-gray-700 font-semibold py-3 hover:bg-gray-200"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
