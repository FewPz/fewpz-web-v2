"use client";

import { useEffect, useState } from "react";
import { MoveDown, MoveUp, Minus, Volume2 } from "lucide-react";
import Image from "next/image";

interface GoldData {
    buy: string | null;
    buyChange: string | null;
    sell: string | null;
    usd: string | null;
    usdChange: string | null;
    spotGold: string | null;
    spotGoldChange: string | null;
    marketStatus: string | null;
    updateTime: string | null;
}

// Detect if running on webOS TV or legacy browser
function detectWebOS(): boolean {
    if (typeof navigator === "undefined") return false;
    const userAgent = navigator.userAgent || "";
    return /webos|hbbtv|smarttv|googletv|appletv|netcast|tizen|vidaa|viera|bravia/i.test(userAgent);
}

// Detect legacy browser that may not support modern CSS
function detectLegacyBrowser(): boolean {
    if (typeof navigator === "undefined") return false;
    const userAgent = navigator.userAgent || "";
    // Detect old browsers: Opera Mini, old Android, old Samsung, TV browsers, etc.
    return /opera mini|msie|trident|edge\/\d|samsung|webos|hbbtv|smarttv|googletv|appletv|netcast|tizen|vidaa|viera|bravia|presto/i.test(userAgent);
}

// Format number with commas
function formatNumber(num: string | null): string {
    if (!num) return "-";
    const n = parseInt(num, 10);
    if (isNaN(n)) return num;
    return n.toLocaleString("en-US");
}

export default function ThaiGoldWidget() {
    const [data, setData] = useState<GoldData | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState<string>("");
    const [isWebOS, setIsWebOS] = useState(false);
    const [isLegacy, setIsLegacy] = useState(false);

    // Initialize webOS TV environment and legacy browser detection
    useEffect(() => {
        const isWebOSTV = detectWebOS();
        const isLegacyBrowser = detectLegacyBrowser();
        setIsWebOS(isWebOSTV);
        setIsLegacy(isLegacyBrowser || isWebOSTV);

        if (isWebOSTV) {
            // Initialize webOS TV
            if (typeof window !== "undefined" && (window as any).webOS) {
                const webOS = (window as any).webOS;
                // Request fullscreen on webOS TV
                if (webOS.platformBack) {
                    webOS.platformBack = function () {
                        console.log("Back pressed on webOS TV");
                    };
                }
            }

            // Request fullscreen for TV display
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(() => {
                    console.log("Fullscreen request failed or denied");
                });
            }

            // Disable screensaver
            if (typeof window !== "undefined") {
                document.addEventListener("keydown", (e) => {
                    // Prevent default power button behavior on TV
                    if (e.key === "Power" || e.keyCode === 179) {
                        e.preventDefault();
                    }
                });
            }
        }
    }, []);

    // Real-time clock
    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const day = String(now.getDate()).padStart(2, "0");
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const year = now.getFullYear() + 543; // Thai Buddhist year
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            const seconds = String(now.getSeconds()).padStart(2, "0");
            setCurrentTime(`${day}/${month}/${year} ${hours}:${minutes}:${seconds}`);
        };

        updateClock();
        const clockInterval = setInterval(updateClock, 1000);
        return () => clearInterval(clockInterval);
    }, []);

    // Fetch gold data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/gold-price");
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (error) {
                console.error("Failed to fetch gold price", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000); // Fetch every 60 seconds for real-time updates
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div
                className="w-full h-full flex items-center justify-center text-white"
                style={{
                    background: isLegacy ? '#8B0000' : 'linear-gradient(to bottom, #B22222, #8B0000)',
                    backgroundColor: '#8B0000'
                }}
            >
                <div style={{ fontSize: isLegacy ? '32px' : undefined }} className={isLegacy ? '' : 'animate-pulse text-4xl'}>กำลังโหลดราคาทอง...</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div
                className="w-full h-full flex items-center justify-center text-3xl"
                style={{ backgroundColor: '#8B0000', color: '#FCA5A5' }}
            >
                ไม่สามารถโหลดข้อมูลได้
            </div>
        );
    }

    const buyChange = parseInt(data.buyChange || "0", 10);
    const isUp = buyChange > 0;
    const isDown = buyChange < 0;

    // Use legacy-safe styles
    const containerStyle: React.CSSProperties = {
        background: isLegacy ? '#8B0000' : 'linear-gradient(to bottom, #C41E3A, #8B0000)',
        backgroundColor: '#8B0000', // Fallback for browsers that don't support gradients
        ...(isWebOS || isLegacy ? { margin: 0, padding: 0, height: '100vh', minHeight: '100vh' } : {})
    };

    return (
        <div
            className={`w-full h-full text-white flex flex-col overflow-hidden ${isWebOS ? "webos-tv" : ""}`}
            style={containerStyle}
        >
            {/* Main Content - Optimized for TV */}
            <div className={`flex-1 grid gap-4 xl:gap-8 p-4 xl:p-8 2xl:p-12 ${isWebOS ? "grid-cols-[200px_1fr] 2xl:grid-cols-[300px_1fr]" : "grid-cols-[180px_1fr] xl:grid-cols-[220px_1fr] 2xl:grid-cols-[280px_1fr]"}`}>
                {/* Left Column: Logo + Arrow */}
                <div className="flex flex-col items-center gap-4 xl:gap-6">
                    {/* Logo */}
                    <Image
                        src="/logos/trade-gold-1.png"
                        alt="Trade Gold Logo"
                        width={180}
                        height={180}
                        className="rounded-xl"
                    />

                    {/* Arrow + Change Value */}
                    <div className="flex flex-col items-center rounded-2xl p-3 xl:p-5 2xl:p-6" style={isWebOS ? { backgroundColor: "rgba(255,255,255,0.15)" } : { backgroundColor: "rgba(255,255,255,0.1)" }}>
                        {isDown && (
                            <MoveDown className="w-14 h-14 xl:w-20 xl:h-20 2xl:w-28 2xl:h-28 text-white drop-shadow-lg" strokeWidth={3} />
                        )}
                        {isUp && (
                            <MoveUp className="w-14 h-14 xl:w-20 xl:h-20 2xl:w-28 2xl:h-28 text-green-400 drop-shadow-lg" strokeWidth={3} />
                        )}
                        {!isUp && !isDown && (
                            <Minus className="w-14 h-14 xl:w-20 xl:h-20 2xl:w-28 2xl:h-28 text-gray-300 drop-shadow-lg" strokeWidth={3} />
                        )}
                        <span
                            className={`text-4xl xl:text-6xl 2xl:text-7xl font-black tracking-tight ${isUp ? "text-green-400" : isDown ? "text-white" : "text-gray-300"
                                }`}
                        >
                            {buyChange > 0 ? `+${formatNumber(String(buyChange))}` : formatNumber(String(buyChange))}
                        </span>
                    </div>
                </div>

                {/* Right Column: Title + Prices */}
                <div className="flex flex-col justify-between min-w-0">
                    {/* Title */}
                    <h1 className="text-4xl xl:text-6xl 2xl:text-8xl font-black text-[#FFD700] drop-shadow-lg text-right tracking-wide">
                        ราคาทองคำวันนี้
                    </h1>

                    {/* Prices */}
                    <div className="flex flex-col items-end gap-2 xl:gap-4">
                        {/* Buy Price */}
                        <div className="flex items-baseline gap-3 xl:gap-5">
                            <span className="text-2xl xl:text-4xl 2xl:text-5xl" style={isWebOS ? { color: "rgba(255,255,255,0.9)" } : undefined}>ซื้อ/buy</span>
                            <span className="text-6xl xl:text-8xl 2xl:text-[10rem] font-black text-[#FFD700] tracking-tighter drop-shadow-xl">
                                {formatNumber(data.buy)}
                            </span>
                        </div>

                        {/* Sell Price */}
                        <div className="flex items-baseline gap-3 xl:gap-5">
                            <span className="text-2xl xl:text-4xl 2xl:text-5xl" style={isWebOS ? { color: "rgba(255,255,255,0.9)" } : undefined}>ขาย/sale</span>
                            <span className="text-6xl xl:text-8xl 2xl:text-[10rem] font-black text-[#FFD700] tracking-tighter drop-shadow-xl">
                                {formatNumber(data.sell)}
                            </span>
                        </div>
                    </div>

                    {/* Today Change Summary */}
                    <div className="text-right mt-4">
                        <span className="text-2xl xl:text-4xl 2xl:text-5xl" style={isWebOS ? { color: "rgba(255,255,255,0.9)" } : undefined}>วันนี้ </span>
                        <span
                            className={`text-3xl xl:text-5xl 2xl:text-6xl font-bold ${isUp ? "text-green-400" : isDown ? "text-red-400" : "text-gray-300"
                                }`}
                        >
                            {buyChange > 0 ? `+${formatNumber(String(buyChange))}` : formatNumber(String(buyChange))}
                        </span>
                    </div>
                </div>
            </div>

            {/* SMS Announcement Marquee */}
            {data.marketStatus && (
                <div className="text-black overflow-hidden border-y-2 border-yellow-500" style={isWebOS ? { backgroundColor: "#F5F5F5" } : { backgroundColor: "rgba(255,255,255,0.9)" }}>
                    <div className={`whitespace-nowrap py-3 xl:py-4 2xl:py-5 text-xl xl:text-3xl 2xl:text-4xl font-semibold ${!isWebOS ? "animate-marquee" : ""}`} style={isWebOS ? { animation: "marquee-slow 30s linear infinite" } : undefined}>
                        {data.marketStatus}
                    </div>
                </div>
            )}

            {/* Bottom Stats Section */}
            <div className="bg-white text-black">
                {/* SpotGold and USD/THB Row */}
                <div className="grid grid-cols-2">
                    <div className="p-3 xl:p-5 border-r border-gray-300">
                        <div className="text-lg xl:text-2xl 2xl:text-3xl font-bold text-red-600">SpotGold</div>
                        <div className="text-xl xl:text-3xl 2xl:text-4xl font-mono font-bold flex items-center gap-2">
                            <span className="text-red-600">{formatNumber(data.spotGold)}</span>
                            <span className={`text-base xl:text-xl 2xl:text-2xl ${parseFloat(data.spotGoldChange || "0") < 0 ? "text-red-500" : "text-green-600"}`}>
                                {data.spotGoldChange}
                            </span>
                        </div>
                    </div>
                    <div className="p-3 xl:p-5">
                        <div className="text-lg xl:text-2xl 2xl:text-3xl font-bold text-red-600">USD/THB</div>
                        <div className="text-xl xl:text-3xl 2xl:text-4xl font-mono font-bold flex items-center gap-2">
                            <span>{data.usd}</span>
                            <span className={`text-base xl:text-xl 2xl:text-2xl ${parseFloat(data.usdChange || "0") < 0 ? "text-red-500" : "text-green-600"}`}>
                                {data.usdChange}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer: Real-time Clock + Credit */}
                <div className="flex items-center justify-between p-3 xl:p-5 bg-gray-100 border-t border-gray-300">
                    <div className="flex items-center gap-3 text-gray-700">
                        <Volume2 className="w-6 h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-gray-500" />
                        <span className="font-mono text-lg xl:text-2xl 2xl:text-3xl font-semibold">{currentTime}</span>
                    </div>
                    <div className="text-lg xl:text-2xl 2xl:text-3xl font-bold italic">
                        by <span className="text-yellow-600">Thai</span><span className="text-red-600">GOLD</span>.info
                    </div>
                </div>
            </div>
        </div>
    );
}
