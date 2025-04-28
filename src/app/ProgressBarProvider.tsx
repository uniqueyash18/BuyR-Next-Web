"use client";

import { AppProgressBar } from "next-nprogress-bar";

export default function ProgressBarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <AppProgressBar
        height="4px"
        color="#3b82f6"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
}
