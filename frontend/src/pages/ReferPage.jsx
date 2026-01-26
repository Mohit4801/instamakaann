import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	User,
	Share2,
	Wallet,
	Trophy,
	ArrowRight,
	Building2,
	Home,
	Key,
	Gift,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tabContent = {
	'pre-occupied': {
		headline: 'Refer a Property Owner. Earn Big!',
		bullets: [
			'Refer: Connect us with property owners looking for hassle-free management.',
			'They Join: When their property gets managed by InstaMakaan.',
			'You Earn: Receive ₹5,000 for every successful referral!',
		],
		icon: Building2,
		video: '/videos/refer 1.mp4',
	},

	rent: {
		headline: 'Refer a Tenant. Get Rewarded!',
		bullets: [
			'Refer: Share InstaMakaan with friends looking for a home.',
			'They Move In: When they successfully rent through us.',
			'You Earn: Receive ₹2,000 for every successful referral!',
		],
		icon: Key,
		video: '/videos/refer 2.mp4',
	},

	buy: {
		headline: 'Refer a Buyer. Earn Maximum!',
		bullets: [
			'Refer: Connect us with property buyers or investors.',
			'They Purchase: When they buy a property through InstaMakaan.',
			'You Earn: Receive ₹25,000 for every successful referral!',
		],
		icon: Home,
		video: '/videos/refer 3.mp4',
	},
};

const steps = [
	{
		icon: User,
		title: 'Get Your Unique Code',
		description:
			'Sign up or log in to generate your personalized referral code.',
	},
	{
		icon: Share2,
		title: 'Share with Confidence',
		description:
			'Share your code with friends, family, or colleagues who need rental/property solutions.',
	},
	{
		icon: Wallet,
		title: 'Track & Earn',
		description:
			"We'll notify you when your referral converts, and your reward will be processed!",
	},
];

const leaderboard = [
	{ rank: 1, name: 'Riya Sharma', earnings: '₹75,000', referrals: 15 },
	{ rank: 2, name: 'Amit Verma', earnings: '₹60,000', referrals: 12 },
	{ rank: 3, name: 'Priya Kapoor', earnings: '₹45,000', referrals: 9 },
	{ rank: 4, name: 'Rahul Singh', earnings: '₹30,000', referrals: 6 },
	{ rank: 5, name: 'Neha Gupta', earnings: '₹25,000', referrals: 5 },
];

const ReferPage = () => {
	const [activeTab, setActiveTab] = useState('pre-occupied');
	const content = tabContent[activeTab];

	return (
		<Layout>
			{/* Hero Section */}
			<section className="relative overflow-hidden -mt-6 pt-16 md:pt-20 pb-6 md:pb-16">
				<div className="absolute inset-0 -z-10 bg-gradient-to-br from-teal-50 via-white to-yellow-50 dark:from-[#0b1220] dark:via-[#0b1220] dark:to-[#0f1f2e]" />
				<div className="absolute -top-24 -left-24 w-80 h-80 bg-teal-400/20 blur-3xl rounded-full -z-10" />
				<div className="absolute -bottom-24 -right-24 w-80 h-80 bg-yellow-400/20 blur-3xl rounded-full -z-10" />

				<div className="container-custom">
					<div className="text-center">
						<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3">
							Refer & Earn with InstaMakaan
						</h1>
						<p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto md:whitespace-nowrap">
							Share the Sukoon. Get rewarded for spreading reliability and
							trust.
						</p>
					</div>
				</div>
			</section>

			{/* Tabs + Content (Below Hero) */}
			{/* Tabs + Content (Below Hero) */}
			<section className="py-10 md:py-14 bg-background">
				<div className="container-custom">
					{/* Tabs */}
					<div className="flex justify-center mb-6">
						<Tabs value={activeTab} onValueChange={setActiveTab}>
							<TabsList className="h-auto p-1 bg-muted/50 backdrop-blur-sm rounded-xl">
								<TabsTrigger
									value="buy"
									className="px-4 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
								>
									BUY
								</TabsTrigger>

								<TabsTrigger
									value="pre-occupied"
									className="px-4 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
								>
									PRE-OCCUPIED
								</TabsTrigger>

								<TabsTrigger
									value="rent"
									className="px-4 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
								>
									RENT
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>

					{/* Content Card */}
					<Card className="bg-card border-0 shadow-elevated overflow-hidden max-w-10xl mx-auto rounded-3xl">
						<CardContent className="p-0">
							<div className="grid md:grid-cols-2">
								{/* LEFT CONTENT */}
								<div
									key={activeTab}
									className="p-8 md:p-12 flex flex-col justify-center"
								>
									<h2 className="text-2xl md:text-4xl font-extrabold text-foreground mb-6 leading-tight md:whitespace-nowrap">
										{content.headline}
									</h2>

									<ul className="space-y-4 mb-10 md:text-3xl">
										{content.bullets.map((bullet, index) => (
											<li key={index} className="flex items-start gap-3">
												<Gift className="w-5 h-5 text-yellow-500 shrink-0 mt-1" />
												<span className="text-muted-foreground text-lg leading-relaxed">
													{bullet}
												</span>
											</li>
										))}
									</ul>

									{/* Buttons */}
									<div className="flex flex-col sm:flex-row gap-4 w-full">
										<Button
											variant="teal"
											size="lg"
											className="w-full sm:w-auto justify-center"
										>
											How Does It Work?
											<ArrowRight className="w-4 h-4 ml-2" />
										</Button>

										<Button
											variant="yellow"
											size="lg"
											className="w-full sm:w-auto justify-center"
										>
											Sign Up / Login to Earn
										</Button>
									</div>
								</div>

								{/* RIGHT VIDEO */}
								<div className="relative p-8 md:p-12 flex items-center justify-end">
									{/* Glow only (NO background color) */}
									<div className="absolute -top-14 -left-14 w-64 h-64 bg-teal-400/25 blur-3xl rounded-full" />
									<div className="absolute -bottom-14 -right-14 w-64 h-64 bg-yellow-400/25 blur-3xl rounded-full" />

									<div className="relative w-full max-w-[420px]">
										{/* Glow behind video */}
										<div className="absolute -inset-5 rounded-[36px] bg-gradient-to-br from-teal-400/35 via-cyan-300/20 to-yellow-400/30 blur-2xl opacity-90" />

										{/* Video Container */}
										<div className="relative z-10 rounded-[60px] overflow-hidden shadow-2xl border border-white/40 bg-transparent">
											<video
												key={activeTab}
												src={content.video}
												autoPlay
												muted
												loop
												playsInline
												className="w-full h-auto object-contain rounded-[32px]"
											/>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* How It Works */}
			<section className="py-16 md:py-24 section-white">
				<div className="container-custom">
					<div className="text-center mb-12">
						<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 md:whitespace-nowrap ">
							Earn in 3 Simple Steps Using Your Referral Code
						</h2>
						<p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
							It&apos;s easy to share the InstaMakaan advantage and get
							rewarded.
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{steps.map((step, index) => (
							<div key={step.title} className="text-center">
								<div className="relative inline-block mb-6">
									<div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
										<step.icon className="w-10 h-10 text-primary" />
									</div>
									<div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm">
										{index + 1}
									</div>
								</div>
								<h3 className="text-lg font-semibold text-foreground mb-2">
									{step.title}
								</h3>
								<p className="text-muted-foreground">{step.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Leaderboard */}
			<section className="py-16 md:py-24 section-light">
				<div className="container-custom">
					<div className="text-center mb-12">
						<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
							<Trophy className="w-8 h-8 md:w-10 md:h-10 text-accent" />
							InstaMakaan Referral Champions
						</h2>
						<p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
							See who&apos;s earning the most and topping our charts! Will you
							be next?
						</p>
					</div>

					<Card className="bg-card border-0 shadow-card max-w-3xl mx-auto overflow-hidden">
						<Table>
							<TableHeader>
								<TableRow className="bg-muted/50">
									<TableHead className="font-semibold">Rank</TableHead>
									<TableHead className="font-semibold">Name</TableHead>
									<TableHead className="font-semibold text-right">
										Total Earnings
									</TableHead>
									<TableHead className="font-semibold text-right">
										Referrals
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{leaderboard.map((entry) => (
									<TableRow key={entry.rank}>
										<TableCell>
											<div
												className={cn(
													'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
													entry.rank === 1 &&
														'bg-accent text-accent-foreground',
													entry.rank === 2 &&
														'bg-muted-foreground/20 text-foreground',
													entry.rank === 3 && 'bg-primary/20 text-primary',
													entry.rank > 3 && 'bg-muted text-muted-foreground',
												)}
											>
												{entry.rank}
											</div>
										</TableCell>
										<TableCell className="font-medium">{entry.name}</TableCell>
										<TableCell className="text-right font-semibold text-success">
											{entry.earnings}
										</TableCell>
										<TableCell className="text-right">
											{entry.referrals}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Card>
				</div>
			</section>
		</Layout>
	);
};

export default ReferPage;
