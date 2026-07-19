import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-dvh flex flex-col">
      <SiteHeader />
      <main className="w-full max-w-3xl mx-auto flex-1 px-6">{children}</main>
      <SiteFooter />
    </div>
  );
}
