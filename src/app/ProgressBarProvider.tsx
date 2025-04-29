"use client";

import NextTopLoader from 'nextjs-toploader';

export default function ProgressBarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <NextTopLoader
        color="#3b82f6"
        height={4}
        showSpinner={false}
      />
    </>
  );
}
