import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export const FloatingActionButton = ({ onClick, icon: Icon, label, className }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={cn(
                "fixed bottom-8 right-8 z-40 flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-colors",
                className
            )}
        >
            {Icon && <Icon className="h-5 w-5" />}
            {label && <span className="font-medium">{label}</span>}
        </motion.button>
    );
};
