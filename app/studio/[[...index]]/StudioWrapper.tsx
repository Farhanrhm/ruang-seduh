"use client";

import dynamic from "next/dynamic";
import config from "../../../sanity.config";

// Disable SSR for Sanity Studio to prevent Node.js fetch errors
const NextStudioNoSSR = dynamic(
  () => import("next-sanity/studio").then((mod) => mod.NextStudio),
  { ssr: false }
);

export default function StudioWrapper() {
  return <NextStudioNoSSR config={config} />;
}
