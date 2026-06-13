import type { Metadata } from "next";
import { PortalProvider } from "@/components/portal/PortalProvider";
import { PortalNav } from "@/components/portal/PortalNav";

export const metadata: Metadata = {
  title: "HackSL Portal",
  description: "Create your HackSL profile - get matched with teams, partners, and the Fellowship.",
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalProvider>
      <PortalNav />
      <main className="min-h-screen bg-[var(--background)] px-4 pt-24 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>
    </PortalProvider>
  );
}
