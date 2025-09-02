
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { useWebSocket } from './apps/terminal-ui/src/hooks/useWebSocket';
import PortfolioOverviewPage from './pages/PortfolioOverviewPage';
import BacktestingPage from './pages/BacktestingPage';
import LogsPage from './pages/LogsPage';

export type Page = 'Portfolio' | 'Backtesting' | 'Logs';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('Portfolio');

  // Initialize WebSocket connection and data flow
  useWebSocket('ws://localhost:8081'); 

  const renderPage = () => {
    switch(activePage) {
        case 'Portfolio':
            return <PortfolioOverviewPage />;
        case 'Backtesting':
            return <BacktestingPage />;
        case 'Logs':
            return <LogsPage />;
        default:
            return <PortfolioOverviewPage />;
    }
  }

  return (
    <div className="min-h-screen bg-chimera-dark text-gray-300 flex font-sans">
      <Sidebar 
        activePage={activePage}
        onPageChange={setActivePage}
      />
      <main className="flex-1 overflow-y-auto h-screen">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
