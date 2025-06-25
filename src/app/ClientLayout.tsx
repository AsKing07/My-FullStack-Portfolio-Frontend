"use client";
import { Header } from "@/components/layout/header_component";
import { Footer } from "@/components/layout/footer_component";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && (
        <header className="fixed top-0 left-0 w-full z-50">
          <Header />
           <div className="h-[64px]" />
        </header>
      )}
      <div className="flex flex-col min-h-screen">
       
        <main className="flex-1 flex flex-col justify-center items-center">
          {children}
        </main>
        {!isDashboard && (
          <footer>
            <Footer />
          </footer>
        )}
      </div>
    </>
  );
}