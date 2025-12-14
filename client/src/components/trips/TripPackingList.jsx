import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Plus, Trash2, CheckSquare, Square, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const TripPackingList = ({ tripId }) => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchItems();
    }, [tripId]);

    const fetchItems = async () => {
        try {
            const response = await api.get(`/api/trips/${tripId}/items`);
            setItems(response.data);
        } catch (error) {
            console.error('Failed to fetch items:', error);
            toast.error('Failed to load packing list');
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newItem.trim()) return;

        setAdding(true);
        try {
            const response = await api.post(`/api/trips/${tripId}/items`, { name: newItem, packed: false });
            setItems([...items, response.data]);
            setNewItem('');
            toast.success('Item added');
        } catch (error) {
            console.error('Failed to add item:', error);
            toast.error('Failed to add item');
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteItem = async (itemId) => {
        try {
            await api.delete(`/api/trips/${tripId}/items/${itemId}`);
            setItems(items.filter(i => i.id !== itemId));
            toast.success('Item removed');
        } catch (error) {
            console.error('Failed to delete item:', error);
            toast.error('Failed to remove item');
        }
    };

    const handleTogglePacked = async (item) => {
        try {
            const updatedItem = { ...item, packed: !item.packed };
            setItems(items.map(i => i.id === item.id ? updatedItem : i));

            await api.put(`/api/trips/${tripId}/items/${item.id}`, updatedItem);
        } catch (error) {
            console.error('Failed to update item:', error);
            toast.error('Failed to update status');
            setItems(items.map(i => i.id === item.id ? item : i));
        }
    };

    if (loading) return <div className="text-center p-4">Loading list...</div>;

    return (
        <div className="space-y-6">
            <Card className="p-6 bg-slate-900/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-indigo-400" />
                    Packing List
                </h3>

                <form onSubmit={handleAddItem} className="flex gap-2 mb-6">
                    <Input
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="Add an item to pack..."
                        className="flex-1"
                    />
                    <Button type="submit" disabled={adding || !newItem.trim()}>
                        {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    </Button>
                </form>

                <div className="space-y-2">
                    <AnimatePresence initial={false}>
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                className={cn(
                                    "flex items-center justify-between p-3 rounded-lg border transition-all duration-200 group",
                                    item.packed
                                        ? "bg-slate-800/30 border-slate-800"
                                        : "bg-slate-800/60 border-slate-700 hover:border-slate-600"
                                )}
                            >
                                <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => handleTogglePacked(item)}>
                                    <div className={cn(
                                        "flex-shrink-0 h-5 w-5 rounded border flex items-center justify-center transition-colors",
                                        item.packed
                                            ? "bg-indigo-500 border-indigo-500 text-white"
                                            : "border-slate-500 text-transparent hover:border-indigo-400"
                                    )}>
                                        {item.packed && <CheckSquare className="h-3.5 w-3.5" />}
                                    </div>
                                    <span className={cn(
                                        "text-sm",
                                        item.packed ? "text-slate-500 line-through" : "text-slate-200"
                                    )}>
                                        {item.name}
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="text-slate-500 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {!items.length && (
                        <div className="text-center py-8 text-slate-500 italic">
                            Your packing list is empty.
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default TripPackingList;
