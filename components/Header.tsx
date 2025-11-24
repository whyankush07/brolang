'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Bug } from 'lucide-react';
import { RxCross2 } from "react-icons/rx";
import { ModeToggle } from '@/components/ui/Themetoggle';
import BugReport from '@/components/code/BugReport';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isBugOpen, setIsBugOpen] = useState(false);

    const navItems = [
        { name: 'Docs', href: '/docs', isNew: false },
        { name: 'Twitter', target: "_blank", href: 'https://x.com/whyankush07' },
        { name: 'Github', target: "_blank", href: 'https://github.com/whyankush07/brolang' }
    ];

    return (
        <nav className="fixed top-0 w-full bg-background border-b border-border z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image src="/apple-touch-icon.png" width={40} height={40} alt="Brolang Logo" unoptimized={true} fetchPriority='high' className='rounded-xl' />
                        <span className="text-xl font-bold">Brolang</span>
                    </Link>

                    <motion.div
                        className="hidden md:flex items-center space-x-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {navItems.map((item) => (
                            <Link key={item.name} href={item.href} target={item.target ? item.target : "_self"} className="text-muted-foreground hover:text-foreground relative">
                                {item.name}
                                {item.isNew && (
                                    <span className="absolute -top-1 -right-8 px-2 py-0.5 text-xs bg-emerald-100 text-emerald-800 rounded-full">
                                        new
                                    </span>
                                )}
                            </Link>
                        ))}
                    </motion.div>

                    <div className="flex items-center space-x-4">
                        <ModeToggle />

                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="relative cursor-pointer"
                        >
                            {!isBugOpen && <Bug size={20} onClick={() => setIsBugOpen(true)} className="w-6 h-6 text-neutral-500 dark:text-neutral-300" />}
                            {isBugOpen && <RxCross2 onClick={() => setIsBugOpen(false)} />}
                            {/* {!isBugOpen && <span className="absolute -bottom-6 -right-6 px-2 py-0.5 text-xs bg-gray-800 text-white rounded opacity-0 hover:opacity-100">
                                Report a bug
                            </span>} */}
                            {isBugOpen && <BugReport setIsBugOpen={setIsBugOpen} />}
                        </motion.div>
                    </div>

                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-accent">
                            <span className='sr-only'>Header</span>
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {isOpen && (
                    <motion.div
                        className="md:hidden py-4 space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {navItems.map((item) => (
                            <a key={item.name} href={item.href} className="block px-4 py-2 text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg relative">
                                {item.name}
                                {item.isNew && (
                                    <span className="ml-2 px-2 py-0.5 text-xs bg-emerald-100 text-emerald-800 rounded-full">
                                        new
                                    </span>
                                )}
                            </a>
                        ))}
                    </motion.div>
                )}
            </div>
        </nav>
    );
};

export default Header;
