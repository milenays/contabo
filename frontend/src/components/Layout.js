import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Bell, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeProvider } from './ThemeContext';
import { ThemeToggle } from './ThemeToggle';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <ThemeProvider>
      <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
        <aside className={`${sidebarOpen ? 'block' : 'hidden'} lg:block border-r bg-background`}>
          <Sidebar />
        </aside>
        <div className="flex flex-col">
          <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
              {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            <div className="flex-1 font-bold">in development</div>
            <ThemeToggle />
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Layout;