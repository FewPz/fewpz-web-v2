import TradingViewWidget from "@/components/TradingViewWidget";
import ThaiGoldWidget from "@/components/ThaiGoldWidget";

export default function TradeGoldPage() {
    return (
        <main className="h-screen w-full bg-background overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] h-full w-full">
                {/* Left Side: TradingView Chart */}
                <div className="w-full h-full bg-card overflow-hidden">
                    <TradingViewWidget />
                </div>

                {/* Right Side: Thai Gold Price */}
                <div className="w-full h-full">
                    <ThaiGoldWidget />
                </div>
            </div>
        </main>
    );
}
