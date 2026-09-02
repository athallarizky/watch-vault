import { useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IBackButtonProps {
	/** Where to land when the page was opened directly (new tab) and there is
	 * no in-app history to return to. */
	fallback: { to: "/discover"; search: { tab: string } };
}

/**
 * History back when the page was reached by in-app navigation (keeps the
 * origin's scroll and query state); direct opens fall back to the given
 * listing instead of leaving the site.
 */
export function BackButton({ fallback }: IBackButtonProps) {
	const router = useRouter();
	const navigate = useNavigate();

	function goBack() {
		if (window.history.length > 1) {
			router.history.back();
		} else {
			navigate(fallback);
		}
	}

	return (
		<Button
			variant="ghost"
			size="sm"
			onClick={goBack}
			className="-ml-2 text-muted-foreground hover:text-foreground"
		>
			<ArrowLeft aria-hidden="true" />
			Back
		</Button>
	);
}
