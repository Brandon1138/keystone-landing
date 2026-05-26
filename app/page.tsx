import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Mockup } from "@/components/landing/app-mockup/Mockup";
import { Features } from "@/components/landing/Features";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero mockup={<Mockup />} />
        <Features />
      </main>
    </>
  );
}
