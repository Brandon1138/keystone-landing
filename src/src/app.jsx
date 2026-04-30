// Top-level app — theme management + tweaks panel + section composition.

const { useState: useStateApp, useEffect: useEffectApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentHue": "amber",
  "monoEyebrows": "double-slash",
  "headlineWeight": 500,
  "showCapabilitiesBar": true,
  "density": "default"
}/*EDITMODE-END*/;

const ACCENT_HUES = {
  amber:  { light: "#D97706", hover: "#B45309", bg: "#FEF3E2",                  darkBg: "rgba(217,119,6,0.10)" },
  signal: { light: "#DC2626", hover: "#991B1B", bg: "#FEE7E7",                  darkBg: "rgba(220,38,38,0.10)" },
  sodium: { light: "#CA8A04", hover: "#A16207", bg: "#FEF3C7",                  darkBg: "rgba(202,138,4,0.10)" },
  blueprint: { light: "#1D4ED8", hover: "#1E40AF", bg: "#DBEAFE",               darkBg: "rgba(29,78,216,0.10)" },
};

function App() {
  const [theme, setTheme] = useStateApp(() => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem("keystone-theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffectApp(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try { localStorage.setItem("keystone-theme", theme); } catch (e) {}
  }, [theme]);

  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  // Apply accent hue
  useEffectApp(() => {
    const hue = ACCENT_HUES[tweaks.accentHue] || ACCENT_HUES.amber;
    const root = document.documentElement;
    root.style.setProperty("--accent", hue.light);
    root.style.setProperty("--accent-hover", hue.hover);
    root.style.setProperty("--accent-bg", theme === "dark" ? hue.darkBg : hue.bg);
  }, [tweaks.accentHue, theme]);

  return (
    <>
      <Nav theme={theme} setTheme={setTheme} />
      <main>
        <Hero />
        {tweaks.showCapabilitiesBar && <CapabilitiesBar />}
        <Primitives />
        <LiveByDesign />
        <AlgorithmMatrix />
        <Quantum />
        <OpenSource />
        <DownloadBand />
      </main>
      <Footer />

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Accent">
          <window.TweakRadio
            label="Hue"
            value={tweaks.accentHue}
            onChange={(v) => setTweak("accentHue", v)}
            options={[
              { value: "amber", label: "Amber" },
              { value: "signal", label: "Signal" },
              { value: "sodium", label: "Sodium" },
              { value: "blueprint", label: "Blueprint" },
            ]}
          />
        </window.TweakSection>

        <window.TweakSection label="Sections">
          <window.TweakToggle
            label="Capabilities bar"
            value={tweaks.showCapabilitiesBar}
            onChange={(v) => setTweak("showCapabilitiesBar", v)}
          />
        </window.TweakSection>

        <window.TweakSection label="Theme">
          <window.TweakRadio
            label="Mode"
            value={theme}
            onChange={(v) => setTheme(v)}
            options={[
              { value: "light", label: "Light" },
              { value: "dark",  label: "Dark"  },
            ]}
          />
        </window.TweakSection>
      </window.TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
