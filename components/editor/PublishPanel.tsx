import React from "react";
import type { PublishInfo } from "./types";

export function PublishPanel({ publishInfo }: { publishInfo: PublishInfo }) {
  return (
    <div className="mt-4 p-5 rounded-md border border-border bg-white grid gap-3">
      <div>
        <strong className="block mb-1 text-heading">
          Published page link:
        </strong>
        <a
          href={publishInfo.fullUrl}
          target="_blank"
          rel="noreferrer"
          className="text-primary font-medium underline break-all"
        >
          {publishInfo.fullUrl}
        </a>
      </div>
      {publishInfo.qr && (
        <div className="grid gap-2 justify-items-start">
          <strong className="text-heading">QR code:</strong>
          <img
            src={publishInfo.qr}
            alt="QR code for published page"
            className="w-40 h-40 p-2.5 rounded-md bg-white border border-border"
          />
        </div>
      )}
    </div>
  );
}
