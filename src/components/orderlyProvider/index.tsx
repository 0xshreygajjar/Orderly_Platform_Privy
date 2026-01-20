"use client";

import React, { FC, ReactNode, useEffect } from "react";
import { WalletError, Adapter } from "@solana/wallet-adapter-base";
import { usePathname } from "next/navigation";
import {
  LocaleProvider,
  LocaleCode,
  LocaleEnum,
  getLocalePathFromPathname,
  i18n,
} from "@orderly.network/i18n";
import { OrderlyAppProvider } from "@orderly.network/react-app";
import {
  Network,
  wagmiConnectors,
  WalletConnectorPrivyProvider,
} from "@orderly.network/wallet-connector-privy";
import { useNav } from "@/hooks/useNav";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { usePathWithoutLang } from "@/hooks/usePathWithoutLang";

const OrderlyProvider: FC<{ children: ReactNode }> = (props) => {
  const config = useOrderlyConfig();
  const path = usePathWithoutLang();
  const pathname = usePathname();
  const { onRouteChange } = useNav();

  const onLanguageChanged = async (lang: LocaleCode) => {
    window.history.replaceState({}, "", `/${lang}${path}`);
  };

  const loadPath = (lang: LocaleCode) => {
    if (lang === LocaleEnum.en) {
      // because en is built-in, we need to load the en extend only
      return `/locales/extend/${lang}.json`;
    }
    return [`/locales/${lang}.json`, `/locales/extend/${lang}.json`];
  };

  useEffect(() => {
    const lang = getLocalePathFromPathname(pathname);
    // if url is include lang, and url lang is not the same as the i18n language, change the i18n language
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [pathname]);

  if (
    !process.env.NEXT_PUBLIC_PRIVY_APP_ID ||
    !process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
  ) {
    throw new Error("Privy App ID or Wallet Connect Project ID is not defined");
  }

  return (
    <LocaleProvider
      onLanguageChanged={onLanguageChanged}
      backend={{ loadPath }}
    >
      <WalletConnectorPrivyProvider
        termsOfUse="https://learn.woo.org/legal/terms-of-use"
        network={Network.testnet}
        privyConfig={{
          appid: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
          config: {
            appearance: {
              theme: "dark",
              accentColor: "#181C23",
            },
          },
        }}
        wagmiConfig={{
          connectors: [
            wagmiConnectors.injected(),
            wagmiConnectors.walletConnect({
              projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
              showQrModal: true,
              storageOptions: {},
              metadata: {
                name: "Orderly Network",
                description: "Orderly Network",
                url: "https://orderly.network",
                icons: ["https://oss.orderly.network/static/sdk/chains.png"],
              },
            }),
          ],
        }}
        solanaConfig={{
          mainnetRpc: "",
          devnetRpc: "https://api.devnet.solana.com",
          wallets: [],
          onError: (error: WalletError, adapter?: Adapter) => {
            console.log("-- error", error, adapter);
          },
        }}
        abstractConfig={{}}
      >
        <OrderlyAppProvider
          brokerId="orderly"
          brokerName="Orderly"
          networkId="testnet"
          appIcons={config.orderlyAppProvider.appIcons}
          onRouteChange={onRouteChange}
        >
          {props.children}
        </OrderlyAppProvider>
      </WalletConnectorPrivyProvider>
    </LocaleProvider>
  );
};

export default OrderlyProvider;
