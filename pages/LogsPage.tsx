
import React from 'react';
import { useBotStore } from '../apps/terminal-ui/src/store/botStore';
import { SystemLog } from '../types';

const LogLevelBadge: React.FC<{ level: SystemLog['level'] }> = ({ level }) => {
    const styles = {
        INFO: 'bg-blue-500/20 text-blue-300',
        CMD: 'bg-purple-500/20 text-purple-300',
        TRADE: 'bg-green-500/20 text-green-300',
        ERROR: 'bg-red-500/20 text-red-300',
        RISK: 'bg-yellow-500/20 text-yellow-300',
    };
    return <span className={`w-14 text-center font-mono text-xs font-bold px-2 py-0.5 rounded ${styles[level]}`}>{level}</span>
}

const LogsPage: React.FC = () => {
    const { logs } = useBotStore();

    return (
        <div className="p-4 h-screen flex flex-col">
            <h1 className="text-2xl font-bold mb-4 flex-shrink-0">Live Event Log</h1>
            <div className="bg-chimera-lightdark rounded-lg p-4 font-mono text-sm flex-grow overflow-y-auto">
                {logs.map((log, index) => (
                    <div key={index} className="flex items-start space-x-4 mb-1">
                        <span className="text-chimera-lightgrey">{log.timestamp.toLocaleTimeString()}</span>
                        <LogLevelBadge level={log.level} />
                        <span className="text-gray-400 w-32">[{log.service}]</span>
                        <p className="flex-1 text-gray-200">{log.message}</p>
                    </div>
                ))}
                 {logs.length === 0 && <div className="text-chimera-lightgrey">Waiting for logs...</div>}
            </div>
        </div>
    );
};

export default LogsPage;
