"use client";

export function Authpage({ IsSignin }: { IsSignin: boolean }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            {/* Card */}
            <div className="w-[380px] rounded-xl border bg-card p-6 shadow-sm">
                {/* Heading */}
                <h2 className="text-xl font-semibold text-foreground text-center">
                    {IsSignin ? "Sign in to your account" : "Create an account"}
                </h2>
                <p className="mt-1 mb-6 text-sm text-muted-foreground text-center">
                    {IsSignin
                        ? "Welcome back. Please enter your details."
                        : "Get started in less than a minute."}
                </p>

                {/* Email */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        className="
              w-full rounded-lg border bg-background px-3 py-2 text-sm
              placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-ring
            "
                    />
                </div>

                {/* Password */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="
              w-full rounded-lg border bg-background px-3 py-2 text-sm
              placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-ring
            "
                    />
                </div>

                {/* Button */}
                <button
                    className="
            w-full rounded-lg bg-primary py-2.5 text-sm font-medium
            text-primary-foreground
            hover:opacity-90 transition
          "
                >
                    {IsSignin ? "Sign in" : "Create account"}
                </button>

                {/* Footer */}
                <p className="mt-6 text-center text-sm text-muted-foreground">
                    {IsSignin ? (
                        <>
                            Don’t have an account?{" "}
                            <span className="cursor-pointer font-medium text-foreground hover:underline">
                                Sign up
                            </span>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <span className="cursor-pointer font-medium text-foreground hover:underline">
                                Sign in
                            </span>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}