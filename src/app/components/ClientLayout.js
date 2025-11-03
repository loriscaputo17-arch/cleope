'use client'

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  // lista di percorsi in cui NON vogliamo mostrare header/footer
  const hiddenRoutes = ["/share", "/srevents/winter", "/srevents", "/themerge/11.10", "/srevents/admin", "/themerge/confirmation", "/loriscaputo"];
  const hideLayout = hiddenRoutes.includes(pathname);

  return (
    <>
      {!hideLayout && <Header />}
      <main>{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}

