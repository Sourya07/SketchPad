"use client";

import Link from "next/link";
import { Navbar } from "../componets/navabr";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Collaborative whiteboarding,
          <span className="block text-primary"> made simple</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Sketchpad is a fast, open, and intuitive drawing tool for teams.
          Brainstorm, diagram, and collaborate in real time — without friction.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
            Start drawing
          </button>
          <button className="rounded-lg border px-6 py-3 text-sm font-medium hover:bg-accent transition">
            View demo
          </button>
        </div>
      </section>

      {/* Features */}

      <div className="mx-auto max-w-7xl px-6 py-20 grid gap-12 md:grid-cols-3">
        {[
          {
            title: "Real-time collaboration",
            desc: "Draw together with your team and see changes instantly.",
          },
          {
            title: "Infinite canvas",
            desc: "No limits. Zoom, pan, and sketch freely on an endless board.",
          },
          {
            title: "Simple & fast",
            desc: "No clutter. Just pure drawing with lightning-fast performance.",
          },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>


      {/* CTA */}
      <section className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold">
            Start sketching in seconds
          </h2>
          <p className="mt-4 text-muted-foreground">
            No downloads. No learning curve. Just open and draw.
          </p>

          <button className="mt-8 rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
            Launch Sketchpad
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} Sketchpad</span>
          <div className="flex gap-4">
            <a className="hover:text-foreground cursor-pointer">Privacy</a>
            <a className="hover:text-foreground cursor-pointer">Terms</a>
            <a className="hover:text-foreground cursor-pointer">GitHub</a>
          </div>
        </div>
      </footer>
    </div >
  );
}