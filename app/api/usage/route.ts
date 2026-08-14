import { NextResponse } from "next/server";
import { z } from "zod";
import { getBalance, balanceToUsd } from "@/lib/billing";
import { FREE_REAL_USD, MARKUP, TOPUP_USD } from "@/lib/pricing";

const Query = z.object({ cid: z.string().min(6).max(128) });

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = Query.safeParse({ cid: url.searchParams.get("cid") });
  if (!parsed.success) {
    return NextResponse.json({ error: "Falta cliente." }, { status: 400 });
  }
  const balanceMicro = await getBalance(parsed.data.cid);
  return NextResponse.json({
    balanceUsd: balanceToUsd(balanceMicro),
    markup: MARKUP,
    topupUsd: TOPUP_USD,
    freeRealUsd: FREE_REAL_USD,
    // Cuánto consumo REAL le queda antes de pagar otro top-up.
    remainingTopups: balanceMicro <= 0 ? 0 : 1,
  });
}