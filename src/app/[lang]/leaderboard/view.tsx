"use client";

import { useMemo } from "react";
import { i18n, parseI18nLang } from "@orderly.network/i18n";
import { LeaderboardPage } from "@orderly.network/trading-leaderboard";
import { PathEnum } from "@/constant";
import { getSymbol } from "@/storage";

export default function LeaderboardView() {
  const tradingUrl = useMemo(() => {
    const symbol = getSymbol();
    return `/${parseI18nLang(i18n.language)}${PathEnum.Perp}/${symbol}`;
  }, []);

  return (
    <LeaderboardPage
      href={{
        trading: tradingUrl,
      }}
      className="oui-py-5"
    />
  );
}
