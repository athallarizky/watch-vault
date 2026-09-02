interface ITabBarItem {
	id: string;
	label: string;
}

interface ITabBarProps<TId extends string> {
	tabs: ReadonlyArray<ITabBarItem & { id: TId }>;
	activeId: TId;
	onChange: (id: TId) => void;
	/** Prefix for tab element ids, used for aria wiring. */
	idPrefix: string;
	/** Id of the panel controlled by this tab list. */
	controlsId: string;
}

/**
 * Accessible tab list with roving-tabindex keyboard support
 * (ArrowLeft/ArrowRight/Home/End move focus between tabs).
 */
export function TabBar<TId extends string>({
	tabs,
	activeId,
	onChange,
	idPrefix,
	controlsId,
}: ITabBarProps<TId>) {
	function focusTab(index: number) {
		document.getElementById(`${idPrefix}-${tabs[index].id}`)?.focus();
	}

	function handleTabKeys(
		event: React.KeyboardEvent<HTMLButtonElement>,
		index: number,
	) {
		const count = tabs.length;
		let next = -1;
		if (event.key === "ArrowRight") next = (index + 1) % count;
		else if (event.key === "ArrowLeft") next = (index - 1 + count) % count;
		else if (event.key === "Home") next = 0;
		else if (event.key === "End") next = count - 1;
		if (next >= 0) {
			event.preventDefault();
			focusTab(next);
		}
	}

	return (
		<div
			role="tablist"
			aria-label="Browse categories"
			className="flex flex-wrap gap-2"
		>
			{tabs.map((tab, index) => {
				const isActive = tab.id === activeId;
				return (
					<button
						key={tab.id}
						type="button"
						role="tab"
						id={`${idPrefix}-${tab.id}`}
						aria-selected={isActive}
						aria-controls={controlsId}
						tabIndex={isActive ? 0 : -1}
						onClick={() => onChange(tab.id)}
						onKeyDown={(event) => handleTabKeys(event, index)}
						className={
							isActive
								? "rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring"
								: "rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
						}
					>
						{tab.label}
					</button>
				);
			})}
		</div>
	);
}
