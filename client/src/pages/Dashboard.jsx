import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import Layout from '../components/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { Plus, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const TripCard = ({ trip }) => {
    return (
        <Link to={`/trips/${trip.id}`}>
            <Card className="h-full hover:border-indigo-500/50 transition-colors group cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-5 w-5 text-indigo-400 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                </div>
                <div className="p-6 flex flex-col h-full">
                    <div className="mb-4">
                        <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-400">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-indigo-400 transition-colors">{trip.name}</h3>
                        <p className="text-sm text-slate-400">{trip.destination}</p>
                    </div>

                    <div className="mt-auto flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="h-4 w-4" />
                        <span>{trip.fromDate} - {trip.toDate}</span>
                    </div>
                </div>
            </Card>
        </Link>
    )
}

const Dashboard = () => {
    const [trips, setTrips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTrip, setNewTrip] = useState({ name: '', destination: '', fromDate: '', toDate: '' });
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        try {
            const response = await api.get('/api/trips');
            setTrips(response.data);
        } catch (error) {
            console.error('Failed to fetch trips:', error);
            toast.error('Could not load trips');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateTrip = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const response = await api.post('/api/trips', newTrip);
            setTrips([...trips, response.data]);
            setIsModalOpen(false);
            setNewTrip({ name: '', destination: '', fromDate: '', toDate: '' });
            toast.success('Trip created successfully!');
        } catch (error) {
            console.error('Failed to create trip:', error);
            toast.error('Failed to create trip');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Layout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Your Trips</h1>
                    <p className="text-slate-400 mt-1">Manage your upcoming adventures</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 border-0">
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Trip
                </Button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-48 rounded-xl bg-slate-800/50 animate-pulse" />
                    ))}
                </div>
            ) : trips.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-slate-700 bg-transparent">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="h-8 w-8 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No trips found</h3>
                    <p className="text-slate-400 mb-6 max-w-sm mx-auto">You haven't planned any trips yet. Start your journey by creating your first trip.</p>
                    <Button onClick={() => setIsModalOpen(true)} variant="outline">
                        Create Trip
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.map((trip) => (
                        <motion.div
                            key={trip.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <TripCard trip={trip} />
                        </motion.div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Trip"
            >
                <form onSubmit={handleCreateTrip} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Trip Name</label>
                        <Input
                            value={newTrip.name}
                            onChange={(e) => setNewTrip({ ...newTrip, name: e.target.value })}
                            placeholder="e.g. Summer in Paris"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Destination</label>
                        <Input
                            value={newTrip.destination}
                            onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
                            placeholder="e.g. Paris, France"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Start Date</label>
                            <Input
                                type="date"
                                value={newTrip.fromDate}
                                onChange={(e) => setNewTrip({ ...newTrip, fromDate: e.target.value })}
                                required
                                className="calendar-dark"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">End Date</label>
                            <Input
                                type="date"
                                value={newTrip.toDate}
                                onChange={(e) => setNewTrip({ ...newTrip, toDate: e.target.value })}
                                required
                                className="calendar-dark"
                            />
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isCreating}>
                            Create Trip
                        </Button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
};

export default Dashboard;
