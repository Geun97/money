"use client";

import { useEffect } from "react";

const ADSENSE_CLIENT = "ca-pub-2252279046795509";

type AdSenseUnitProps = {
  /** AdSense 광고 단위 슬롯 ID. AdSense → 광고 → 단위 만들기 후 발급된 숫자 */
  slot?: string;
  format?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
  className?: string;
};

export default function AdSenseUnit({ slot, format = "auto", className = "" }: AdSenseUnitProps) {
  useEffect(() => {
    if (!slot || typeof window === "undefined") return;
    try {
      const w = window as unknown as { adsbygoogle: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch (e) {
      console.warn("AdSense push error", e);
    }
  }, [slot]);

  if (!slot) return null;

  return (
    <div className={`my-8 flex justify-center min-h-[100px] ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
