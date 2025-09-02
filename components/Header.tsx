
import React from 'react';

type Page = 'Terminal' | 'Analytics' | 'Strategies';

interface HeaderProps {
  status: 'Connected' | 'Connecting' | 'Disconnected';
  activePage: Page;
  onPageChange: (page: Page) => void;
}

const StatusIndicator: React.FC<{ status: HeaderProps['status'] }> = ({ status }) => {
  const color = status === 'Connected' ? 'bg-chimera-green' : status === 'Connecting' ? 'bg-yellow-500' : 'bg-chimera-red';
  return (
    <div className="flex items-center space-x-2">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`}></span>
      <span className="text-sm font-medium">{status}</span>
    </div>
  );
};

const NavItem: React.FC<{ page: Page; activePage: Page; onPageChange: (page: Page) => void; children: React.ReactNode }> = ({ page, activePage, onPageChange, children }) => {
    const isActive = page === activePage;
    return (
        <button 
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 text-sm font-semibold rounded-md ${isActive ? 'bg-chimera-blue text-white' : 'text-gray-300 hover:bg-chimera-grey'}`}
        >
            {children}
        </button>
    )
}

const Header: React.FC<HeaderProps> = ({ status, activePage, onPageChange }) => {
  return (
    <header className="bg-chimera-lightdark h-16 flex items-center justify-between px-6 border-b border-chimera-grey">
      <div className="flex items-center space-x-4">
         <svg xmlns="http://www.w.org/2000/svg" className="h-8 w-8 text-chimera-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
        <h1 className="text-xl font-bold text-gray-100 hidden md:block">Project Chimera</h1>
      </div>

      <div className="flex items-center space-x-2">
        <NavItem page="Terminal" activePage={activePage} onPageChange={onPageChange}>Terminal</NavItem>
        <NavItem page="Analytics" activePage={activePage} onPageChange={onPageChange}>Analytics</NavItem>
        <NavItem page="Strategies" activePage={activePage} onPageChange={onPageChange}>Strategies</NavItem>
      </div>

      <div>
        <StatusIndicator status={status} />
      </div>
    </header>
  );
};

export default Header;
