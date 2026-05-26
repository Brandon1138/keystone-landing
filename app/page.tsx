import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Mockup } from "@/components/landing/app-mockup/Mockup";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero mockup={<Mockup />} />
      </main>
    </>
  );
}
