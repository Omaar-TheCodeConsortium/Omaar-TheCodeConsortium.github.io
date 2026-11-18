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

const BakeryDashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('billing'); // 'billing', 'stock', 'wastage', 'sales', 'discount', 'notification'

    // Mock products for the cashier portal
    const [products, setProducts] = useState([
        { id: 'P001', name: 'Premium Croissant', category: 'Bakery', price: 120.00, stock: 45 },
        { id: 'P002', name: 'Chocolate Sourdough', category: 'Bakery', price: 180.00, stock: 20 },
        { id: 'P003', name: 'Blueberry Swirl Danish', category: 'Bakery', price: 150.00, stock: 30 },
        { id: 'P004', name: 'Bagel with Cream Cheese', category: 'Bakery', price: 90.00, stock: 15 }
    ]);

    const [cart, setCart] = useState([]);
    const [billingSearch, setBillingSearch] = useState('');
    const [discountType, setDiscountType] = useState('none');
    const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash', 'card'
    const [previousBill, setPreviousBill] = useState(null);

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

    // Cart handlers
    const addToCart = (product) => {
        if (product.stock <= 0) return;
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) return prev;
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQty = (id, newQty) => {
        const prod = products.find(p => p.id === id);
        if (!prod || newQty < 1 || newQty > prod.stock) return;
        setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    // Computations
    const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discountAmt = 0;
    if (discountType === '10%') discountAmt = cartSubtotal * 0.1;
    else if (discountType === '20%') discountAmt = cartSubtotal * 0.2;
    else if (discountType === '50') discountAmt = Math.min(cartSubtotal, 50);

    const totalPayable = Math.max(0, cartSubtotal - discountAmt);

    const handleCheckout = () => {
        if (cart.length === 0) return;

        // Update stock
        setProducts(prev =>
            prev.map(p => {
                const item = cart.find(c => c.id === p.id);
                return item ? { ...p, stock: Math.max(0, p.stock - item.quantity) } : p;
            })
        );

        setPreviousBill({
            billId: 'BILL-1001',
            itemsCount: cart.reduce((sum, i) => sum + i.quantity, 0),
            total: totalPayable,
            paymentMethod: paymentMethod,
            timestamp: new Date().toLocaleTimeString()
        });

        setCart([]);
        setDiscountType('none');
    };

    // Filter products based on search
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(billingSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(billingSearch.toLowerCase())
    );

    return (
        <div className="font-sans text-slate-800 overflow-x-hidden selection:bg-orange-600 selection:text-white bg-[#FFFEFB] min-h-screen relative">
            <Navbar theme="light-fintech" hideOnScroll={true} />

            {/* Global Slow-drifting premium animated mesh gradient (Aurora effect) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none opacity-[0.35]">
                {/* Soft peach spot */}
                <motion.div
                    animate={{
                        x: [0, 80, -40, 0],
                        y: [0, 60, -90, 0],
                        scale: [1, 1.25, 0.9, 1],
                    }}
                    transition={{
                        duration: 35,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[-10%] left-[-15%] w-[1000px] h-[1000px] rounded-full bg-[radial-gradient(circle_at_center,rgba(224,120,90,0.75)_0%,transparent_70%)] blur-[120px]"
                />

                {/* Soft amber spot */}
                <motion.div
                    animate={{
                        x: [0, -100, 50, 0],
                        y: [0, 90, -60, 0],
                        scale: [1, 0.9, 1.15, 1],
                    }}
                    transition={{
                        duration: 40,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[35%] right-[-15%] w-[1200px] h-[1200px] rounded-full bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.75)_0%,transparent_70%)] blur-[140px]"
                />

                {/* Soft vibrant orange spot */}
                <motion.div
                    animate={{
                        x: [0, 60, -80, 0],
                        y: [0, -90, 70, 0],
                        scale: [1, 1.1, 0.95, 1],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute bottom-[10%] left-[15%] w-[1100px] h-[1100px] rounded-full bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.70)_0%,transparent_70%)] blur-[130px]"
                />
            </div>

            {/* Subtle light-themed background grid pattern */}
            <div
                className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#ea580c10_1px,transparent_1px),linear-gradient(to_bottom,#ea580c10_1px,transparent_1px)] bg-[size:4rem_4rem]"
                style={{
                    maskImage: 'radial-gradient(ellipse_at_center, black, transparent 90%)',
                    WebkitMaskImage: 'radial-gradient(ellipse_at_center, black, transparent 90%)'
                }}
            />

            {/* Custom light warm loading screen */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-[100] bg-[#FFFEFB] flex items-center justify-center font-mono select-none"
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
                                    className="text-orange-600 text-xs md:text-sm tracking-widest font-black font-sans"
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

                    {/* Cinematic Starburst Central Light Splash Effect (Warm Peach & Orange Theme) */}
                    <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
                        <motion.div
                            initial={{ scale: 0.1, opacity: 0 }}
                            animate={isLoading ? { scale: 0.1, opacity: 0 } : { scale: [0.1, 1.8, 1.2], opacity: [0, 1, 0] }}
                            transition={{ duration: 1.6, ease: "easeOut", times: [0, 0.4, 1] }}
                            className="absolute w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle_at_center,rgba(254,215,170,0.85)_0%,rgba(251,146,60,0.4)_50%,transparent_70%)] blur-[50px]"
                        />
                        <motion.div
                            initial={{ scale: 0.2, opacity: 0 }}
                            animate={isLoading ? { scale: 0.2, opacity: 0 } : { scale: [0.2, 2.5, 1.5], opacity: [0, 0.85, 0] }}
                            transition={{ duration: 2.0, ease: "easeOut", delay: 0.05, times: [0, 0.4, 1] }}
                            className="absolute w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.3)_0%,rgba(234,88,12,0.15)_50%,transparent_70%)] blur-[90px]"
                        />
                    </div>

                    <div className="w-full max-w-[1400px] mx-auto relative z-10">
                        {/* Interactive Hero Showcase Block: 3-Column Dashboard Layout */}
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
                            className="w-full bg-white/90 backdrop-blur-md rounded-2xl border border-orange-600/60 shadow-[0_25px_70px_-15px_rgba(234,88,12,0.08)] overflow-hidden relative z-10 flex flex-col lg:flex-row h-auto lg:h-[720px]"
                        >
                            {/* COLUMN 1: LEFT SIDEBAR (Fixed width, ~250px) */}
                            <div className="w-full lg:w-[250px] bg-[#FFF6ED]/85 backdrop-blur-md border-r border-orange-200/50 flex flex-col flex-shrink-0 justify-between h-auto lg:h-full p-5 select-none">
                                <div className="space-y-6">
                                    {/* BakeryOS Logo with Orange Bread Icon */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                                            <span className="material-symbols-outlined text-2xl font-bold">bakery_dining</span>
                                        </div>
                                        <div>
                                            <span className="text-xl font-bold text-gray-900 tracking-tight block leading-tight">BakeryOS</span>
                                            <span className="text-sm text-gray-500">Cashier Portal</span>
                                        </div>
                                    </div>

                                    {/* Nav Items list */}
                                    <div className="flex flex-col gap-1">
                                        {[
                                            { id: 'billing', label: 'Billing', icon: 'receipt_long' },
                                            { id: 'stock', label: 'Stock', icon: 'inventory_2' },
                                            { id: 'wastage', label: 'Wastage', icon: 'delete_sweep' },
                                            { id: 'sales', label: 'Sales History', icon: 'history' },
                                            { id: 'discount', label: 'Discount', icon: 'percent' },
                                            { id: 'notification', label: 'Notification', icon: 'notifications', badge: '2' }
                                        ].map((item) => {
                                            const isActive = activeTab === item.id;
                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={() => {
                                                        setActiveTab(item.id);
                                                    }}
                                                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-between ${isActive
                                                        ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/20 font-black'
                                                        : 'text-[#5c4033] hover:bg-orange-50/50'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                                                        <span>{item.label}</span>
                                                    </div>
                                                    {item.badge && (
                                                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${isActive ? 'bg-white text-orange-600' : 'bg-orange-100 text-orange-700'
                                                            }`}>
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Bottom Sign Out */}
                                <div className="pt-4 border-t border-orange-200/40">
                                    <button
                                        onClick={() => { }}
                                        className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                                    >
                                        <span className="material-symbols-outlined text-[18px] text-red-600">logout</span>
                                        <span className="text-red-600">Sign Out</span>
                                    </button>
                                </div>
                            </div>

                            {/* COLUMN 2: MAIN CONTENT AREA (Flexible width, Billing View) */}
                            <div className="flex-grow flex flex-col h-auto lg:h-full border-r border-orange-200/50 bg-white/80 backdrop-blur-md">
                                {/* Top Header Bar */}
                                <div className="h-14 border-b border-orange-200/40 px-6 flex items-center justify-between select-none">
                                    {/* Breadcrumb */}
                                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                                        <span className="text-orange-600 font-extrabold cursor-pointer">Dashboard</span>
                                        <span>&gt;</span>
                                        <span className="text-slate-600 capitalize">{activeTab}</span>
                                    </div>

                                    {/* Notification & User Profile info */}
                                    <div className="flex items-center gap-4">
                                        <div className="relative cursor-pointer">
                                            <span className="material-symbols-outlined text-slate-400 text-xl hover:text-slate-600">notifications</span>
                                            <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-black">2</span>
                                        </div>
                                        <div className="flex items-center gap-2 border-l border-orange-200/30 pl-4">
                                            <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-black text-xs">gg</div>
                                            <span className="text-xs font-bold text-slate-700">Billing Portal</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Billing View Section */}
                                {activeTab === 'billing' && (
                                    <div className="flex-grow p-6 flex flex-col justify-between overflow-y-auto min-h-0">
                                        <div className="space-y-5 min-h-0 flex flex-col">
                                            {/* Title Bar */}
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-xl font-black text-slate-900 tracking-tight capitalize">{activeTab}</h2>
                                                <button className="flex items-center gap-1.5 bg-emerald-550 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                                                    <span className="material-symbols-outlined text-[14px]">lock_open</span>
                                                    <span>Open Counter</span>
                                                </button>
                                            </div>

                                            {/* Search & Active All filter */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 bg-[#FFFDF9] border border-orange-200/50 px-4 py-2.5 rounded-xl">
                                                    <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
                                                    <input
                                                        type="text"
                                                        placeholder="Search products..."
                                                        value={billingSearch}
                                                        onChange={(e) => {
                                                            setBillingSearch(e.target.value);
                                                        }}
                                                        className="bg-transparent border-none outline-none text-xs w-full text-slate-700 placeholder-slate-400 font-medium"
                                                    />
                                                </div>
                                                <div className="flex">
                                                    <button className="px-4 py-1.5 bg-orange-600 text-white font-extrabold rounded-lg text-[10px] uppercase tracking-wider shadow-sm shadow-orange-600/10">All</button>
                                                </div>
                                            </div>

                                            {/* Data Table */}
                                            <div className="flex-grow overflow-y-auto border border-orange-200/50 rounded-xl min-h-[160px] bg-slate-50/20 overflow-x-auto">
                                                <div className="min-w-[600px]">
                                                    <table className="w-full text-left border-collapse text-xs">
                                                    <thead>
                                                        <tr className="bg-orange-50/30 text-orange-950 font-bold border-b border-orange-200/30">
                                                            <th className="p-3">Item ID</th>
                                                            <th className="p-3">Item Name</th>
                                                            <th className="p-3">Stock Qty</th>
                                                            <th className="p-3">Price</th>
                                                            <th className="p-3 text-right">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-orange-200/30 font-medium text-slate-600">
                                                        {filteredProducts.map(p => (
                                                            <tr key={p.id} className="hover:bg-orange-50/10 transition-colors bg-white">
                                                                <td className="p-3 font-mono font-bold text-slate-500">{p.id}</td>
                                                                <td className="p-3 text-slate-800 font-semibold">{p.name}</td>
                                                                <td className="p-3">
                                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.stock <= 0 ? 'bg-red-50 text-red-500' : p.stock < 20 ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'
                                                                        }`}>
                                                                        {p.stock} units
                                                                    </span>
                                                                </td>
                                                                <td className="p-3 text-slate-800">Rs. {p.price.toFixed(2)}</td>
                                                                <td className="p-3 text-right">
                                                                    <button
                                                                        onClick={() => {
                                                                            addToCart(p);
                                                                        }}
                                                                        disabled={p.stock <= 0}
                                                                        className="px-2.5 py-1 bg-orange-600 text-white rounded-md text-[10px] font-bold hover:bg-orange-700 transition-colors disabled:bg-slate-200 disabled:text-slate-400"
                                                                    >
                                                                        Add +
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                                {/* Large Empty State (Show when filtered items empty) */}
                                                {filteredProducts.length === 0 && (
                                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                                        <span className="material-symbols-outlined text-slate-300 text-4xl mb-2">inventory_2</span>
                                                        <span className="text-slate-400 text-xs font-bold">No products found</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Bottom Card: Previous Bill Summary */}
                                        <div className="mt-4 bg-[#FFFDF9] border border-orange-200/50 rounded-xl p-4 flex flex-col justify-between">
                                            <span className="text-[9px] font-bold text-orange-950/80 uppercase tracking-widest block mb-2">Previous Bill Summary</span>
                                            {previousBill ? (
                                                <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                                                    <div>
                                                        <span className="font-bold text-slate-800">Bill ID:</span> {previousBill.billId} ({previousBill.itemsCount} items)
                                                    </div>
                                                    <div className="font-extrabold text-orange-600">
                                                        Rs. {previousBill.total.toFixed(2)} ({previousBill.paymentMethod.toUpperCase()})
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 text-xs font-semibold italic">No previous bill yet</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Stock Tab Layout */}
                                {activeTab === 'stock' && (
                                    <div className="flex-grow p-6 flex flex-col justify-between overflow-y-auto min-h-0">
                                        <div className="space-y-5 min-h-0 flex flex-col">
                                            {/* Header */}
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <h2 className="text-xl font-black text-orange-650 text-orange-600 tracking-tight">Stock Management</h2>
                                                </div>
                                                <div className="flex">
                                                    <span className="bg-orange-50 text-orange-600 font-bold border border-orange-200/50 rounded-lg px-3.5 py-1.5 text-xs">
                                                        Products
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Filter Bar */}
                                            <div className="flex flex-col md:flex-row md:items-center gap-3 bg-[#FFFDF9] border border-orange-200/50 p-4 rounded-xl text-xs">
                                                <div className="flex items-center gap-2 bg-[#FFFDF9] border border-orange-200/40 px-3 py-2 rounded-xl flex-grow">
                                                    <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
                                                    <input
                                                        type="text"
                                                        placeholder="Search items by name or ID."
                                                        className="bg-transparent border-none outline-none text-xs w-full text-slate-700 placeholder-slate-400 font-medium"
                                                        disabled
                                                    />
                                                </div>
                                                <select className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-bold outline-none" disabled>
                                                    <option>All Categories</option>
                                                </select>
                                                <select className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-bold outline-none" disabled>
                                                    <option>Name A-Z</option>
                                                </select>
                                                <button className="flex items-center gap-1.5 text-slate-400 hover:text-orange-600 transition-colors font-bold px-2 py-2" disabled>
                                                    <span className="material-symbols-outlined text-[16px]">sync</span>
                                                    <span>Reset Filters</span>
                                                </button>
                                            </div>

                                            {/* Table Area */}
                                            <div className="space-y-2 flex flex-col flex-grow min-h-0">
                                                <div className="flex justify-end">
                                                    <button className="flex items-center gap-1.5 bg-orange-50 border border-orange-200/50 hover:bg-orange-100/50 text-orange-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors" disabled>
                                                        <span className="material-symbols-outlined text-[14px]">refresh</span>
                                                        <span>Refresh</span>
                                                    </button>
                                                </div>

                                                <div className="flex-grow overflow-y-auto border border-orange-200/50 rounded-xl min-h-[160px] bg-slate-50/20 overflow-x-auto">
                                                    <div className="min-w-[600px]">
                                                        <table className="w-full text-left border-collapse text-xs">
                                                        <thead>
                                                            <tr className="bg-orange-50 text-orange-700 font-bold border-b border-orange-200/40">
                                                                <th className="p-3">Item ID</th>
                                                                <th className="p-3">Item Name</th>
                                                                <th className="p-3">Category</th>
                                                                <th className="p-3">Price</th>
                                                                <th className="p-3">Cost</th>
                                                                <th className="p-3">Quantity</th>
                                                                <th className="p-3 text-right">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-orange-200/30 font-medium text-slate-600">
                                                            {products.map(p => (
                                                                <tr key={p.id} className="hover:bg-orange-50/10 transition-colors bg-white">
                                                                    <td className="p-3 font-mono font-bold text-slate-500">{p.id}</td>
                                                                    <td className="p-3 text-slate-800 font-semibold">{p.name}</td>
                                                                    <td className="p-3 capitalize">{p.category || 'Bakery'}</td>
                                                                    <td className="p-3">Rs. {p.price.toFixed(2)}</td>
                                                                    <td className="p-3 text-slate-400">Rs. {(p.price * 0.55).toFixed(2)}</td>
                                                                    <td className="p-3">
                                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.stock <= 0 ? 'bg-red-50 text-red-500' : p.stock < 20 ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'
                                                                            }`}>
                                                                            {p.stock} units
                                                                        </span>
                                                                    </td>
                                                                    <td className="p-3 text-right">
                                                                        <button className="px-2.5 py-1 bg-orange-100 hover:bg-orange-200/80 text-orange-700 rounded-md text-[10px] font-bold transition-colors" disabled>
                                                                            Restock
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="mt-4 pt-4 border-t border-orange-200/40 space-y-3">
                                            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
                                                <span className="text-slate-400 font-semibold">
                                                    Showing 0 to 0 of 0 entries
                                                </span>
                                                <div className="flex items-center gap-2 text-slate-650 font-bold">
                                                    <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded text-[10px] transition-colors disabled:opacity-50" disabled>
                                                        Previous
                                                    </button>
                                                    <span className="text-[10px] text-slate-500">Page 1 of 0</span>
                                                    <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded text-[10px] transition-colors disabled:opacity-50" disabled>
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex">
                                                <button className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100/50 px-3.5 py-1.5 rounded-lg border border-orange-200/50 transition-colors">
                                                    View Categories
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Wastage Tab Layout */}
                                {activeTab === 'wastage' && (
                                    <div className="flex-grow p-6 flex flex-col justify-between overflow-y-auto min-h-0">
                                        <div className="space-y-6 min-h-0 flex flex-col">
                                            {/* Summary Cards */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {/* Card 1 */}
                                                <div className="bg-red-50/50 border border-red-200/50 rounded-xl p-4 flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                                                        <span className="material-symbols-outlined text-xl font-bold">trending_down</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-bold text-red-700/80 uppercase tracking-wider block">Total Loss Today</span>
                                                        <span className="text-sm font-extrabold text-red-600 block mt-0.5">Rs. 0 (Products)</span>
                                                    </div>
                                                </div>

                                                {/* Card 2 */}
                                                <div className="bg-orange-50/50 border border-orange-200/50 rounded-xl p-4 flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
                                                        <span className="material-symbols-outlined text-orange-600 text-xl font-bold">delete_sweep</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-bold text-orange-700/80 uppercase tracking-wider block">Total Wasted Qty</span>
                                                        <span className="text-sm font-extrabold text-orange-600 block mt-0.5">0 (Products)</span>
                                                    </div>
                                                </div>

                                                {/* Card 3 */}
                                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                                                        <span className="material-symbols-outlined text-xl font-bold">assignment_late</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Most Wasted Item</span>
                                                        <span className="text-sm font-extrabold text-slate-700 block mt-0.5">—</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Filter Bar */}
                                            <div className="flex flex-col md:flex-row md:items-center gap-3 bg-[#FFFDF9] border border-orange-200/50 p-4 rounded-xl text-xs">
                                                <div className="flex items-center gap-2 bg-[#FFFDF9] border border-orange-200/40 px-3 py-2 rounded-xl flex-grow">
                                                    <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
                                                    <input
                                                        type="text"
                                                        placeholder="Search items..."
                                                        className="bg-transparent border-none outline-none text-xs w-full text-slate-700 placeholder-slate-400 font-medium"
                                                        disabled
                                                    />
                                                </div>
                                                {/* Date Range Section */}
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="text-slate-500 font-bold">Date Range:</span>
                                                    <input type="date" className="bg-white border border-slate-200 rounded-xl px-2 py-1 text-slate-705 text-xs outline-none" disabled />
                                                    <span className="text-slate-400 font-bold">to</span>
                                                    <input type="date" className="bg-white border border-slate-200 rounded-xl px-2 py-1 text-slate-705 text-xs outline-none" disabled />
                                                </div>
                                                <select className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-bold outline-none" disabled>
                                                    <option>All Time</option>
                                                </select>
                                                <select className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-bold outline-none" disabled>
                                                    <option>All Reasons</option>
                                                </select>
                                                <button className="flex items-center gap-1.5 text-slate-400 hover:text-orange-600 transition-colors font-bold px-2 py-2" disabled>
                                                    <span className="material-symbols-outlined text-[16px]">sync</span>
                                                    <span>Reset Filters</span>
                                                </button>
                                            </div>

                                            {/* Table Area (Product Wastage Container) */}
                                            <div className="flex-grow flex flex-col border border-orange-200/50 rounded-xl overflow-hidden min-h-[220px] bg-white">
                                                {/* Header */}
                                                <div className="bg-orange-50/70 border-b border-orange-200/40 px-4 py-3 flex items-center justify-between">
                                                    <span className="text-xs font-black text-orange-950">Product Wastage</span>
                                                </div>
                                                {/* Centered Empty State */}
                                                <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-slate-50/10">
                                                    <span className="material-symbols-outlined text-slate-400 text-5xl mb-3">inventory_2</span>
                                                    <h4 className="text-sm font-extrabold text-slate-800 mb-1">No product wastage records found</h4>
                                                    <p className="text-xs text-slate-400 font-medium">Products wasted will appear here</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Placeholder for non-built views */}
                                {activeTab !== 'billing' && activeTab !== 'stock' && activeTab !== 'wastage' && (
                                    <div className="flex-grow p-6 flex flex-col items-center justify-center text-center">
                                        <span className="material-symbols-outlined text-slate-300 text-5xl mb-3">info</span>
                                        <h4 className="text-sm font-extrabold text-slate-800 mb-1">Module Coming Soon</h4>
                                        <p className="text-xs text-slate-400">This screen is not part of the prototype.</p>
                                    </div>
                                )}
                            </div>

                            {/* COLUMN 3: RIGHT PANEL (Current Bill / Checkout, Fixed width, ~350px) */}
                            <div className="w-full lg:w-[350px] bg-white/85 backdrop-blur-md flex flex-col justify-between h-auto lg:h-full p-5 text-slate-800">
                                <div className="flex flex-col gap-4 min-h-0 flex-grow">
                                    <span className="text-xs font-black text-slate-800 border-b border-orange-200/40 pb-3 block">Current Bill #BILL-1001</span>

                                    {/* Cart list / Empty state */}
                                    <div className="flex-grow overflow-y-auto max-h-[340px] pr-1 space-y-3">
                                        {cart.map(item => (
                                            <div key={item.id} className="flex justify-between items-center gap-2 text-xs border-b border-orange-200/25 pb-2 font-medium">
                                                <div className="flex-grow">
                                                    <div className="text-slate-800 font-semibold truncate w-36">{item.name}</div>
                                                    <div className="text-slate-400 text-[10px]">Rs. {item.price.toFixed(2)} each</div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => updateQty(item.id, item.quantity - 1)}
                                                        className="w-5 h-5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded flex items-center justify-center font-bold text-xs"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-6 text-center font-bold text-slate-800 text-[11px]">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQty(item.id, item.quantity + 1)}
                                                        className="w-5 h-5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded flex items-center justify-center font-bold text-xs"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-500 hover:text-red-700 font-bold ml-2 text-xs"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}

                                        {cart.length === 0 && (
                                            <div className="flex flex-col items-center justify-center h-full text-center py-20">
                                                <span className="material-symbols-outlined text-slate-200 text-4xl mb-2">shopping_cart</span>
                                                <p className="text-slate-400 text-xs font-semibold">No items added yet</p>
                                                <p className="text-slate-400 text-[10px]">Click on products to add</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Bottom Totals Section */}
                                <div className="border-t border-orange-200/40 pt-4 space-y-3.5">
                                    <div className="flex justify-between text-xs text-slate-500 font-semibold">
                                        <span>Subtotal</span>
                                        <span className="text-slate-800">Rs. {cartSubtotal.toFixed(2)}</span>
                                    </div>

                                    {/* Discount scheme selection dropdown */}
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500 font-semibold">Discount</span>
                                        <select
                                            value={discountType}
                                            onChange={(e) => setDiscountType(e.target.value)}
                                            className="bg-orange-50/50 border border-orange-200/50 rounded px-2.5 py-1 text-slate-700 font-bold outline-none text-xs"
                                        >
                                            <option value="none">No Discount</option>
                                            <option value="10%">10% Off Member</option>
                                            <option value="20%">20% Promo Code</option>
                                            <option value="50">Rs. 50.00 Off</option>
                                        </select>
                                    </div>

                                    {/* Cash vs Card Mode Selector */}
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500 font-semibold">Payment Mode</span>
                                        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-orange-200/40">
                                            <button
                                                onClick={() => setPaymentMethod('cash')}
                                                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all duration-150 ${paymentMethod === 'cash' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                                    }`}
                                            >
                                                Cash
                                            </button>
                                            <button
                                                onClick={() => setPaymentMethod('card')}
                                                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all duration-150 ${paymentMethod === 'card' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                                    }`}
                                            >
                                                Card
                                            </button>
                                        </div>
                                    </div>

                                    {/* TOTAL PAYABLE */}
                                    <div className="flex justify-between items-center text-sm border-t border-orange-200/40 pt-3">
                                        <span className="font-extrabold text-slate-900">TOTAL PAYABLE</span>
                                        <span className="text-lg font-black text-orange-600">Rs. {totalPayable.toFixed(2)}</span>
                                    </div>

                                    {/* Checkout / Print Action Button */}
                                    <button
                                        onClick={handleCheckout}
                                        disabled={cart.length === 0}
                                        className="w-full py-3 bg-orange-600 text-white font-extrabold rounded-xl hover:bg-orange-700 transition-colors shadow-sm shadow-orange-600/10 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none text-xs uppercase tracking-wider"
                                    >
                                        CHECKOUT / PRINT
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Ambient Background Area below Command Center */}
                <div className="relative overflow-hidden w-full bg-transparent">

                    {/* Scroll-Reveal Section */}
                    <section
                        className="min-h-0 md:min-h-[80vh] flex flex-col justify-center relative z-10 overflow-hidden py-10 md:py-20 border-b border-orange-400/80"
                    >
                        <div className="max-w-[1440px] w-full mx-auto px-8 md:px-16 flex flex-col items-start space-y-4">
                            <motion.span
                                style={{ opacity: opacity1, y: y1 }}
                                className="text-orange-600 text-5xl md:text-7xl lg:text-9xl font-black leading-none font-sans inline-block tracking-tighter break-words"
                            >
                                Bakery
                            </motion.span>
                            <motion.span
                                style={{ opacity: opacity2, y: y2 }}
                                className="text-orange-600 text-5xl md:text-7xl lg:text-9xl font-black leading-none font-sans text-left inline-block tracking-tighter break-words"
                            >
                                Management
                            </motion.span>
                            <motion.span
                                style={{ opacity: opacity3, y: y3 }}
                                className="text-orange-600 text-5xl md:text-7xl lg:text-9xl font-black leading-none font-sans inline-block tracking-tighter break-words"
                            >
                                System
                            </motion.span>
                        </div>
                    </section>

                    {/* Technical Split Panel: Warm Light Theme */}
                    <section className="relative z-10 border-b border-orange-400/80 bg-[radial-gradient(rgba(234,88,12,0.02)_1px,transparent_1px)] [background-size:32px_32px]">
                        <motion.div
                            className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 min-h-[600px]"
                            {...globalRevealProps}
                        >
                            {/* Left Column: POS Technical Narratives */}
                            <div className="md:col-span-8 p-8 md:p-12 border-r border-orange-400/80 space-y-12 md:space-y-16">
                                <div className="space-y-4">
                                    <span className="text-[10px] font-mono text-orange-600 font-bold uppercase tracking-[0.4em] block">[ 01 ] TRANSACTIONAL INTEGRITY</span>
                                    <h2 className="font-sans text-2xl md:text-3xl font-bold tracking-tight text-slate-800 leading-tight">Database Locks & Stock Syncing</h2>
                                    <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl">
                                        High-volume checkout counters demand absolute transactional reliability. The POS engine is backed by a secure PostgreSQL isolation loop that guarantees atomic decrement of stock quantities, preventing race conditions or double-spend billing errors.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <span className="text-[10px] font-mono text-orange-600 font-bold uppercase tracking-[0.4em] block">[ 02 ] THE PERFORMANCE LAYER</span>
                                    <h2 className="font-sans text-2xl md:text-3xl font-bold tracking-tight text-slate-800 leading-tight">Offline Capability & Sync Queue</h2>
                                    <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl">
                                        Should local store networks disconnect, the terminal continues billing transactions locally on IndexedDB. Once connectivity is restored, items, discounts, and payment logs queue and push atomically in sub-100ms batches.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <span className="text-[10px] font-mono text-orange-600 font-bold uppercase tracking-[0.4em] block">[ 03 ] FINANCIAL REPORTING</span>
                                    <h2 className="font-sans text-2xl md:text-3xl font-bold tracking-tight text-slate-800 leading-tight">Automated Ledger Reconciliation</h2>
                                    <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl">
                                        Wastage statistics and sales logs compile dynamically to build real-time profit and loss matrix sheets. Ledger calculations reduce audit mismatch periods from typical 24-hour gaps to zero.
                                    </p>
                                </div>
                            </div>

                            {/* Right Column: Light Theme POS Metadata */}
                            <div className="md:col-span-4 bg-white/[0.25] backdrop-blur-md p-8 md:p-12 space-y-10 flex flex-col justify-between">
                                <div className="border-b border-orange-400/80 pb-6">
                                    <span className="text-[10px] font-mono text-orange-600 uppercase block mb-2 tracking-[0.2em] font-bold">CLIENT</span>
                                    <span className="font-sans text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Apex Retail Holdings</span>
                                </div>

                                <div className="border-b border-orange-400/80 pb-6">
                                    <span className="text-[10px] font-mono text-orange-600 uppercase block mb-2 tracking-[0.2em] font-bold">ROLE</span>
                                    <div className="space-y-1.5">
                                        <span className="font-sans text-sm md:text-base font-bold text-slate-700 block">POS Integration</span>
                                        <span className="font-sans text-sm md:text-base font-bold text-slate-700 block">Full-Stack Database Architecture</span>
                                        <span className="font-sans text-sm md:text-base font-bold text-slate-700 block">Real-time Data Streams</span>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-[10px] font-mono text-orange-600 uppercase block mb-4 tracking-[0.2em] font-bold">CORE TECH</span>
                                    <div className="flex flex-wrap gap-2">
                                        {['REACT.JS', 'INDEXEDDB', 'POSTGRESQL', 'REDIS', 'DOCKER', 'TAILWIND CSS'].map((tech) => (
                                            <span key={tech} className="px-3 py-1 bg-white border border-orange-400/60 rounded-full text-slate-600 font-mono text-[9px] uppercase tracking-wider">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </section>

                    {/* Multi-Feature Gallery: Light Orange Theme */}
                    <section className="relative z-10 px-8 md:px-16 py-16 md:py-24 bg-transparent">
                        <motion.div
                            className="max-w-[1440px] mx-auto"
                            {...globalRevealProps}
                        >
                            <div className="flex items-center gap-8 mb-16">
                                <h3 className="font-sans text-3xl md:text-5xl font-bold tracking-tight text-slate-800 whitespace-nowrap">BakeryOS Core Modules</h3>
                                <div className="h-px bg-orange-400/80 w-full"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Feature 1: Secure Access */}
                                <motion.div
                                    className="group bg-white border border-orange-400/65 rounded-2xl p-5 md:p-6 hover:border-orange-500/25 transition-all duration-500 hover:bg-orange-50/10 shadow-sm flex flex-col justify-between"
                                    {...globalRevealProps}
                                >
                                    <div className="mb-6 overflow-hidden rounded-xl border border-orange-100 relative aspect-[16/10] bg-slate-50 p-4">
                                        <img alt="Secure Access" className="w-full h-full object-contain grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" src="/bakery-login.png" />
                                        <div className="absolute inset-0 bg-orange-900/5 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
                                    </div>
                                    <div className="flex justify-between items-start border-l border-orange-500/40 pl-5 mb-1">
                                        <div>
                                            <span className="text-[10px] font-mono text-orange-600 uppercase tracking-[0.3em] block mb-1.5">01 / SECURITY</span>
                                            <h4 className="font-sans text-lg md:text-xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors leading-snug">Secure Access</h4>
                                            <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">Encrypted cashier login portal ensuring secure terminal access and shift tracking.</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Feature 2: Live Notifications */}
                                <motion.div
                                    className="group bg-white border border-orange-400/65 rounded-2xl p-5 md:p-6 hover:border-orange-500/25 transition-all duration-500 hover:bg-orange-50/10 shadow-sm flex flex-col justify-between"
                                    {...globalRevealProps}
                                >
                                    <div className="mb-6 overflow-hidden rounded-xl border border-orange-100 relative aspect-[16/10] bg-slate-50 p-4">
                                        <img alt="Live Notifications" className="w-full h-full object-contain grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" src="/bakery-notifications.png" />
                                        <div className="absolute inset-0 bg-orange-900/5 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
                                    </div>
                                    <div className="flex justify-between items-start border-l border-orange-500/40 pl-5 mb-1">
                                        <div>
                                            <span className="text-[10px] font-mono text-orange-600 uppercase tracking-[0.3em] block mb-1.5">02 / NOTIFICATIONS</span>
                                            <h4 className="font-sans text-lg md:text-xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors leading-snug">Live Notifications</h4>
                                            <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">Real-time alerts and system activities for shift summaries and counter status.</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Feature 3: Discount Management */}
                                <motion.div
                                    className="group bg-white border border-orange-400/65 rounded-2xl p-5 md:p-6 hover:border-orange-500/25 transition-all duration-500 hover:bg-orange-50/10 shadow-sm flex flex-col justify-between"
                                    {...globalRevealProps}
                                >
                                    <div className="mb-6 overflow-hidden rounded-xl border border-orange-100 relative aspect-[16/10] bg-slate-50 p-4">
                                        <img alt="Discount Management" className="w-full h-full object-contain grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" src="/bakery-discounts.png" />
                                        <div className="absolute inset-0 bg-orange-900/5 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
                                    </div>
                                    <div className="flex justify-between items-start border-l border-orange-500/40 pl-5 mb-1">
                                        <div>
                                            <span className="text-[10px] font-mono text-orange-600 uppercase tracking-[0.3em] block mb-1.5">03 / DISCOUNTS</span>
                                            <h4 className="font-sans text-lg md:text-xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors leading-snug">Discount Management</h4>
                                            <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">Track active promotions and manage seasonal offers with custom validity periods.</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Feature 4: Sales History */}
                                <motion.div
                                    className="group bg-white border border-orange-400/65 rounded-2xl p-5 md:p-6 hover:border-orange-500/25 transition-all duration-500 hover:bg-orange-50/10 shadow-sm flex flex-col justify-between"
                                    {...globalRevealProps}
                                >
                                    <div className="mb-6 overflow-hidden rounded-xl border border-orange-100 relative aspect-[16/10] bg-slate-50 p-4">
                                        <img alt="Sales History" className="w-full h-full object-contain grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" src="/bakery-sales.png" />
                                        <div className="absolute inset-0 bg-orange-900/5 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
                                    </div>
                                    <div className="flex justify-between items-start border-l border-orange-500/40 pl-5 mb-1">
                                        <div>
                                            <span className="text-[10px] font-mono text-orange-600 uppercase tracking-[0.3em] block mb-1.5">04 / SALES</span>
                                            <h4 className="font-sans text-lg md:text-xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors leading-snug">Sales History</h4>
                                            <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">Comprehensive tracking of total revenue, transactions, and average order values.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </section>
                </div>
            </main>

            {/* Modernized Fintech Bottom Dashboards Section */}
            <section className="relative z-10 py-12 mt-12 border-t border-orange-200/40 bg-white/40 backdrop-blur-sm">
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
                        {/* Card 1: HRIS Command Center */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <Link
                                to="/project/hris-command-center"
                                className="group block bg-white/80 hover:bg-white border border-orange-200 hover:border-orange-400 rounded-2xl p-6 transition-all duration-500 hover:shadow-[0_15px_40px_rgba(234,88,12,0.06)] flex flex-col justify-between h-[360px]"
                            >
                                <div className="overflow-hidden rounded-xl border border-orange-100 relative aspect-[16/9] mb-6">
                                    <img
                                        alt="HRIS Command Center"
                                        className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                                        src="/image(5).png"
                                    />
                                    <div className="absolute inset-0 bg-orange-900/5 group-hover:bg-transparent transition-colors duration-500"></div>
                                </div>
                                <div className="flex justify-between items-end border-l border-orange-500/40 pl-4 mt-auto">
                                    <div>
                                        <span className="text-[9px] font-mono text-orange-600 uppercase tracking-[0.2em] block mb-1">CASE STUDY / 01</span>
                                        <h3 className="font-sans text-xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors leading-snug">
                                            HRIS Command Center
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-sm">
                                            A comprehensive employee management system and HR architecture dashboard tracking operations and activity timelines.
                                        </p>
                                    </div>
                                    <span className="material-symbols-outlined text-orange-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                                        arrow_outward
                                    </span>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Card 2: Bespoke Salon Portal */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                        >
                            <Link
                                to="/project/bespoke-salon"
                                className="group block bg-white/80 hover:bg-white border border-orange-200 hover:border-orange-400 rounded-2xl p-6 transition-all duration-500 hover:shadow-[0_15px_40px_rgba(234,88,12,0.06)] flex flex-col justify-between h-[360px]"
                            >
                                <div className="overflow-hidden rounded-xl border border-orange-100 relative aspect-[16/9] mb-6">
                                    <img
                                        alt="Bespoke Salon Portal"
                                        className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                                        src="/salon-showcase.png"
                                    />
                                    <div className="absolute inset-0 bg-orange-900/5 group-hover:bg-transparent transition-colors duration-500"></div>
                                </div>
                                <div className="flex justify-between items-end border-l border-orange-500/40 pl-4 mt-auto">
                                    <div>
                                        <span className="text-[9px] font-mono text-orange-600 uppercase tracking-[0.2em] block mb-1">CASE STUDY / 02</span>
                                        <h3 className="font-sans text-xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors leading-snug">
                                            Bespoke Salon Portal
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-sm">
                                            A smart scheduling and management interface for high-end salon operations.
                                        </p>
                                    </div>
                                    <span className="material-symbols-outlined text-orange-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                                        arrow_outward
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer theme="light-fintech" isDarkTheme={false} />
        </div>
    );
};

export default BakeryDashboard;