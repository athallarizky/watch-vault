import { useState } from "react";
import {
	DISCOVER_TABS,
	getTab,
	type TTabId,
	useDiscoverTab,
} from "../model/discover-tabs";
import { DiscoverPanel } from "./discover-panel";
import { TabBar } from "./tab-bar";

export function DiscoverPage() {
	const [tabId, setTabId] = useState<TTabId>("popular");
	const activeTab = getTab(tabId);

	const { data, isLoading, isError, refetch } = useDiscoverTab(tabId);

	return (
		<main className="mx-auto w-[min(1280px,100%-2rem)] space-y-6 py-8">
			<h1 className="text-2xl font-extrabold">Discover</h1>

			<TabBar
				tabs={DISCOVER_TABS}
				activeId={tabId}
				onChange={setTabId}
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
