import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Kyai frontend render error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#10131b", color: "#eef0f6", fontFamily: "system-ui, sans-serif", textAlign: "center" }}>
          <section style={{ maxWidth: 520 }}>
            <h1 style={{ color: "#aaa2ed" }}>Kyai could not load</h1>
            <p>The page encountered a display error. Please refresh the page. If it continues, contact the site administrator.</p>
            <button onClick={() => window.location.reload()} style={{ padding: "11px 18px", borderRadius: 10, border: 0, background: "#9187ed", color: "#11121b", fontWeight: 700 }}>Refresh page</button>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  );
} else {
  document.body.innerHTML = '<main style="padding:24px;font-family:system-ui">Kyai could not find the app root element. Please check the deployment.</main>';
}
