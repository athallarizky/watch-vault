import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import type { IMovie } from "@/entities/movie/model/movie-domain.types";
import { HeroSlide } from "./hero-slide";

const SLIDE_COUNT = 5;
const AUTOPLAY_DELAY_MS = 6000;

interface IHeroProps {
	movies: IMovie[];
}

/**
 * Billboard-style hero: auto-advancing featured movies with progress bars.
 * Accessibility contract: autoplay pauses on hover and resumes on leave,
 * honors prefers-reduced-motion (no autoplay at all), and every slide is
 * reachable via the focusable progress buttons.
 */
export function Hero({ movies }: IHeroProps) {
	const [api, setApi] = useState<CarouselApi>();
	const [active, setActive] = useState(0);
	const [reducedMotion, setReducedMotion] = useState(false);

	const slides = useMemo(() => movies.slice(0, SLIDE_COUNT), [movies]);

	useEffect(() => {
		const query = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReducedMotion(query.matches);
	}, []);

	useEffect(() => {
		if (!api) return;
		const carousel = api;
		function onSelect() {
			setActive(carousel.selectedScrollSnap());
		}
		carousel.on("select", onSelect);
		return () => {
			carousel.off("select", onSelect);
		};
	}, [api]);

	const scrollTo = useCallback((index: number) => api?.scrollTo(index), [api]);

	const plugins = useMemo(
		() =>
			reducedMotion
				? []
				: [
						// stopOnInteraction: false is required for pause-on-hover to resume:
						// with the default true, the mouseleave listener is never attached
						// and the first hover kills autoplay permanently.
						Autoplay({
							delay: AUTOPLAY_DELAY_MS,
							stopOnMouseEnter: true,
							stopOnInteraction: false,
						}),
					],
		[reducedMotion],
	);

	if (slides.length === 0) return null;

	return (
		<section aria-label="Featured movies" className="relative">
			<Carousel
				opts={{ loop: true }}
				plugins={plugins}
				setApi={setApi}
				className="overflow-hidden rounded-xl"
			>
				<CarouselContent className="ml-0">
					{slides.map((movie, index) => (
						<CarouselItem key={movie.id} className="pl-0">
							<HeroSlide movie={movie} priority={index === 0} />
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>

			<div className="absolute right-6 bottom-4 z-10 flex gap-2">
				{slides.map((movie, index) => (
					<button
						key={movie.id}
						type="button"
						aria-label={`Show featured movie ${index + 1} of ${slides.length}: ${movie.title}`}
						aria-current={index === active}
						onClick={() => scrollTo(index)}
						className={`h-1 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-ring ${
							index === active ? "w-8 bg-primary" : "w-4 bg-foreground/30"
						}`}
					/>
				))}
			</div>
		</section>
	);
}
