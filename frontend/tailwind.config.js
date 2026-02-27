export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#070B14",
        panel: "rgba(255,255,255,0.04)",
        panel2: "rgba(255,255,255,0.06)",
        border: "rgba(255,255,255,0.08)",
        text: "rgba(255,255,255,0.92)",
        muted: "rgba(255,255,255,0.62)",
        teal: "#20D3C2"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.45)"
      }
    }
  },
  plugins: []
};