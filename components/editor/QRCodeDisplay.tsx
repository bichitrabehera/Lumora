"use client";

import React, { useState, useEffect } from "react";
import { getPageQR } from "@/lib/api";

export function PageQrCode({ pageId }: { pageId: number }) {
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getPageQR(pageId);
        if (res?.data) setQr(res.data);
      } catch {
        // ignore
      }
    })();
  }, [pageId]);

  if (!qr) {
    return (
      <div className="text-sm text-muted py-3">
        Loading QR Code...
      </div>
    );
  }

  return (
    <img
      src={qr}
      alt="QR Code"
      className="w-35 h-35 rounded-md p-2 bg-white border border-border block"
    />
  );
}
