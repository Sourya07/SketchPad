import Link from "next/link";

export function Navbar() {
    return <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <span className="text-lg font-semibold tracking-tight">
                Sketchpad
            </span>

            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
                <a className="hover:text-foreground cursor-pointer">Features</a>
                <a className="hover:text-foreground cursor-pointer">Pricing</a>
                <Link
                    href="/signin"
                    className="hover:text-foreground cursor-pointer"
                >
                    Logout
                </Link>
                <Link
                    href="/signin"
                    className="hover:text-foreground cursor-pointer"
                >
                    Login
                </Link>
            </nav>
        </div>
    </header>
}