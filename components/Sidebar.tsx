
import React, { useState } from 'react';
import { useBotStore } from '../apps/terminal-ui/src/store/botStore';
import { Page } from '../App';

interface SidebarProps {
  activePage: Page;
  onPageChange: (page: Page) => void;
}

const StatusIndicator: React.FC = () => {
  const { connectionStatus, lastHeartbeat } = useBotStore();
  const color = connectionStatus === 'Connected' ? 'bg-chimera-green' : connectionStatus === 'Connecting' ? 'bg-yellow-500' : 'bg-chimera-red';
  const text = connectionStatus === 'Connected' ? 'Live' : connectionStatus === 'Connecting' ? 'Degraded' : 'Offline';

  return (
    <div className='p-4 border-b border-chimera-grey'>
        <div className="flex items-center space-x-2 mb-2">
            <span className={`h-3 w-3 rounded-full ${color}`}></span>
            <span className="text-md font-semibold">{text}</span>
        </div>
        <div className="text-xs text-chimera-lightgrey">
            Last Heartbeat: {lastHeartbeat ? lastHeartbeat.toLocaleTimeString() : 'N/A'}
        </div>
    </div>
  );
};

const NavItem: React.FC<{ page: Page; activePage: Page; onPageChange: (page: Page) => void; children: React.ReactNode }> = ({ page, activePage, onPageChange, children }) => {
    const isActive = page === activePage;
    return (
        <button 
            onClick={() => onPageChange(page)}
            className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-md transition-colors ${isActive ? 'bg-chimera-blue text-white' : 'text-gray-300 hover:bg-chimera-grey'}`}
        >
            {children}
        </button>
    )
}

const BotControlCenter: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const { bots, selectedBot, botStatuses, actions } = useBotStore();
    const currentBotStatus = botStatuses[selectedBot];

    return (
        <div className="py-2">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center px-4 py-2 text-xs font-bold uppercase text-chimera-lightgrey hover:text-white">
                Bot Control Center
                <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isOpen && (
                <div className="p-4 space-y-4">
                    <div>
                        <label className="text-xs text-chimera-lightgrey">Select Bot</label>
                         <select
                            value={selectedBot}
                            onChange={(e) => actions.selectBot(e.target.value)}
                            className="w-full bg-chimera-grey p-2 rounded-md border border-transparent focus:border-chimera-blue focus:outline-none mt-1"
                        >
                            {bots.map((bot) => <option key={bot} value={bot}>{bot}</option>)}
                        </select>
                    </div>
                    
                    <div className="text-xs space-y-1 bg-chimera-grey/50 p-2 rounded-md">
                       <p><span className="font-semibold text-chimera-lightgrey">Status:</span> {currentBotStatus?.status || 'N/A'}</p>
                       <p><span className="font-semibold text-chimera-lightgrey">Strategy:</span> {currentBotStatus?.strategy.name || 'N/A'}</p>
                       <p><span className="font-semibold text-chimera-lightgrey">Symbol:</span> {currentBotStatus?.strategy.symbol || 'N/A'}</p>
                    </div>
                    
                    <div className="space-y-2">
                        <button className="w-full py-2 text-sm font-semibold rounded-md bg-chimera-blue/80 hover:bg-chimera-blue">▶️ Deploy/Run Strategy</button>
                        <button className="w-full py-2 text-sm font-semibold rounded-md bg-chimera-grey hover:bg-chimera-lightgrey">⏹️ Stop Strategy</button>
                        <button className="w-full py-2 text-sm font-semibold rounded-md bg-chimera-red/80 hover:bg-chimera-red">‼️ Emergency Flatten</button>
                    </div>
                </div>
            )}
        </div>
    )
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange }) => {
  return (
    <aside className="w-64 bg-chimera-lightdark flex flex-col flex-shrink-0 border-r border-chimera-grey">
      <div className="h-16 flex items-center space-x-3 px-4 border-b border-chimera-grey">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-chimera-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
        <h1 className="text-xl font-bold text-gray-100">Project Chimera</h1>
      </div>
      <StatusIndicator />
      <nav className="flex-grow p-2 space-y-1">
        <div className="py-2">
            <p className="px-4 py-2 text-xs font-bold uppercase text-chimera-lightgrey">Portfolio</p>
            <NavItem page="Portfolio" activePage={activePage} onPageChange={onPageChange}>Portfolio Overview</NavItem>
        </div>
         <div className="py-2">
            <p className="px-4 py-2 text-xs font-bold uppercase text-chimera-lightgrey">Research & Backtesting</p>
            <NavItem page="Backtesting" activePage={activePage} onPageChange={onPageChange}>Backtesting Hub</NavItem>
        </div>
         <div className="py-2">
            <p className="px-4 py-2 text-xs font-bold uppercase text-chimera-lightgrey">System Logs</p>
            <NavItem page="Logs" activePage={activePage} onPageChange={onPageChange}>Live Event Log</NavItem>
        </div>
      </nav>
      <div className="border-t border-chimera-grey">
        <BotControlCenter />
      </div>
    </aside>
  );
};

export default Sidebar;
