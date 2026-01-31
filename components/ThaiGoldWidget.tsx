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
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#B22222] to-[#8B0000] text-white">
                <div className="animate-pulse text-4xl">กำลังโหลดราคาทอง...</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-[#8B0000] text-red-300 text-3xl">
                ไม่สามารถโหลดข้อมูลได้
            </div>
        );
    }

    const buyChange = parseInt(data.buyChange || "0", 10);
    const isUp = buyChange > 0;
    const isDown = buyChange < 0;

    return (
        <div className="w-full h-full bg-gradient-to-b from-[#C41E3A] to-[#8B0000] text-white font-bai-jamjuree flex flex-col overflow-hidden">
            {/* Main Content - Optimized for TV */}
            <div className="flex-1 grid grid-cols-[180px_1fr] xl:grid-cols-[220px_1fr] 2xl:grid-cols-[280px_1fr] p-4 xl:p-8 2xl:p-12 gap-4 xl:gap-8">
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
                    <div className="flex flex-col items-center bg-white/10 rounded-2xl p-3 xl:p-5 2xl:p-6">
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
                            <span className="text-2xl xl:text-4xl 2xl:text-5xl text-white/70">ซื้อ/buy</span>
                            <span className="text-6xl xl:text-8xl 2xl:text-[10rem] font-black text-[#FFD700] tracking-tighter drop-shadow-xl">
                                {formatNumber(data.buy)}
                            </span>
                        </div>

                        {/* Sell Price */}
                        <div className="flex items-baseline gap-3 xl:gap-5">
                            <span className="text-2xl xl:text-4xl 2xl:text-5xl text-white/70">ขาย/sale</span>
                            <span className="text-6xl xl:text-8xl 2xl:text-[10rem] font-black text-[#FFD700] tracking-tighter drop-shadow-xl">
                                {formatNumber(data.sell)}
                            </span>
                        </div>
                    </div>

                    {/* Today Change Summary */}
                    <div className="text-right mt-4">
                        <span className="text-2xl xl:text-4xl 2xl:text-5xl text-white/70">วันนี้ </span>
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
                <div className="bg-white/90 text-black overflow-hidden border-y-2 border-yellow-500">
                    <div className="animate-marquee whitespace-nowrap py-3 xl:py-4 2xl:py-5 text-xl xl:text-3xl 2xl:text-4xl font-semibold">
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
