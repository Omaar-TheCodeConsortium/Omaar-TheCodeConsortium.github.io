import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const globalRevealProps = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
};

const BespokeSalon = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'appointments'
    const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL', 'UPCOMING', 'COMPLETED', 'CANCELLED'

    // Add Stylist Form states
    const [stylistName, setStylistName] = useState('');
    const [stylistEmail, setStylistEmail] = useState('');
    const [formSuccess, setFormSuccess] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const textLetters = Array.from("THE CODE CONSORTIUM");

    // Scroll transformations
    const { scrollY } = useScroll();
    const opacity1 = useTransform(scrollY, [200, 500], [0, 1]);
    const y1 = useTransform(scrollY, [200, 500], [100, 0]);
    const opacity2 = useTransform(scrollY, [450, 750], [0, 1]);
    const y2 = useTransform(scrollY, [450, 750], [100, 0]);
    const opacity3 = useTransform(scrollY, [700, 1000], [0, 1]);
    const y3 = useTransform(scrollY, [700, 1000], [100, 0]);

    const handleAuthorizeStylist = (e) => {
        e.preventDefault();
        if (!stylistName || !stylistEmail) return;
        setFormSuccess(true);
        setTimeout(() => {
            setStylistName('');
            setStylistEmail('');
            setFormSuccess(false);
        }, 3000);
    };

    return (
        <div className="font-sans text-slate-800 overflow-x-hidden selection:bg-indigo-600 selection:text-white bg-slate-50 min-h-screen relative">
            <Navbar theme="salon" hideOnScroll={true} /> {/* Background color synced to match footer (bg-slate-900) */}

            {/* Global Slow-drifting premium animated mesh gradient (Cool Indigo/Purple Theme - Fintech Glow Animation Logic) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none opacity-[0.50]">
                {/* Soft blue-indigo spot */}
                <motion.div
                    animate={{
                        x: [0, 80, -40, 0],
                        y: [0, 60, -90, 0],
                        scale: [1.2, 1.5, 1.1, 1.2],
                    }}
                    transition={{
                        duration: 35,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[-10%] left-[-15%] w-[1200px] h-[1200px] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.60)_0%,transparent_70%)] blur-[120px]"
                />

                {/* Soft purple spot */}
                <motion.div
                    animate={{
                        x: [0, -100, 50, 0],
                        y: [0, 90, -60, 0],
                        scale: [1.2, 1.1, 1.4, 1.2],
                    }}
                    transition={{
                        duration: 40,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[35%] right-[-15%] w-[1400px] h-[1400px] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.50)_0%,transparent_70%)] blur-[140px]"
                />

                {/* Soft cool cyan-indigo spot */}
                <motion.div
                    animate={{
                        x: [0, 60, -80, 0],
                        y: [0, -90, 70, 0],
                        scale: [1.2, 1.3, 1.15, 1.2],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute bottom-[10%] left-[15%] w-[1300px] h-[1300px] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.45)_0%,transparent_70%)] blur-[130px]"
                />
            </div>

            {/* Subtle cool-themed background grid pattern */}
            <div
                className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#5b58f40a_1px,transparent_1px),linear-gradient(to_bottom,#5b58f40a_1px,transparent_1px)] bg-[size:4rem_4rem]"
                style={{
                    maskImage: 'radial-gradient(ellipse_at_center, black, transparent 90%)',
                    WebkitMaskImage: 'radial-gradient(ellipse_at_center, black, transparent 90%)'
                }}
            />

            {/* Cool Loading Screen */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-[100] bg-slate-50 flex items-center justify-center font-mono select-none"
                    >
                        <div className="flex gap-1 overflow-hidden">
                            {textLetters.map((letter, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ y: "100%", opacity: 0 }}
                                    animate={{ y: 0, opacity: [0.2, 1, 0.2] }}
                                    transition={{
                                        y: { duration: 0.5, ease: "easeOut" },
                                        opacity: {
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: i * 0.05
                                        }
                                    }}
                                    className="text-[#5b58f4] text-xs md:text-sm tracking-widest font-black font-sans"
                                >
                                    {letter === " " ? "\u00A0" : letter}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="pt-20">
                {/* Hero Showcase Section with Backlight Starburst & Scale-in animation */}
                <section className="relative px-4 md:px-8 pt-6 md:pt-10 pb-8 md:pb-16 overflow-hidden flex items-center justify-center min-h-0 md:min-h-[90vh]">

                    {/* Cinematic Starburst Central Light Splash Effect (Cool Indigo & Purple Theme) */}
                    <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
                        <motion.div
                            initial={{ scale: 0.1, opacity: 0 }}
                            animate={isLoading ? { scale: 0.1, opacity: 0 } : { scale: [0.1, 1.8, 1.2], opacity: [0, 1, 0] }}
                            transition={{ duration: 1.6, ease: "easeOut", times: [0, 0.4, 1] }}
                            className="absolute w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle_at_center,rgba(224,231,255,0.85)_0%,rgba(91,88,244,0.35)_50%,transparent_70%)] blur-[50px]"
                        />
                        <motion.div
                            initial={{ scale: 0.2, opacity: 0 }}
                            animate={isLoading ? { scale: 0.2, opacity: 0 } : { scale: [0.2, 2.5, 1.5], opacity: [0, 0.85, 0] }}
                            transition={{ duration: 2.0, ease: "easeOut", delay: 0.05, times: [0, 0.4, 1] }}
                            className="absolute w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.25)_0%,rgba(91,88,244,0.15)_50%,transparent_70%)] blur-[90px]"
                        />
                    </div>

                    <div className="w-full max-w-[1400px] mx-auto relative z-10">
                        {/* Interactive Hero Showcase Block: Bespoke Salon Portal */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={isLoading ? { scale: 0.95, opacity: 0 } : { scale: 1, opacity: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 90,
                                damping: 20,
                                mass: 0.8,
                                delay: 0.1
                            }}
                            style={{ willChange: "transform, opacity" }}
                            className="w-full bg-white/95 backdrop-blur-md rounded-2xl border border-indigo-600/30 shadow-[0_25px_70px_-15px_rgba(91,88,244,0.08)] overflow-hidden relative z-10 flex flex-col lg:flex-row h-auto lg:h-[720px]"
                        >
                            {/* COLUMN 1: LEFT SIDEBAR (Deep Navy bg-slate-900) */}
                            <div className="w-full lg:w-[250px] bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 justify-between h-auto lg:h-full p-5 select-none text-white">
                                <div className="space-y-6">
                                    {/* Logo Area */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#5b58f4] flex items-center justify-center text-white font-black text-xl">
                                            B
                                        </div>
                                        <div>
                                            <span className="text-xl font-bold text-white tracking-tight block leading-tight">Bespoke</span>
                                            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">SALON PORTAL</span>
                                        </div>
                                    </div>

                                    {/* Navigation Links list */}
                                    <div className="flex flex-col gap-1">
                                        {[
                                            { id: 'overview', label: 'OVERVIEW', icon: 'dashboard' },
                                            { id: 'appointments', label: 'APPOINTMENTS', icon: 'calendar_month' },
                                            { id: 'retail', label: 'RETAIL ORDERS', icon: 'shopping_bag' },
                                            { id: 'warehouse', label: 'WAREHOUSE', icon: 'warehouse' },
                                            { id: 'services', label: 'SERVICES MENU', icon: 'content_cut' },
                                            { id: 'clients', label: 'CLIENT BASE', icon: 'group' }
                                        ].map((item) => {
                                            const isActive = activeTab === item.id;
                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={() => {
                                                        if (item.id === 'overview' || item.id === 'appointments') {
                                                            setActiveTab(item.id);
                                                        }
                                                    }}
                                                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-3 ${isActive
                                                        ? 'bg-[#5b58f4] text-white shadow-sm shadow-[#5b58f4]/20 font-black'
                                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                                        }`}
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                                                    <span>{item.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Bottom Footer */}
                                <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
                                    <div className="flex flex-col text-[10px] font-mono">
                                        <span className="text-slate-400">AUTHENTICATED AS</span>
                                        <span className="text-white font-bold text-xs mt-0.5">Administrator</span>
                                    </div>
                                </div>
                            </div>

                            {/* COLUMN 2 & 3 Combined Container (Frosted glass light overlay) */}
                            <div className="flex-grow flex flex-col h-auto lg:h-full bg-white/80 backdrop-blur-md">
                                {/* Top Header Bar */}
                                <div className="h-14 border-b border-slate-200 px-6 flex items-center justify-between select-none">
                                    {/* Breadcrumb */}
                                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                                        <span className="text-indigo-605 text-indigo-600 font-extrabold cursor-pointer">Dashboard</span>
                                        <span>&gt;</span>
                                        <span className="text-slate-650 capitalize">{activeTab}</span>
                                    </div>

                                    {/* Right Controls: SYNCED Badge and LOG OUT Button */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 bg-emerald-550 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                            <span>SYNCED</span>
                                        </div>
                                        <button
                                            onClick={() => { }}
                                            className="border border-red-500/25 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                                        >
                                            LOG OUT
                                        </button>
                                    </div>
                                </div>

                                {/* Main Content Panels */}
                                <div className="flex-grow p-6 flex flex-col justify-between overflow-y-auto min-h-0">

                                    {/* Tab 1: Overview View */}
                                    {activeTab === 'overview' && (
                                        <div className="space-y-6 flex-grow flex flex-col justify-between min-h-0">
                                            <div className="space-y-6">
                                                {/* Header Section */}
                                                <div>
                                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Overview</h2>
                                                    <p className="text-xs text-slate-550 text-slate-500 mt-1 font-medium">Summary of business performance, staff management, and VIP event inquiries.</p>
                                                </div>

                                                {/* Top Metric Cards (3) */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    {/* Card 1 */}
                                                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TOTAL REVENUE</span>
                                                        <span className="text-2xl font-black text-slate-800 block mt-1">$0.00</span>
                                                    </div>

                                                    {/* Card 2 */}
                                                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">COMPLETED BOOKINGS</span>
                                                        <span className="text-2xl font-black text-slate-800 block mt-1">0</span>
                                                    </div>

                                                    {/* Card 3 */}
                                                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                                                        <div>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">INVENTORY ALERTS</span>
                                                            <span className="text-2xl font-black text-slate-800 block mt-1">1</span>
                                                        </div>
                                                        <div className="mt-3 flex">
                                                            <span className="bg-red-50 text-red-600 font-bold border border-red-200 px-2 py-0.5 rounded-full text-[10px]">
                                                                1 low stock items
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Bottom Grid (2 Columns) */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* VIP Inquiries Card */}
                                                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col h-[280px]">
                                                        <div className="border-b border-slate-100 pb-3 mb-4">
                                                            <h3 className="font-bold text-slate-800 text-sm">VIP Event Inquiries</h3>
                                                        </div>
                                                        <div className="flex-grow flex flex-col items-center justify-center text-center">
                                                            <span className="material-symbols-outlined text-slate-300 text-4xl mb-2">event_busy</span>
                                                            <span className="text-slate-400 text-xs font-bold">No VIP inquiries found.</span>
                                                        </div>
                                                    </div>

                                                    {/* Add New Stylist Card */}
                                                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col h-[280px]">
                                                        <div className="border-b border-slate-100 pb-3 mb-4">
                                                            <h3 className="font-bold text-slate-800 text-sm">Add New Stylist</h3>
                                                        </div>
                                                        <form onSubmit={handleAuthorizeStylist} className="flex-grow flex flex-col justify-between">
                                                            <div className="space-y-3">
                                                                <div>
                                                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">STYLIST FULL NAME</label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="e.g. Jane Doe"
                                                                        value={stylistName}
                                                                        onChange={(e) => setStylistName(e.target.value)}
                                                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-[#5b58f4]"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">EMAIL ACCESS VECTOR</label>
                                                                    <input
                                                                        type="email"
                                                                        placeholder="jane@bespoke.com"
                                                                        value={stylistEmail}
                                                                        onChange={(e) => setStylistEmail(e.target.value)}
                                                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 outline-none focus:border-[#5b58f4]"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="submit"
                                                                className="w-full bg-slate-900 text-white hover:bg-slate-850 hover:bg-[#5b58f4] py-2 rounded-lg text-xs font-bold transition-all mt-3 block"
                                                            >
                                                                {formSuccess ? 'AUTHORIZATION ISSUED' : 'AUTHORIZE STYLIST'}
                                                            </button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Tab 2: Appointments View */}
                                    {activeTab === 'appointments' && (
                                        <div className="space-y-6 flex-grow flex flex-col justify-between min-h-0">
                                            <div className="space-y-6 flex-grow flex flex-col">
                                                {/* Header Section */}
                                                <div>
                                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Appointments</h2>
                                                    <p className="text-xs text-slate-550 text-slate-500 mt-1 font-medium">Review, approve, or cancel incoming client bookings.</p>
                                                </div>

                                                {/* Master Schedule card */}
                                                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col flex-grow min-h-[360px]">
                                                    <div className="border-b border-slate-100 pb-3 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 select-none">
                                                        <h3 className="font-bold text-slate-800 text-sm">Master Schedule</h3>

                                                        {/* Filter options tabs */}
                                                        <div className="flex bg-slate-100 rounded-lg p-0.5 self-start">
                                                            {['ALL', 'UPCOMING', 'COMPLETED', 'CANCELLED'].map((tabOpt) => (
                                                                <button
                                                                    key={tabOpt}
                                                                    onClick={() => setActiveFilter(tabOpt)}
                                                                    className={`px-3 py-1 rounded-md text-[9px] font-bold tracking-wider transition-colors ${activeFilter === tabOpt
                                                                        ? 'bg-white text-slate-900 shadow-sm'
                                                                        : 'text-slate-500 hover:text-slate-700'
                                                                        }`}
                                                                >
                                                                    {tabOpt}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Table headers with empty state container */}
                                                    <div className="flex-grow flex flex-col">
                                                        <div className="border border-slate-200 rounded-xl overflow-hidden min-h-[220px] flex flex-col overflow-x-auto">
                                                            <div className="min-w-[600px]">
                                                                <table className="w-full text-left border-collapse text-xs select-none">
                                                                    <thead>
                                                                        <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                                                                            <th className="p-3">CLIENT INFO</th>
                                                                            <th className="p-3">SERVICE ASSIGNED</th>
                                                                            <th className="p-3">DATE & TIME</th>
                                                                            <th className="p-3">STATUS</th>
                                                                            <th className="p-3 text-right">ACTIONS</th>
                                                                        </tr>
                                                                    </thead>
                                                                </table>
                                                            </div>

                                                            {/* Centered Empty State */}
                                                            <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
                                                                <span className="material-symbols-outlined text-slate-300 text-5xl mb-3">description</span>
                                                                <h4 className="text-sm font-extrabold text-slate-700">No Bookings Found</h4>
                                                                <p className="text-xs text-slate-400 mt-1 font-semibold">No appointments matched the filter tab.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Ambient Background Area below Command Center */}
                <div className="relative overflow-hidden w-full bg-transparent">

                    {/* Scroll-Reveal Section */}
                    <section
                        className="min-h-0 md:min-h-[80vh] flex flex-col justify-center relative z-10 overflow-hidden py-10 md:py-20 border-b border-indigo-500/80"
                    >
                        <div className="max-w-[1440px] w-full mx-auto px-8 md:px-16 flex flex-col items-start space-y-4">
                             <motion.span
                                style={{ opacity: opacity1, y: y1 }}
                                className="text-[#5b58f4] text-5xl md:text-7xl lg:text-9xl font-black leading-none font-sans inline-block tracking-tighter break-words"
                            >
                                Salon
                            </motion.span>
                            <motion.span
                                style={{ opacity: opacity2, y: y2 }}
                                className="text-[#5b58f4] text-5xl md:text-7xl lg:text-9xl font-black leading-none font-sans text-left inline-block tracking-tighter break-words"
                            >
                                Management
                            </motion.span>
                            <motion.span
                                style={{ opacity: opacity3, y: y3 }}
                                className="text-[#5b58f4] text-5xl md:text-7xl lg:text-9xl font-black leading-none font-sans inline-block tracking-tighter break-words"
                            >
                                System
                            </motion.span>
                        </div>
                    </section>

                    <section className="relative z-10 border-b border-indigo-500/80 bg-[radial-gradient(rgba(91,88,244,0.02)_1px,transparent_1px)] [background-size:32px_32px]">
                        <motion.div
                            className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 min-h-[600px]"
                            {...globalRevealProps}
                        >
                            {/* Left Column: Salon Technical Narratives */}
                            <div className="md:col-span-8 p-8 md:p-12 border-r border-indigo-500/80 space-y-12 md:space-y-16">
                                <div className="space-y-4">
                                    <span className="text-[10px] font-mono text-[#5b58f4] font-bold uppercase tracking-[0.4em] block">[ 01 ] REAL-TIME QUEUE MGMT</span>
                                    <h2 className="font-sans text-2xl md:text-3xl font-bold tracking-tight text-slate-800 leading-tight">Live Stylist Dispatch & Auto-Scheduling</h2>
                                    <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-2xl">
                                        Our autonomous salon scheduling system allocates client appointments dynamically based on stylist credentials, specialized cuts, and real-time chair occupancy matrices. Conflict queues reconcile in sub-second durations.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <span className="text-[10px] font-mono text-[#5b58f4] font-bold uppercase tracking-[0.4em] block">[ 02 ] SALON INTELLIGENCE</span>
                                    <h2 className="font-sans text-2xl md:text-3xl font-bold tracking-tight text-slate-800 leading-tight">Bespoke Product & Stock Management</h2>
                                    <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-2xl">
                                        Integrated alerts query formula ingredients, color developer levels, and hair treatment inventories locally. Low-stock flags push instantly to the supplier dashboard to trigger automatic replenishment flows.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <span className="text-[10px] font-mono text-[#5b58f4] font-bold uppercase tracking-[0.4em] block">[ 03 ] FINANCIAL REPORTING</span>
                                    <h2 className="font-sans text-2xl md:text-3xl font-bold tracking-tight text-slate-800 leading-tight">Dynamic Retail Sales Summary</h2>
                                    <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-2xl">
                                        Wastage parameters, stylist commission percentages, and retail orders aggregate instantly to compile visual revenue reports. Ledger matrices reduce audit cycles from monthly runs to real-time.
                                    </p>
                                </div>
                            </div>

                            {/* Right Column: Cool Light Theme POS Metadata */}
                            <div className="md:col-span-4 bg-white/[0.25] backdrop-blur-md p-8 md:p-12 space-y-10 flex flex-col justify-between">
                                <div className="border-b-2 border-slate-300 pb-6">
                                    <span className="text-[10px] font-mono text-[#5b58f4] uppercase block mb-2 tracking-[0.2em] font-bold">CLIENT</span>
                                    <span className="font-sans text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Bespoke Stylists Ltd</span>
                                </div>

                                <div className="border-b-2 border-slate-300 pb-6">
                                    <span className="text-[10px] font-mono text-[#5b58f4] uppercase block mb-2 tracking-[0.2em] font-bold">ROLE</span>
                                    <div className="space-y-1.5">
                                        <span className="font-sans text-sm md:text-base font-bold text-slate-700 block">Salon Architecture & Portal</span>
                                        <span className="font-sans text-sm md:text-base font-bold text-slate-700 block">Commission Matrix Design</span>
                                        <span className="font-sans text-sm md:text-base font-bold text-slate-700 block">Automated Refill Flows</span>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-[10px] font-mono text-[#5b58f4] uppercase block mb-4 tracking-[0.2em] font-bold">CORE TECH</span>
                                    <div className="flex flex-wrap gap-2">
                                        {['REACT.JS', 'INDEXEDDB', 'SUPABASE', 'REDIS', 'DOCKER', 'TAILWIND CSS'].map((tech) => (
                                            <span key={tech} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-600 font-mono text-[9px] uppercase tracking-wider">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </section>

                    {/* Multi-Feature Gallery: Cool Light Theme */}
                    <section className="relative z-10 px-8 md:px-16 py-16 md:py-24 bg-transparent">
                        <motion.div
                            className="max-w-[1440px] mx-auto"
                            {...globalRevealProps}
                        >
                            <div className="flex items-center gap-8 mb-16">
                                <h3 className="font-sans text-3xl md:text-5xl font-bold tracking-tight text-slate-800 whitespace-nowrap">Bespoke Core Modules</h3>
                                <div className="border-t-2 border-indigo-400/65 w-full h-0"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Feature 1: Retail Orders */}
                                <motion.div
                                    className="group bg-white border border-slate-200 rounded-2xl p-5 md:p-6 hover:border-indigo-400/50 transition-all duration-500 hover:bg-indigo-50/10 shadow-sm flex flex-col justify-between"
                                    {...globalRevealProps}
                                >
                                    <div className="mb-6 overflow-hidden rounded-xl border border-slate-100 relative aspect-[16/10] bg-slate-50 p-4">
                                        <img alt="Retail Orders" className="w-full h-full object-contain grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" src="/bespoke-retail.png" />
                                        <div className="absolute inset-0 bg-indigo-900/5 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
                                    </div>
                                    <div className="flex justify-between items-start border-l border-indigo-500/40 pl-5 mb-1">
                                        <div>
                                            <span className="text-[10px] font-mono text-[#5b58f4] uppercase tracking-[0.3em] block mb-1.5">01 / RETAIL</span>
                                            <h4 className="font-sans text-lg md:text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug">Retail Orders</h4>
                                            <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">Process product purchases, manage counter fulfillment, and track retail boutique orders.</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Feature 2: Warehouse */}
                                <motion.div
                                    className="group bg-white border border-slate-200 rounded-2xl p-5 md:p-6 hover:border-indigo-400/50 transition-all duration-500 hover:bg-indigo-50/10 shadow-sm flex flex-col justify-between"
                                    {...globalRevealProps}
                                >
                                    <div className="mb-6 overflow-hidden rounded-xl border border-slate-100 relative aspect-[16/10] bg-slate-50 p-4">
                                        <img alt="Warehouse" className="w-full h-full object-contain grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" src="/bespoke-warehouse.png" />
                                        <div className="absolute inset-0 bg-indigo-900/5 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
                                    </div>
                                    <div className="flex justify-between items-start border-l border-indigo-500/40 pl-5 mb-1">
                                        <div>
                                            <span className="text-[10px] font-mono text-[#5b58f4] uppercase tracking-[0.3em] block mb-1.5">02 / WAREHOUSE</span>
                                            <h4 className="font-sans text-lg md:text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug">Warehouse</h4>
                                            <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">Centralized inventory control, product stock levels, developer fluids, and automatic supplier replenishment.</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Feature 3: Services Menu */}
                                <motion.div
                                    className="group bg-white border border-slate-200 rounded-2xl p-5 md:p-6 hover:border-indigo-400/50 transition-all duration-500 hover:bg-indigo-50/10 shadow-sm flex flex-col justify-between"
                                    {...globalRevealProps}
                                >
                                    <div className="mb-6 overflow-hidden rounded-xl border border-slate-100 relative aspect-[16/10] bg-slate-50 p-4">
                                        <img alt="Services Menu" className="w-full h-full object-contain grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" src="/bespoke-services.png" />
                                        <div className="absolute inset-0 bg-indigo-900/5 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
                                    </div>
                                    <div className="flex justify-between items-start border-l border-indigo-500/40 pl-5 mb-1">
                                        <div>
                                            <span className="text-[10px] font-mono text-[#5b58f4] uppercase tracking-[0.3em] block mb-1.5">03 / SERVICES</span>
                                            <h4 className="font-sans text-lg md:text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug">Services Menu</h4>
                                            <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">Manage catalog treatments, cut specifications, styling packages, and active pricing tables.</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Feature 4: Client Base */}
                                <motion.div
                                    className="group bg-white border border-slate-200 rounded-2xl p-5 md:p-6 hover:border-indigo-400/50 transition-all duration-500 hover:bg-indigo-50/10 shadow-sm flex flex-col justify-between"
                                    {...globalRevealProps}
                                >
                                    <div className="mb-6 overflow-hidden rounded-xl border border-slate-100 relative aspect-[16/10] bg-slate-50 p-4">
                                        <img alt="Client Base" className="w-full h-full object-contain grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" src="/bespoke-client.png" />
                                        <div className="absolute inset-0 bg-indigo-900/5 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
                                    </div>
                                    <div className="flex justify-between items-start border-l border-indigo-500/40 pl-5 mb-1">
                                        <div>
                                            <span className="text-[10px] font-mono text-[#5b58f4] uppercase tracking-[0.3em] block mb-1.5">04 / CRM</span>
                                            <h4 className="font-sans text-lg md:text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug">Client Base</h4>
                                            <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">Maintains customer style registries, service formulas, upcoming bookings, and appointment histories.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </section>
                </div>
            </main>

            {/* Modernized Bottom Showcase Section */}
            <section className="relative z-10 py-12 mt-12 border-t border-indigo-200/40 bg-white/40 backdrop-blur-sm">
                <div className="max-w-[1400px] mx-auto px-6 md:px-8">
                    <motion.div
                        className="mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-800 font-sans">
                            Project Showcase
                        </h2>
                        <p className="font-sans text-sm md:text-base leading-relaxed tracking-wide text-slate-500 mt-4 max-w-xl">
                            A selection of other engineered platforms and high-performance digital assets built for modern enterprises.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Card 1: BakeryOS Cashier Portal */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <Link
                                to="/project/bakery-os"
                                className="group block bg-white/80 hover:bg-white border border-slate-200 hover:border-indigo-400 rounded-2xl p-6 transition-all duration-500 hover:shadow-[0_15px_40px_rgba(91,88,244,0.06)] flex flex-col justify-between h-[360px]"
                            >
                                <div className="overflow-hidden rounded-xl border border-slate-100 relative aspect-[16/9] mb-6">
                                    <img
                                        alt="BakeryOS Cashier Portal"
                                        className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                                        src="/bakery-showcase.png"
                                    />
                                    <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors duration-500"></div>
                                </div>
                                <div className="flex justify-between items-end border-l border-indigo-500/40 pl-4 mt-auto">
                                    <div>
                                        <span className="text-[9px] font-mono text-[#5b58f4] uppercase tracking-[0.2em] block mb-1">CASE STUDY / 01</span>
                                        <h3 className="font-sans text-xl font-bold text-slate-800 group-hover:text-[#5b58f4] transition-colors leading-snug">
                                            BakeryOS Cashier Portal
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-sm">
                                            A high-performance fintech point-of-sale interface for real-time stock and billing.
                                        </p>
                                    </div>
                                    <span className="material-symbols-outlined text-[#5b58f4] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                                        arrow_outward
                                    </span>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Card 2: HRIS Command Center */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                        >
                            <Link
                                to="/project/hris-command-center"
                                className="group block bg-white/80 hover:bg-white border border-slate-200 hover:border-indigo-400 rounded-2xl p-6 transition-all duration-500 hover:shadow-[0_15px_40px_rgba(91,88,244,0.06)] flex flex-col justify-between h-[360px]"
                            >
                                <div className="overflow-hidden rounded-xl border border-slate-100 relative aspect-[16/9] mb-6">
                                    <img
                                        alt="HRIS Command Center"
                                        className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                                        src="/image(5).png"
                                    />
                                    <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors duration-500"></div>
                                </div>
                                <div className="flex justify-between items-end border-l border-indigo-500/40 pl-4 mt-auto">
                                    <div>
                                        <span className="text-[9px] font-mono text-[#5b58f4] uppercase tracking-[0.2em] block mb-1">CASE STUDY / 02</span>
                                        <h3 className="font-sans text-xl font-bold text-slate-800 group-hover:text-[#5b58f4] transition-colors leading-snug">
                                            HRIS Command Center
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-sm">
                                            A comprehensive employee management system and HR architecture dashboard tracking operations and activity timelines.
                                        </p>
                                    </div>
                                    <span className="material-symbols-outlined text-[#5b58f4] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                                        arrow_outward
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer theme="salon" />
        </div>
    );
};

export default BespokeSalon;