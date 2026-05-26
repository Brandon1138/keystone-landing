import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Mockup } from "@/components/landing/app-mockup/Mockup";
import { Features } from "@/components/landing/Features";
import { ClassicalVsPqc } from "@/components/landing/ClassicalVsPqc";
import { TrustPillars } from "@/components/landing/TrustPillars";
import { Download } from "@/components/landing/Download";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero mockup={<Mockup />} />
        <Features />
        <ClassicalVsPqc />
        <TrustPillars />
        <Download />
      </main>
    </>
  );
}
