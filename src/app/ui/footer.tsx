import { Link } from "@tanstack/react-router";
import { Github, Linkedin } from "lucide-react";
import { NAV_LINKS } from "./nav";

const GITHUB_URL = "https://github.com/athallarizky/watch-vault";
const LINKEDIN_URL = "https://www.linkedin.com/in/athallarizky";
const TMDB_URL = "https://www.themoviedb.org";

const SOCIAL_LINKS = [
	{ href: GITHUB_URL, label: "GitHub repository", Icon: Github },
	{ href: LINKEDIN_URL, label: "LinkedIn profile", Icon: Linkedin },
] as const;

const iconLinkClass =
	"rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring";

export function Footer() {
	return (
		<footer className="mt-auto border-t border-border">
			<div className="mx-auto w-[min(1280px,100%-2rem)] space-y-6 py-10">
				<div className="flex items-center gap-5">
					{SOCIAL_LINKS.map(({ href, label, Icon }) => (
						<a
							key={href}
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={label}
							className={iconLinkClass}
						>
							<Icon aria-hidden="true" className="size-5" />
						</a>
					))}
				</div>

				<nav aria-label="Footer navigation">
					<ul className="flex flex-wrap gap-x-6 gap-y-2">
						{NAV_LINKS.map((link) => (
							<li key={link.to}>
								<Link
									to={link.to}
									className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>

				<p className="text-xs text-muted-foreground/70">
					© {new Date().getFullYear()} Watch Vault · Data by{" "}
					<a
						href={TMDB_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="underline-offset-2 transition-colors hover:text-foreground hover:underline"
					>
						TMDB
					</a>
				</p>
			</div>
		</footer>
	);
}
