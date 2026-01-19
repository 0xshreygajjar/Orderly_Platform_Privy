"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "wagmi";
import { arbitrumSepolia, arbitrum, mainnet } from "wagmi/chains";
import { ReactNode } from "react";

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
    chains: [arbitrumSepolia, arbitrum, mainnet],
    transports: {
        [arbitrumSepolia.id]: http(),
        [arbitrum.id]: http(),
        [mainnet.id]: http(),
    },
});

export const PrivyWalletConnector = ({ children }: { children: ReactNode }) => {
    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "insert-your-privy-app-id"}
            config={{
                loginMethods: ["email", "wallet"],
                appearance: {
                    theme: "light",
                    accentColor: "#676FFF",
                },
                embeddedWallets: {
                    createOnLogin: "users-without-wallets",
                },
                supportedChains: [arbitrumSepolia, arbitrum, mainnet],
            }}
        >
            <QueryClientProvider client={queryClient}>
                <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
            </QueryClientProvider>
        </PrivyProvider>
    );
};
