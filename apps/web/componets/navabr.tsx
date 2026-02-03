"use client";

import Link from "next/link";
import { useState } from "react";

export function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="border-b absolute top-0 left-0 w-full bg-white dark:bg-black z-50">
            <div className="mx-auto max-w-7xl px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <span className="text-lg font-semibold tracking-tight">
                        Sketchpad
                    </span>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
                        <a className="hover:text-foreground cursor-pointer">
                            Features
                        </a>
                        <a className="hover:text-foreground cursor-pointer">
                            Pricing
                        </a>
                        <Link
                            href="/signup"
                            className="hover:text-foreground cursor-pointer"
                        >
                            Signup
                        </Link>
                        <Link
                            href="/signin"
                            className="hover:text-foreground cursor-pointer"
                        >
                            Signin
                        </Link>
                    </nav>


                    <button
                        onClick={() => setOpen(!open)}
                        className="md:hidden focus:outline-none"
                        aria-label="Toggle Menu"
                    >
                        <div className="space-y-1.5">
                            <span className="block h-0.5 w-6 bg-foreground" />
                            <span className="block h-0.5 w-6 bg-foreground" />
                            <span className="block h-0.5 w-6 bg-foreground" />
                        </div>
                    </button>
                </div>

                {/* Mobile Menu */}
                {open && (
                    <div className="md:hidden mt-4 flex flex-col gap-4 text-sm text-muted-foreground">
                        <a className="hover:text-foreground cursor-pointer">
                            Features
                        </a>
                        <a className="hover:text-foreground cursor-pointer">
                            Pricing
                        </a>
                        <Link
                            href="/signup"
                            className="hover:text-foreground cursor-pointer"
                            onClick={() => setOpen(false)}
                        >
                            Signup
                        </Link>
                        <Link
                            href="/signin"
                            className="hover:text-foreground cursor-pointer"
                            onClick={() => setOpen(false)}
                        >
                            Signin
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}