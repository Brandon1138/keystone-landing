import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { MockupWindow } from "@/components/landing/app-mockup/MockupWindow";
import { Sidebar } from "@/components/landing/app-mockup/Sidebar";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero
          mockup={
            <MockupWindow>
              <div className="flex">
                <Sidebar />
                <div className="flex-1 p-4 text-foreground-muted">Dashboard body — in progress</div>
              </div>
            </MockupWindow>
          }
        />
      </main>
    </>
  );
}
