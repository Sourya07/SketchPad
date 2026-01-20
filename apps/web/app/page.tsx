"use client";

import Link from "next/link";
import HeroSection from "../componets/hero";
import { BACKEND_URL } from "../server";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const router = useRouter();

  const joinRoom = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/v1/room`,
        {
          name: roomName,
        },
        {
          withCredentials: true,
        }
      );

      // If success (200), we get roomId but we want to navigate to slug
      // The backend returns { roomId: number } on success
      // But the user request said "this will opened a room with name slug"
      // So we navigate to /board/[roomName]
      router.push(`/board/${roomName}`);
    } catch (e: unknown) {
      const error = e as AxiosError;
      if (error.response?.status === 401) {
        // Unauthorized
        router.push("/signin");
      } else if (error.response?.status === 411) {
        // Room already exists, just join it
        router.push(`/board/${roomName}`);
      } else {
        console.error("Failed to join room", e);
        alert("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Navbar */}

      {/* Hero */}
      <HeroSection />


      <div className="mt-10 flex justify-center gap-4">
        <Link href="/board/abcd">
          <button className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition">

            Start drawing
          </button>
        </Link>

        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg border px-6 py-3 text-sm font-medium hover:bg-accent transition"
        >
          Meetings
        </button>
      </div>


      {/* Features */}

      < div className="mx-auto max-w-7xl px-6 py-20 grid gap-12 md:grid-cols-3" >
        {
          [
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
          ))
        }
      </div >


      {/* CTA */}
      < section className="border-t" >
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
      </section >

      {/* Footer */}
      < footer className="border-t" >
        <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} Sketchpad</span>
          <div className="flex gap-4">
            <a className="hover:text-foreground cursor-pointer">Privacy</a>
            <a className="hover:text-foreground cursor-pointer">Terms</a>
            <a className="hover:text-foreground cursor-pointer">GitHub</a>
          </div>
        </div>
      </footer >

      {/* Meeting Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-lg">
            <h3 className="text-xl font-semibold">Join a Meeting</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter the room name to join or create a new one.
            </p>

            <input
              type="text"
              placeholder="Room Name (e.g. daily-standup)"
              className="mt-4 w-full rounded-md border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-md px-4 py-2 text-sm font-medium hover:bg-accent transition"
              >
                Cancel
              </button>
              <button
                onClick={joinRoom}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
                disabled={!roomName.trim()}
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div >
  );
}