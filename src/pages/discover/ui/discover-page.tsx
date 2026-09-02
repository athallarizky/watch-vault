import { useNavigate, useSearch } from "@tanstack/react-router";
import {
	DISCOVER_TABS,
	getTab,
	isTabId,
	type TTabId,
	useDiscoverTab,
} from "../model/discover-tabs";
import { DiscoverPanel } from "./discover-panel";
import { TabBar } from "./tab-bar";

export function DiscoverPage() {
	const navigate = useNavigate({ from: "/discover" });
	const { tab } = useSearch({ from: "/discover" });
	// The URL is the source of truth; unknown values fall back to the first tab.
	const tabId: TTabId = isTabId(tab) ? tab : "popular";
	const activeTab = getTab(tabId);

	const { data, isLoading, isError, refetch } = useDiscoverTab(tabId);

	// replace keeps one history entry per visit instead of per tab click.
	const handleTabChange = (id: TTabId) =>
		navigate({ to: "/discover", search: { tab: id }, replace: true });

	return (
		<main className="mx-auto w-[min(1280px,100%-2rem)] space-y-6 py-8">
			<h1 className="text-display-md">Discover</h1>

			<TabBar
				tabs={DISCOVER_TABS}
				activeId={tabId}
				onChange={handleTabChange}
				idPrefix="discover-tab"
				controlsId="discover-panel"
			/>

			<div
				role="tabpanel"
				id="discover-panel"
				aria-labelledby={`discover-tab-${tabId}`}
			>
				<DiscoverPanel
					kind={activeTab.kind}
					data={data}
					isLoading={isLoading}
					isError={isError}
					onRetry={() => refetch()}
				/>
			</div>
		</main>
	);
}
