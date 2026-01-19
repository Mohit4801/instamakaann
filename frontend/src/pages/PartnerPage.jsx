import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	ChevronLeft,
	ChevronRight,
	CheckCircle2,
	ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

/* ================= HERO SLIDES ================= */
const heroSlides = [
	{
		headline: 'End the Renting Headaches. Discover True Rental Sukoon.',
		description:
			'Transform your property management experience with InstaMakaan.',
		image: '/images/owner-1.jpg',
	},
	{
		headline: 'Predictable Income, Guaranteed Peace of Mind.',
		description:
			'Never worry about missed rent payments or difficult tenants again.',
		image: '/images/owner-2.jpg',
	},
	{
		headline: 'We Handle It All, You Enjoy the Returns.',
		description: 'From tenant screening to maintenance, we manage everything.',
		image: '/images/owner-3.jpg',
	},
	{
		headline: "Unlock Your Property's Full Potential.",
		description: 'Maximize your rental income with professional management.',
		image: '/images/owner-4.jpg',
	},
];

/* ================= SERVICES ================= */
const services = [
	{
		id: 'payment',
		headline: 'Never Chase Rent Again.',
		video: '/videos/rent.mp4',
		features: [
			'Automated reminders & follow-ups.',
			'Guaranteed monthly payouts.',
			'No rent delays.',
			'Transparent statements.',
		],
		cta: 'Learn More About Rent Collection',
	},
	{
		id: 'tenant',
		headline: 'The Right Tenant, Every Time.',
		video: '/videos/tenant.mp4',
		features: [
			'Rigorous KYC & background checks.',
			'Behavioral screening.',
			'Fast tenant placement.',
			'Wide verified network.',
		],
		cta: 'Contact Us for Tenant Screening',
	},
	{
		id: 'income',
		headline: 'Maximize Your Earning Potential.',
		video: '/videos/income.mp4',
		features: [
			'Full occupancy promise.',
			'Optimized rental pricing.',
			'Asset protection.',
			'100% transparency.',
		],
		cta: 'Get Your Personalized Plan',
	},
];

const PartnerPage = () => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const intervalRef = useRef(null);

	/* ===== AUTOPLAY (NO HOVER PAUSE) ===== */
	useEffect(() => {
		intervalRef.current = setInterval(() => {
			setCurrentSlide((p) => (p + 1) % heroSlides.length);
		}, 4500);
		return () => clearInterval(intervalRef.current);
	}, []);

	return (
		<Layout>
			{/* ================= HERO ================= */}
			<section className="relative min-h-screen overflow-hidden -mt-14">
				<div
					className="absolute inset-0 bg-cover bg-center scale-105 transition-all duration-1000"
					style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}
				/>

				{/* SAME WHITE BLUR + DARK GRADIENT */}
				<div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white/80 dark:from-[#0b1220]/90 dark:via-[#0b1220]/85 dark:to-[#0b1220]/95 backdrop-blur-[0.5px]" />

				<div className="relative z-10 min-h-screen flex items-center justify-center text-center px-6">
					<div className="max-w-5xl">
						<h1 className="text-4xl md:text-5xl font-bold mb-6">
							Are You a Property Owner?
						</h1>
						<h2 className="text-2xl md:text-3xl text-teal-500 mb-4">
							{heroSlides[currentSlide].headline}
						</h2>
						<p className="text-lg text-muted-foreground mb-8">
							{heroSlides[currentSlide].description}
						</p>
						<Button variant="yellow" size="lg" asChild>
							<Link to="/contact">Partner With Us</Link>
						</Button>
					</div>
				</div>

				{/* ARROWS – TRANSPARENT, DESKTOP ONLY */}
				<button
					onClick={() =>
						setCurrentSlide(
							(p) => (p - 1 + heroSlides.length) % heroSlides.length,
						)
					}
					className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition"
				>
					<ChevronLeft size={42} />
				</button>
				<button
					onClick={() => setCurrentSlide((p) => (p + 1) % heroSlides.length)}
					className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition"
				>
					<ChevronRight size={42} />
				</button>
			</section>

			{/* ================= SERVICES (VIDEO + CONTENT IN ONE BOX) ================= */}
			{services.map((service, index) => (
				<section
					key={service.id}
					className="py-14 md:py-20 bg-slate-50 dark:bg-[#0f172a]"
				>
					<div className="container-custom">
						<Card className="rounded-3xl overflow-hidden shadow-xl bg-white dark:bg-[#0b1220]">
							<CardContent
								className={cn(
									'grid md:grid-cols-2 gap-8 items-center p-6 md:p-10',
									index % 2 === 1 && 'md:[&>*:first-child]:order-2',
								)}
							>
								{/* VIDEO BOX — SMALLER + 3:4 */}
								<div className="flex justify-center">
									<div className="relative w-[220px] sm:w-[250px] md:w-[280px] aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
										<video
											src={service.video}
											autoPlay
											muted
											loop
											playsInline
											className="w-full h-full object-cover"
										/>
										<div className="absolute inset-0 bg-black/10" />
									</div>
								</div>

								{/* CONTENT */}
								<div>
									<h3 className="text-2xl font-bold mb-5">
										{service.headline}
									</h3>
									<ul className="space-y-3 mb-6">
										{service.features.map((f, i) => (
											<li key={i} className="flex gap-3">
												<CheckCircle2 className="text-teal-500 mt-1" />
												<span>{f}</span>
											</li>
										))}
									</ul>
									<Button variant="teal" asChild>
										<Link to="/contact">
											{service.cta}
											<ArrowRight className="ml-2 w-4 h-4" />
										</Link>
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</section>
			))}
		</Layout>
	);
};

export default PartnerPage;
