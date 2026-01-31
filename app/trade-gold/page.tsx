import TradingViewWidget from "@/components/TradingViewWidget";

export default function TradeGoldPage() {
    return (
        <main className="h-screen w-full bg-background overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full w-full">
                {/* Left Side: TradingView Chart */}
                <div className="w-full h-full bg-card overflow-hidden">
                    <TradingViewWidget />
                </div>

                {/* Right Side: Thai Gold Price */}
                <div className="w-full h-full bg-white overflow-hidden relative">
                    <iframe
                        src="https://thaigold.info/GoldPrice/GoldPrice.html?theme=3"
                        title="Thai Gold Price"
                        className="w-full h-full border-none"
                    />
                </div>
            </div>
        </main>
    );
}
