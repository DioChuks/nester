"use client";

import { useWallet } from "@/components/wallet-provider";
import { Navbar } from "@/components/navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { truncateAddress } from "@/lib/utils";
import { 
    mockPortfolioStats, 
    mockVaultPositions, 
    mockTransactions 
} from "@/lib/mock-data";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { PortfolioCharts } from "@/components/dashboard/portfolio-charts";
import { VaultPositionsTable } from "@/components/dashboard/vault-positions-table";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { useSettings } from "@/context/settings-context";

export default function Dashboard() {
    const { isConnected, address } = useWallet();
    const { currency } = useSettings();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isConnected) {
            router.push("/");
        } else {
            const timer = setTimeout(() => setIsLoading(false), 800);
            return () => clearTimeout(timer);
        }
    }, [isConnected, router]);

    if (!isConnected) return null;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="mx-auto max-w-[1536px] px-4 md:px-8 lg:px-12 xl:px-16 pt-20 md:pt-28 pb-24 md:pb-16">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 md:mb-10"
                >
                    <h1 className="font-heading text-xl font-light text-foreground sm:text-2xl md:text-3xl">
                        Welcome back
                    </h1>
                    <p className="mt-1 text-muted-foreground font-mono text-xs sm:text-sm">
                        {address ? truncateAddress(address, 8) : ""}
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <DashboardStats stats={mockPortfolioStats} loading={isLoading} />

                {/* Main Content Grid */}
                <div className="grid gap-6">
                    {/* Charts Row */}
                    <PortfolioCharts positions={mockVaultPositions} />

                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Vaults Table */}
                        <VaultPositionsTable positions={mockVaultPositions} />

                        {/* Activity List */}
                        <RecentActivity transactions={mockTransactions} />
                    </div>
                </div>
            </main>
        </div>
    );
}