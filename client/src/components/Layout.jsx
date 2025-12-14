import React from 'react';
import Navbar from './Navbar';


const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-transparent text-slate-100 font-sans selection:bg-indigo-500/30">
            <Navbar />
            <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
                {children}
            </main>
        </div>
    );
};

export default Layout;
