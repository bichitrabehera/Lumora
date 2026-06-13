import Editor from "./editor";
import React from "react";
import Topbar from "@/components/topbar";
import { siteData } from "@/lib/site-data";

export const metadata = {
  title: "Editor",
};

export default async function EditorPage() {
  return (
    <main className="page-shell">
      <Topbar
        logo={siteData.brand.logo}
        brandName={siteData.brand.name}
      />
      <div style={{ marginTop: 40 }}>
        <Editor />
      </div>
    </main>
  );
}
