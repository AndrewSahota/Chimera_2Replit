
import React, { useState } from 'react';

const mockStrategies = [
    { id: 'strat-1', strategyName: 'EMA Crossover', botName: 'bot-equities', isActive: true, params: { fast: 12, slow: 26 } },
    { id: 'strat-2', strategyName: 'RSI Momentum', botName: 'bot-equities', isActive: false, params: { period: 14, overbought: 70 } },
    { id: 'strat-3', strategyName: 'Mean Reversion', botName: 'bot-crypto', isActive: true, params: { lookback: 50, stdev: 2 } },
];

const StrategyModal = ({ strategy, onClose, onSave }) => {
    const [params, setParams] = useState(JSON.stringify(strategy?.params || {}, null, 2));
    
    const handleSave = () => {
        try {
            const parsedParams = JSON.parse(params);
            onSave({ ...strategy, params: parsedParams });
        } catch (e) {
            alert('Invalid JSON in parameters.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="bg-chimera-lightdark p-6 rounded-lg w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">{strategy?.id ? 'Edit' : 'Create'} Strategy</h3>
                {/* Simplified form for conceptual layout */}
                <div className="space-y-4">
                     <div>
                        <label className="text-xs text-chimera-lightgrey">Strategy Name</label>
                        <input defaultValue={strategy?.strategyName} className="w-full bg-chimera-grey p-2 rounded-md" />
                     </div>
                     <div>
                        <label className="text-xs text-chimera-lightgrey">Parameters (JSON)</label>
                        <textarea value={params} onChange={e => setParams(e.target.value)} rows={6} className="w-full bg-chimera-grey p-2 rounded-md font-mono text-sm"></textarea>
                     </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                    <button onClick={onClose} className="py-2 px-4 rounded-md bg-chimera-grey">Cancel</button>
                    <button onClick={handleSave} className="py-2 px-4 rounded-md bg-chimera-blue">Save</button>
                </div>
            </div>
        </div>
    )
};


export const StrategiesPage: React.FC = () => {
    const [strategies, setStrategies] = useState(mockStrategies);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStrategy, setEditingStrategy] = useState(null);
    
    const handleDeploy = async (id: string) => {
        if (!confirm('Are you sure you want to deploy this strategy? This will become the active configuration.')) return;
        try {
            // In a real app, API host is configured
            await fetch(`http://localhost:3000/api/strategies/${id}/deploy`, { method: 'POST' });
            alert('Deploy command sent successfully!');
            // You would typically refetch the strategies list here to show the new active state
        } catch (error) {
            alert('Failed to send deploy command.');
        }
    }

    return (
        <div className="h-full flex flex-col p-4 gap-4">
            {isModalOpen && <StrategyModal strategy={editingStrategy} onClose={() => setIsModalOpen(false)} onSave={() => {}} />}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Strategy Management</h2>
                <button onClick={() => { setEditingStrategy(null); setIsModalOpen(true); }} className="bg-chimera-blue px-4 py-2 rounded-md font-semibold">
                    New Strategy
                </button>
            </div>
            
            <div className="flex-grow bg-chimera-lightdark rounded-md p-2 overflow-y-auto">
                 <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-chimera-lightdark">
                        <tr className="text-chimera-lightgrey border-b border-chimera-grey">
                            <th className="p-2 font-medium">Name</th>
                            <th className="p-2 font-medium">Bot</th>
                            <th className="p-2 font-medium">Status</th>
                            <th className="p-2 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {strategies.map(s => (
                            <tr key={s.id} className="border-b border-chimera-grey/50">
                                <td className="p-3 font-semibold">{s.strategyName}</td>
                                <td className="p-3 text-chimera-lightgrey">{s.botName}</td>
                                <td className="p-3">
                                    {s.isActive ? (
                                        <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-300">Active</span>
                                    ) : (
                                        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">Inactive</span>
                                    )}
                                </td>
                                <td className="p-3 space-x-2">
                                    <button onClick={() => handleDeploy(s.id)} disabled={s.isActive} className="font-bold text-chimera-green disabled:text-chimera-grey">Deploy</button>
                                    <button onClick={() => { setEditingStrategy(s); setIsModalOpen(true); }} className="font-bold text-chimera-blue">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            </div>
        </div>
    );
};
