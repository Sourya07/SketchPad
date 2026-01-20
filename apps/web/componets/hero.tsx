"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            gsap.from("h1", {
                y: 40,
                opacity: 0,
                delay: 0.5,
                duration: 1.5,
                ease: "power3.out",
            });

            gsap.from("p", {
                y: 20,
                opacity: 0,
                delay: 1,
                duration: 2,

                ease: "power3.out",
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="mx-auto max-w-7xl px-6 py-24 text-center"
        >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Collaborative whiteboarding,
                <span className="block text-primary"> made simple</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                Sketchpad is a fast, open, and intuitive drawing tool for teams.
                Brainstorm, diagram, and collaborate in real time — without friction.
            </p>
        </section>
    );
}