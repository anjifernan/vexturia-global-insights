import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import VextaChat from "@/components/VextaChat";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
      <VextaChat />
    </div>
  );
}
