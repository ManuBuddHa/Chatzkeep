import "./globals.css"; 

export const metadata = {
  title: "ChatzKeep - Healthcare Recruitment Platform",
  description: "Next-gen communication software for modern staffing solutions."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}