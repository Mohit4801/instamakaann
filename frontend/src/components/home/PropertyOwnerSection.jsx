import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';

/* ================= INLINE ANIMATIONS ================= */
const SectionAnimations = () => (
	<style>{`
    @keyframes phoneFloat {
      0%,100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }
    @keyframes iconFloat {
      0%,100% { opacity:.6; transform: translateY(0); }
      50% { opacity:1; transform: translateY(-10px); }
    }
    @keyframes glowAnim {
      0%,100% { opacity:.35; }
      50% { opacity:.7; }
    }
    @keyframes waveMove {
      0%,100% { transform: translateX(0); }
      50% { transform: translateX(28px); }
    }
    .animate-phone { animation: phoneFloat 4s ease-in-out infinite; }
    .animate-icon { animation: iconFloat 3.8s ease-in-out infinite; }
    .animate-glow { animation: glowAnim 6s ease-in-out infinite; }
    .animate-wave { animation: waveMove 10s ease-in-out infinite; }
  `}</style>
);

export const PropertyOwnerSection = () => {
	return (
		<section className="py-16 sm:py-20 md:py-28 bg-slate-50 dark:bg-[#0b1220]">
			<SectionAnimations />

			<div className="container-custom owner-wide">
				<div className="flex flex-col lg:flex-row items-center gap-12">
					{/* ================= PHONE ================= */}
					<div className="relative flex justify-center w-full lg:w-[38%]">
						<div
							className="absolute w-[320px] sm:w-[360px] h-[400px] sm:h-[440px] bg-gradient-to-br 
              from-teal-400/40 via-cyan-300/30 to-yellow-300/30 
              rounded-full blur-3xl animate-glow"
						/>

						<div
							className="relative z-10 w-[220px] sm:w-[260px] md:w-[300px] aspect-[9/19]
              rounded-[38px] bg-neutral-900 shadow-2xl 
              overflow-hidden "
							//   rounded-[35px] bg-black"
						>
							<video
								src="/videos/property-owner.mp4"
								autoPlay
								muted
								loop
								playsInline
								className="w-full h-full object-cover"
							/>
						</div>
					</div>

					{/* ================= TEXT ================= */}
					<div className="relative w-full lg:w-[62%] px-6 sm:px-10 lg:px-12 py-10 rounded-3xl">
						<div
							className="absolute inset-0 -z-10 bg-gradient-to-br 
              from-teal-50 via-white to-yellow-50
              dark:from-[#0f1f2e] dark:via-[#0b1220] dark:to-[#1a1405]"
						/>

						<h2
							className="
                text-3xl sm:text-4xl md:text-5xl lg:text-[50px]
                leading-tight
                font-extrabold text-slate-900 dark:text-white
                mb-6
              "
						>
							Are You a Property Owner?
						</h2>

						<p className="text-base sm:text-lg md:text-[22px] text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
							InstaMakaan helps you convert your property into a predictable,
							high-earning asset with guaranteed monthly income.
						</p>

						<div className="space-y-4 mb-10">
							{[
								'Guaranteed rental income every month',
								'Professional property management',
								'Verified & reliable tenants',
								'Zero-hassle maintenance',
							].map((point, i) => (
								<div key={i} className="flex items-start gap-3">
									<CheckCircle2 className="text-teal-500 w-5 h-5 mt-1" />
									<span className="text-base md:text-lg text-slate-700 dark:text-slate-300">
										{point}
									</span>
								</div>
							))}
						</div>

						<div className="flex flex-col items-start">
							<Button variant="teal" size="lg" className="px-8 py-4 rounded-xl">
								<Link to="/contact" className="flex items-center gap-2">
									Contact Us Now
									<ArrowRight className="w-5 h-5" />
								</Link>
							</Button>

							{/* ✅ BROCHURE DOWNLOAD LINE (Local PDF Download) */}
							<div className="mt-4 flex items-center gap-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">
								<span>Download our</span>

								<a
									href="/pdf/brochure-property-owners.pdf"
									download
									className="font-semibold text-slate-900 dark:text-white underline underline-offset-4 decoration-yellow-400 hover:text-teal-600 transition"
								>
									FREE Owner’s Brochure
								</a>

								<ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-300" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
