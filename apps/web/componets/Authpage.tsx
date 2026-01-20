"use client";

import axios from "axios";
import { BACKEND_URL } from "../server";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function Authpage() {
    const router = useRouter();
    const pathname = usePathname();


    const isSignin = pathname === "/signin";

    const [state, setState] = useState({
        name: "",
        username: "",
        password: "",
    });

    const handleAuth = async () => {
        try {
            const endpoint = isSignin ? "signin" : "signup";


            const payload = isSignin
                ? {
                    username: state.username,
                    password: state.password,
                }
                : state;

            const response = await axios.post(
                `${BACKEND_URL}/v1/${endpoint}`,
                payload,
                {
                    withCredentials: true,
                }
            );

            console.log(response.data);


            router.push("/");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-[380px] rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-center">
                    {isSignin ? "Sign in to your account" : "Create an account"}
                </h2>

                <p className="mt-1 mb-6 text-sm text-center text-muted-foreground">
                    {isSignin
                        ? "Welcome back. Please enter your details."
                        : "Get started in less than a minute."}
                </p>


                {!isSignin && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            placeholder="Your name"
                            value={state.name}
                            onChange={(e) =>
                                setState((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                        />
                    </div>
                )}


                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={state.username}
                        onChange={(e) =>
                            setState((prev) => ({
                                ...prev,
                                username: e.target.value,
                            }))
                        }
                        className="w-full rounded-lg border px-3 py-2 text-sm"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={state.password}
                        onChange={(e) =>
                            setState((prev) => ({
                                ...prev,
                                password: e.target.value,
                            }))
                        }
                        className="w-full rounded-lg border px-3 py-2 text-sm"
                    />
                </div>

                <button
                    onClick={handleAuth}
                    className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground"
                >
                    {isSignin ? "Sign in" : "Create account"}
                </button>
            </div>
        </div>
    );
}