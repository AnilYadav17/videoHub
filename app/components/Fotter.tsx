"use client"
import React from 'react';
import { 
    Film,
    Heart,
    Github,
    Twitter,
    Instagram,
    ArrowUp
} from 'lucide-react';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const socialLinks = [
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Instagram, href: '#', label: 'Instagram' },
        { icon: Github, href: '#', label: 'GitHub' }
    ];

    const footerLinks = [
        { label: 'About', href: '#' },
        { label: 'Support', href: '#' },
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
        { label: 'Contact', href: '#' }
    ];

    return (
        <footer className="relative bg-white/80 backdrop-blur-xl border-t border-white/20 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
                    {/* Brand */}
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                            <Film className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            VideoHub
                        </span>
                    </div>

                    {/* Footer Links */}
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                        {footerLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.href}
                                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Social Links & Copyright */}
                    <div className="flex items-center space-x-4">
                        {/* Social Links */}
                        <div className="flex items-center space-x-2">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 hover:scale-110 transform transition-all duration-200 group"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                                </a>
                            ))}
                        </div>

                        {/* Copyright */}
                        <div className="flex items-center space-x-2 text-gray-600 text-sm">
                            <span>© 2025</span>
                            <Heart className="w-3 h-3 text-red-500 fill-current" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center z-40"
                aria-label="Scroll to top"
            >
                <ArrowUp className="w-5 h-5" />
            </button>
        </footer>
    );
};

export default Footer;