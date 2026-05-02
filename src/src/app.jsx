function App() {
  return (
    <div className="page-shell">
      <Nav />
      <main>
        <Hero />
        <MetricsBand />
        <Capabilities />
        <Evidence />
        <TrustProcess />
        <Schemes />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
