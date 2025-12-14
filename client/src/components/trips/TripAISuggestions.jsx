import React, { useState } from 'react';
import api from '../../api/client';
import { Button } from '../ui/Button';
import { Sparkles, MapPin, CheckSquare, Plus, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const TripAISuggestions = ({ trip, onUpdate }) => {
    const [suggestions, setSuggestions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [addingPlace, setAddingPlace] = useState(null);
    const [addingItem, setAddingItem] = useState(null);
    const [addingAll, setAddingAll] = useState(false);

    // ---------------- FETCH AI ----------------
    const fetchSuggestions = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/api/trips/${trip.id}/suggest`);
            setSuggestions(res.data);
            toast.success('Suggestions generated');
        } catch (e) {
            console.error(e);
            toast.error('Failed to generate suggestions');
        } finally {
            setLoading(false);
        }
    };

    // ---------------- ADD SINGLE PLACE ----------------
    const handleAddPlace = async (place) => {
        setAddingPlace(place);
        try {
            await api.post(`/api/trips/${trip.id}/places`, { name: place });

            setSuggestions(prev => ({
                ...prev,
                places: prev.places.filter(p => p !== place)
            }));

            toast.success(`${place} added`);
            if (onUpdate) onUpdate();
        } catch (e) {
            toast.error('Failed to add place');
        } finally {
            setAddingPlace(null);
        }
    };

    // ---------------- ADD SINGLE ITEM ----------------
    const handleAddItem = async (item) => {
        setAddingItem(item);
        try {
            await api.post(`/api/trips/${trip.id}/items`, {
                name: item,
                packed: false
            });

            setSuggestions(prev => ({
                ...prev,
                items: prev.items.filter(i => i !== item)
            }));

            toast.success(`${item} added`);
            if (onUpdate) onUpdate();
        } catch (e) {
            toast.error('Failed to add item');
        } finally {
            setAddingItem(null);
        }
    };

    // ---------------- ADD ALL ----------------
    const handleAddAll = async () => {
        if (!suggestions) return;

        setAddingAll(true);
        try {
            if (suggestions.places?.length) {
                await api.post(
                    `/api/trips/${trip.id}/places/bulk`,
                    suggestions.places.map(p => ({ name: p }))
                );
            }

            if (suggestions.items?.length) {
                await api.post(
                    `/api/trips/${trip.id}/items/bulk`,
                    suggestions.items.map(i => ({
                        name: i,
                        packed: false
                    }))
                );
            }

            setSuggestions({ places: [], items: [] });
            toast.success('All suggestions added');
            if (onUpdate) onUpdate();
        } catch (e) {
            console.error(e);
            toast.error('Failed to add all');
        } finally {
            setAddingAll(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mb-3">
                    <Sparkles className="h-6 w-6 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">AI Trip Assistant</h2>
                <p className="text-slate-400">
                    Smart suggestions for {trip.destination}
                </p>
            </div>

            {/* GENERATE BUTTON */}
            {!suggestions && (
                <div className="flex justify-center">
                    <Button
                        onClick={fetchSuggestions}
                        disabled={loading}
                        size="lg"
                        className="bg-indigo-600 hover:bg-indigo-700"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-5 w-5 mr-2" />
                                Generate Suggestions
                            </>
                        )}
                    </Button>
                </div>
            )}

            {/* ADD ALL BUTTON */}
            {suggestions && (
                <div className="flex justify-center">
                    <Button
                        onClick={handleAddAll}
                        disabled={
                            addingAll ||
                            (!suggestions.places.length &&
                                !suggestions.items.length)
                        }
                        size="lg"
                        className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
                    >
                        {addingAll ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Adding all...
                            </>
                        ) : (
                            <>
                                <Plus className="h-5 w-5" />
                                Add All Suggestions
                            </>
                        )}
                    </Button>
                </div>
            )}

            {/* SUGGESTIONS GRID */}
            {suggestions && (
                <div className="grid md:grid-cols-2 gap-8">
                    {/* PLACES */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-indigo-400" />
                            Places to Visit
                        </h3>
                        <div className="space-y-3">
                            {suggestions.places.map((place, i) => (
                                <motion.div
                                    key={place}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex justify-between items-center bg-slate-800/60 p-3 rounded-lg"
                                >
                                    <span className="text-slate-200">
                                        {place}
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        disabled={addingPlace === place}
                                        onClick={() => handleAddPlace(place)}
                                    >
                                        {addingPlace === place ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Plus className="h-4 w-4" />
                                        )}
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* ITEMS */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <CheckSquare className="h-5 w-5 text-indigo-400" />
                            Items to Pack
                        </h3>
                        <div className="space-y-3">
                            {suggestions.items.map((item, i) => (
                                <motion.div
                                    key={item}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex justify-between items-center bg-slate-800/60 p-3 rounded-lg"
                                >
                                    <span className="text-slate-200">
                                        {item}
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        disabled={addingItem === item}
                                        onClick={() => handleAddItem(item)}
                                    >
                                        {addingItem === item ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Plus className="h-4 w-4" />
                                        )}
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TripAISuggestions;
