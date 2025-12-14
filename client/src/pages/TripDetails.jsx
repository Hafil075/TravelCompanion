import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import Layout from '../components/Layout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Loader2, ArrowLeft, MapPin, Calendar, CheckSquare, Sparkles, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import TripPlaces from '../components/trips/TripPlaces';
import TripPackingList from '../components/trips/TripPackingList';
import TripAISuggestions from '../components/trips/TripAISuggestions';
import { FloatingActionButton } from '../components/ui/FloatingActionButton';
import Modal from '../components/ui/Modal';

const TripDetails = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('places'); // places, packing
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        fetchTripDetails();
    }, [tripId]);

    const fetchTripDetails = async () => {
        try {
            const response = await api.get(`/api/trips/${tripId}`);
            setTrip(response.data);
        } catch (error) {
            console.error('Error fetching trip:', error);
            toast.error('Could not load trip details');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTrip = async () => {
        setIsDeleting(true);
        try {
            await api.delete(`/api/trips/${tripId}`);
            toast.success('Trip deleted successfully');
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to delete trip:', error);
            toast.error('Failed to delete trip');
            setIsDeleting(false);
            setIsDeleteModalOpen(false); // Close on error to retry
        }
    };

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
        fetchTripDetails();
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex h-[50vh] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                </div>
            </Layout>
        );
    }

    if (!trip) return null;

    const tabs = [
        { id: 'places', label: 'Places to Visit', icon: MapPin },
        { id: 'packing', label: 'Packing List', icon: CheckSquare },
    ];

    return (
        <Layout>
            <div className="mb-8">
                <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all" onClick={() => navigate('/dashboard')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{trip.name}</h1>
                        <div className="flex items-center gap-4 text-slate-400">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" /> {trip.destination}
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" /> {trip.fromDate} - {trip.toDate}
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete Trip
                    </Button>
                </div>
            </div>

            <div className="flex space-x-1 rounded-xl bg-slate-800/50 p-1 mb-6 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            'flex items-center gap-2 w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                            'transition-all duration-200 justify-center whitespace-nowrap px-4',
                            activeTab === tab.id
                                ? 'bg-white text-indigo-700 shadow'
                                : 'text-slate-400 hover:bg-white/[0.12] hover:text-white'
                        )}
                    >
                        <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? "text-indigo-500" : "text-slate-400")} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                {activeTab === 'places' && <TripPlaces tripId={tripId} key={`places-${refreshKey}`} />}
                {activeTab === 'packing' && <TripPackingList tripId={tripId} key={`packing-${refreshKey}`} />}
            </motion.div>

            <FloatingActionButton
                icon={Sparkles}
                label="AI Guide"
                onClick={() => setIsAIModalOpen(true)}
                className="bg-gradient-to-r from-indigo-500 to-violet-600 border border-white/20 shadow-xl shadow-indigo-500/20"
            />

            <Modal
                isOpen={isAIModalOpen}
                onClose={() => setIsAIModalOpen(false)}
                title="AI Trip Assistant"
                className="max-w-4xl"
            >
                <TripAISuggestions trip={trip} onUpdate={handleRefresh} />
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
                title="Delete Trip"
                className="max-w-md"
            >
                <div className="space-y-4">
                    <p className="text-slate-300">
                        Are you sure you want to delete <span className="font-semibold text-white">{trip.name}</span>? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
                            onClick={handleDeleteTrip}
                            isLoading={isDeleting}
                        >
                            Delete Trip
                        </Button>
                    </div>
                </div>
            </Modal>
        </Layout>
    );
};

export default TripDetails;
