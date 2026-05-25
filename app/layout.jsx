import "./globals.css";

export const metadata = {
  title: "Formula Visualizer",
  description: "Interactive visual interpretations for a few core formulas.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
