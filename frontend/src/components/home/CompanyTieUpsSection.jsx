import React, { useState } from 'react';
import { cn } from '@/lib/utils';

const companies = [
	{ name: 'TechCorp', logo: 'TC' },
	{ name: 'GlobalTech', logo: 'GT' },
	{ name: 'InnovateCo', logo: 'IC' },
	{ name: 'FutureSoft', logo: 'FS' },
	{ name: 'DataDrive', logo: 'DD' },
	{ name: 'CloudNine', logo: 'CN' },
	{ name: 'SmartSys', logo: 'SS' },
	{ name: 'NextGen', logo: 'NG' },
];

export const CompanyTieUpsSection = () => {
	const [isPaused, setIsPaused] = useState(false);

	return (
		<section className="py-16 md:py-20 bg-slate-50 dark:bg-neutral-950">
			{/* ================= HEADER ================= */}
			<div className="container-custom mb-10">
				<h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white text-center mb-4">
					Trusted By Leading Companies
				</h2>

				<p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 text-center max-w-2xl mx-auto">
					We are a preferred rental partner for corporations in Noida & Greater
					Noida, helping their employees find verified homes, hassle-free.
				</p>
			</div>

			{/* ================= MARQUEE ================= */}
			<div
				className="relative w-full overflow-hidden"
				onMouseEnter={() => setIsPaused(true)}
				onMouseLeave={() => setIsPaused(false)}
			>
				<div className="flex">
					<div
						className={cn(
							'flex items-center gap-6 sm:gap-10 lg:gap-14 animate-marquee',
							isPaused && 'pause-animation',
						)}
					>
						{[...companies, ...companies].map((company, index) => (
							<div
								key={`${company.name}-${index}`}
								className="
                  w-24 h-16
                  sm:w-32 sm:h-20
                  lg:w-40 lg:h-24
                  flex-shrink-0
                  bg-white dark:bg-neutral-900
                  border border-gray-200 dark:border-white/10
                  rounded-xl shadow-sm
                  flex flex-col items-center justify-center
                "
							>
								<div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-400 dark:text-gray-500">
									{company.logo}
								</div>
								<div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">
									{company.name}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* ================= FADE EDGES ================= */}
				<div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-50 dark:from-neutral-950 to-transparent" />
				<div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-50 dark:from-neutral-950 to-transparent" />
			</div>

			{/* ================= CSS ================= */}
			<style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .animate-marquee {
          animation: marquee 28s linear infinite;
        }

        .pause-animation {
          animation-play-state: paused;
        }
      `}</style>
		</section>
	);
};
