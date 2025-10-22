"use client";

import { Tabs } from "./features/tabs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Tabs />
      {children}
    </>
  );
}
