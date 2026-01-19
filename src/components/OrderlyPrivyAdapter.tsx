"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useAccount } from "@orderly.network/hooks";
import { useEffect } from "react";

export const OrderlyPrivyAdapter = () => {
    const { ready, authenticated } = usePrivy();
    const { wallets } = useWallets();
    const { account } = useAccount();

    useEffect(() => {
        const connectToOrderly = async () => {
            // @ts-ignore
            if (ready && authenticated && wallets.length > 0 && account?.setAddress) {
                const wallet = wallets[0];
                // Ensure the wallet is connected and has a provider
                const provider = await wallet.getEthereumProvider();

                const isSolana = wallet.type === "solana";
                const namespace = isSolana ? "solana" : "evm";
                // Parse chain ID. For EVM it is caip2 (e.g. eip155:1), for Solana it might be different.
                // Orderly expects a chain ID that matches its supported chains.
                let chainId: string | number = wallet.chainId;
                if (!isSolana && wallet.chainId.includes(":")) {
                    chainId = parseInt(wallet.chainId.split(":")[1]);
                }

                // @ts-ignore
                account.setAddress(wallet.address, {
                    provider,
                    chain: { id: chainId, namespace: namespace as any },
                    wallet: { name: "Privy" },
                });
            }
        };

        connectToOrderly();
    }, [ready, authenticated, wallets, account]);

    return null;
};
