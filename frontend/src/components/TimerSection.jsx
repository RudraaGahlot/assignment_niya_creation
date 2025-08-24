import React, { useEffect, useState } from "react";

const TimerSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 6,
    hours: 6,
    minutes: 6,
    seconds: 6,
  });

  // target = 7 days from now (demo)
  useEffect(() => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const tick = () => {
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const z = (n) => String(n).padStart(2, "0");

  return (
    <section className="w-full">
      {/* Two-column hero */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left image */}
        <div className="h-[420px] md:h-[520px] overflow-hidden">
          <img
            src="images/banners/timer-background.png" // replace with your image
            alt=""
            className="w-full h-[120%] object-cover object-top -mt-[15%]"
          />
        </div>

        {/* Right content */}
        <div className="bg-[#F8F4E8] h-[420px] md:h-[520px] flex items-center">
          <div className="max-w-2xl mx-auto px-6 md:px-8">
            <h2 className="text-3xl md:text-4xl font-semibold leading-tight text-[#121212]">
              Enjoy A 50% Discount On Our<br />Latest Collection
            </h2>

            {/* Timer */}
            <div className="mt-8 flex items-end gap-5 md:gap-8">
              {/* days */}
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-semibold">{z(timeLeft.days)}</div>
                <div className="mt-2 text-lg md:text-xl text-[#2A2A2A]">Days</div>
              </div>
              <div className="text-4xl md:text-6xl font-semibold -mb-2">:</div>

              {/* hours */}
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-semibold">{z(timeLeft.hours)}</div>
                <div className="mt-2 text-lg md:text-xl text-[#2A2A2A]">Hours</div>
              </div>
              <div className="text-4xl md:text-6xl font-semibold -mb-2">:</div>

              {/* minutes */}
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-semibold">{z(timeLeft.minutes)}</div>
                <div className="mt-2 text-lg md:text-xl text-[#2A2A2A]">Minutes</div>
              </div>
              <div className="text-4xl md:text-6xl font-semibold -mb-2">:</div>

              {/* seconds (navy color) */}
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-semibold text-[#0F1C2D]">
                  {z(timeLeft.seconds)}
                </div>
                <div className="mt-2 text-lg md:text-xl text-[#2A2A2A]">Seconds</div>
              </div>
            </div>

            {/* CTA */}
            <button className="mt-8 inline-flex items-center rounded-full bg-[#0F1C2D] text-white px-6 md:px-8 py-3 text-base md:text-lg font-semibold">
              Explore Products
            </button>
          </div>
        </div>
      </div>

      {/* Bottom ticker (marquee) */}
      <div className="relative bg-[#0F1C2D] text-white py-4 overflow-hidden">
        <div
          className="whitespace-nowrap flex items-center gap-8 will-change-transform"
          style={{ animation: "marquee 18s linear infinite" }}
        >
          {/* duplicate content for seamless loop */}
          {Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-8">
              {Array.from({ length: 8 }).map((__, i) => (
                <div key={`${idx}-${i}`} className="flex items-center gap-8">
                  <span className="text-lg md:text-xl font-medium">Shop Now</span>
                  <span className="text-2xl">•</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* marquee keyframes */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default TimerSection;
