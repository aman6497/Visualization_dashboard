import './globals.css';

export const metadata = {
  title: 'Data Visualization Dashboard',
  description: 'A full-stack data visualization dashboard built with Next.js, MongoDB, Tailwind CSS, and D3.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background min-h-screen">
        <header className="bg-card shadow-md py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-primary">Data Visualization Dashboard</h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-card shadow-inner py-4 mt-8">
          <div className="container mx-auto px-4 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Data Visualization Dashboard</p>
          </div>
        </footer>
      </body>
    </html>
  );
}