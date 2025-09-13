'use client'

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const hideLayout = pathname === "/share";

  return (
    <>
      {!hideLayout && <Header />}
      <main>{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}
