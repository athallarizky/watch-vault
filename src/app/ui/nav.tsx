import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
	{ to: "/", label: "Home" },
	{ to: "/discover", label: "Discover" },
	{ to: "/search", label: "Search" },
	{ to: "/watchlist", label: "Watchlist" },
] as const;

export function Nav() {
	return (
		<header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
			<nav
				aria-label="Main navigation"
				className="mx-auto flex h-14 w-[min(1280px,100%-2rem)] items-center gap-6"
			>
				<Link
					to="/"
					className="text-lg font-extrabold tracking-wide text-primary"
				>
					WATCH VAULT
				</Link>
				<ul className="flex items-center gap-4">
					{NAV_LINKS.map((link) => (
						<li key={link.to}>
							<Link
								to={link.to}
								activeOptions={{ exact: link.to === "/" }}
								activeProps={{
									className: "font-semibold text-foreground",
								}}
								className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
							>
								{link.label}
							</Link>
						</li>
					))}
				</ul>
				<Button
					size="sm"
					className="ml-auto"
					disabled
					aria-label="AI concierge"
				>
					✨ Concierge
				</Button>
			</nav>
		</header>
	);
}
