import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, Save, AlertTriangle } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { toast } from 'react-hot-toast';

const EditProfile = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();

    // mode: null | 'username' | 'password'
    const [mode, setMode] = useState(null);

    // confirmation modal
    const [confirmAction, setConfirmAction] = useState(null); 
    // 'username' | 'password' | null

    // Username state
    const [newUsername, setNewUsername] = useState('');
    const [isUsernameLoading, setIsUsernameLoading] = useState(false);

    // Password state
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    useEffect(() => {
        if (isOpen && user) {
            setMode(null);
            setConfirmAction(null);
            setNewUsername(user.username);
            setPasswordData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    }, [isOpen, user]);

    // =======================
    // CONFIRMED ACTIONS
    // =======================

    const confirmUsernameUpdate = async () => {
        setConfirmAction(null);
        setIsUsernameLoading(true);

        try {
            await api.put('/api/auth/username', {
                newUsername: newUsername.trim()
            });
            toast.success('Username updated. Please login again.');
            onClose();
            logout();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update username');
        } finally {
            setIsUsernameLoading(false);
        }
    };

    const confirmPasswordUpdate = async () => {
        setConfirmAction(null);
        setIsPasswordLoading(true);

        try {
            await api.put('/api/auth/password', {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            toast.success('Password updated successfully');
            setPasswordData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setMode(null);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setIsPasswordLoading(false);
        }
    };

    // =======================
    // SUBMIT HANDLERS
    // =======================

    const handleUsernameSubmit = (e) => {
        e.preventDefault();

        if (newUsername.trim() === user.username) {
            toast.error('New username is same as current');
            return;
        }

        setConfirmAction('username');
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setConfirmAction('password');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Slide-over Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-50 w-full md:w-96 bg-slate-900 border-l border-white/10 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <h2 className="text-xl font-bold text-white">
                                Edit Profile
                            </h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="rounded-full text-slate-400 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">

                            {/* Current User */}
                            <div className="rounded-lg bg-white/5 p-4 border border-white/10">
                                <p className="text-sm text-slate-400">Logged in as</p>
                                <p className="text-lg font-semibold text-white">
                                    {user?.username}
                                </p>
                            </div>

                            {/* Action Selector */}
                            {!mode && (
                                <div className="space-y-4">
                                    <Button
                                        variant="secondary"
                                        className="w-full"
                                        onClick={() => setMode('username')}
                                    >
                                        <User className="h-4 w-4 mr-2" />
                                        Change Username
                                    </Button>

                                    <Button
                                        variant="secondary"
                                        className="w-full"
                                        onClick={() => setMode('password')}
                                    >
                                        <Lock className="h-4 w-4 mr-2" />
                                        Change Password
                                    </Button>
                                </div>
                            )}

                            {/* Username Form */}
                            {mode === 'username' && (
                                <form onSubmit={handleUsernameSubmit} className="space-y-6">
                                    <Input
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        placeholder="New username"
                                        required
                                    />

                                    <div className="flex gap-3">
                                        <Button
                                            type="submit"
                                            isLoading={isUsernameLoading}
                                            className="flex-1"
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            Update Username
                                        </Button>
                                        <Button variant="ghost" onClick={() => setMode(null)}>
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            )}

                            {/* Password Form */}
                            {mode === 'password' && (
                                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                    <Input
                                        type="password"
                                        placeholder="Current password"
                                        value={passwordData.oldPassword}
                                        onChange={(e) =>
                                            setPasswordData({ ...passwordData, oldPassword: e.target.value })
                                        }
                                        required
                                    />
                                    <Input
                                        type="password"
                                        placeholder="New password"
                                        value={passwordData.newPassword}
                                        onChange={(e) =>
                                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                                        }
                                        required
                                    />
                                    <Input
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) =>
                                            setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                                        }
                                        required
                                    />

                                    <div className="flex gap-3 pt-2">
                                        <Button
                                            type="submit"
                                            isLoading={isPasswordLoading}
                                            className="flex-1"
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            Update Password
                                        </Button>
                                        <Button variant="ghost" onClick={() => setMode(null)}>
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>

                    {/* Confirmation Modal */}
                    <AnimatePresence>
                        {confirmAction && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="fixed inset-0 z-[60] flex items-center justify-center"
                            >
                                <div className="bg-slate-900 border border-white/10 rounded-xl p-6 w-[90%] max-w-sm shadow-xl">
                                    <div className="flex items-center gap-3 mb-4">
                                        <AlertTriangle className="text-yellow-400" />
                                        <h3 className="text-lg font-semibold text-white">
                                            Confirm Action
                                        </h3>
                                    </div>

                                    <p className="text-slate-300 text-sm mb-6">
                                        {confirmAction === 'username'
                                            ? 'Changing your username will log you out. Do you want to continue?'
                                            : 'Are you sure you want to change your password?'}
                                    </p>

                                    <div className="flex gap-3">
                                        <Button
                                            className="flex-1"
                                            onClick={
                                                confirmAction === 'username'
                                                    ? confirmUsernameUpdate
                                                    : confirmPasswordUpdate
                                            }
                                        >
                                            Confirm
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => setConfirmAction(null)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </AnimatePresence>
    );
};

export default EditProfile;
