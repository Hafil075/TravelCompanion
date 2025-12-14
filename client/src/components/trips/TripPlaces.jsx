import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Plus, Trash2, CheckCircle, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const TripPlaces = ({ tripId }) => {
    const [places, setPlaces] = useState([]);
    const [newPlace, setNewPlace] = useState('');
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchPlaces();
    }, [tripId]);

    const fetchPlaces = async () => {
        try {
            const response = await api.get(`/api/trips/${tripId}/places`);
            setPlaces(response.data);
        } catch (error) {
            console.error('Failed to fetch places:', error);
            toast.error('Failed to load places');
        } finally {
            setLoading(false);
        }
    };

    const handleAddPlace = async (e) => {
        e.preventDefault();
        if (!newPlace.trim()) return;

        setAdding(true);
        try {
            const response = await api.post(`/api/trips/${tripId}/places`, { name: newPlace });
            setPlaces([...places, response.data]);
            setNewPlace('');
            toast.success('Place added');
        } catch (error) {
            console.error('Failed to add place:', error);
            toast.error('Failed to add place');
        } finally {
            setAdding(false);
        }
    };

    const handleDeletePlace = async (placeId) => {
        try {
            await api.delete(`/api/trips/${tripId}/places/${placeId}`);
            setPlaces(places.filter(p => p.id !== placeId));
            toast.success('Place removed');
        } catch (error) {
            console.error('Failed to delete place:', error);
            toast.error('Failed to remove place');
        }
    };

    const handleToggleVisited = async (place) => {
        try {
            // Optimistic update
            const updatedPlace = { ...place, visited: !place.visited };
            setPlaces(places.map(p => p.id === place.id ? updatedPlace : p));

            await api.put(`/api/trips/${tripId}/places/${place.id}`, updatedPlace);
        } catch (error) {
            console.error('Failed to update place:', error);
            toast.error('Failed to update status');
            // Revert on failure
            setPlaces(places.map(p => p.id === place.id ? place : p));
        }
    };

    if (loading) return <div className="text-center p-4">Loading places...</div>;

    return (
        <div className="space-y-6">
            <Card className="p-6 bg-slate-900/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-indigo-400" />
                    Itinerary & Places
                </h3>

                <form onSubmit={handleAddPlace} className="flex gap-2 mb-6">
                    <Input
                        value={newPlace}
                        onChange={(e) => setNewPlace(e.target.value)}
                        placeholder="Add a place to visit..."
                        className="flex-1"
                    />
                    <Button type="submit" disabled={adding || !newPlace.trim()}>
                        {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    </Button>
                </form>

                <div className="space-y-3">
                    <AnimatePresence initial={false}>
                        {places.map((place) => (
                            <motion.div
                                key={place.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                className={cn(
                                    "flex items-center justify-between p-3 rounded-lg border transition-all duration-200",
                                    place.visited
                                        ? "bg-slate-800/30 border-slate-800"
                                        : "bg-slate-800/60 border-slate-700 hover:border-slate-600"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleToggleVisited(place)}
                                        className={cn(
                                            "flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center transition-colors",
                                            place.visited
                                                ? "bg-green-500/20 border-green-500 text-green-500"
                                                : "border-slate-500 text-transparent hover:border-indigo-400"
                                        )}
                                    >
                                        <CheckCircle className="h-3.5 w-3.5 fill-current" />
                                    </button>
                                    <span className={cn(
                                        "text-sm",
                                        place.visited ? "text-slate-500 line-through" : "text-slate-200"
                                    )}>
                                        {place.name}
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeletePlace(place.id)}
                                    className="text-slate-500 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {!places.length && (
                        <div className="text-center py-8 text-slate-500 italic">
                            No places added yet.
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default TripPlaces;
