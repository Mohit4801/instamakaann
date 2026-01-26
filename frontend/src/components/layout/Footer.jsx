import React from 'react';
import { Link } from 'react-router-dom';
import {
	Facebook,
	Instagram,
	Linkedin,
	Phone,
	Mail,
	MapPin,
} from 'lucide-react';

const navigationLinks = [
	{ name: 'Home', path: '/' },
	{ name: 'Partner with us', path: '/partner' },
	{ name: 'Explore Property', path: '/properties' },
	{ name: 'About Us', path: '/about' },
	{ name: 'Contact Us', path: '/contact' },
];

const serviceLinks = [
	{ name: 'Rent', path: '#' },
	{ name: 'Pre-Occupied', path: '#' },
	{ name: 'Buy', path: '#' },
	{ name: 'Blog', path: '/blog' },
	{ name: 'FAQs', path: '/faq' },
];

const socialLinks = [
	{
		name: 'Facebook',
		icon: Facebook,
		url: 'https://www.facebook.com/share/1DTjmoeU8R/',
	},
	{
		name: 'Instagram',
		icon: Instagram,
		url: 'https://instagram.com/instamakaan',
	},
	{
		name: 'LinkedIn',
		icon: Linkedin,
		url: 'https://www.linkedin.com/company/instamakaan/',
	},
];

export const Footer = () => {
	return (
		<footer className="bg-white-100 dark:bg-white-100 text-slate-900 dark:text-slate-200 transition-colors">
			<div className="container-custom py-12 md:py-9">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">
					{/* Brand */}
					<div className="sm:col-span-2 lg:col-span-1">
						<Link to="/" className="flex items-center gap-3 mb-5">
							<img
								src="/images/orglogo.png"
								alt="InstaMakaan Logo"
								className="w-12 h-12 object-contain shrink-0"
							/>

							<div className="leading-tight">
								<span className="text-xl font-bold text-black-500">Insta</span>
								<span className="text-xl font-bold text-black-500">Makaan</span>
							</div>
						</Link>

						<p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 max-w-sm">
							Delivering rental Sukoon to property owners and tenants. Our
							mission is to be the most trusted, professional, and reliable name
							in real estate.
						</p>

						<div className="flex items-center gap-3">
							{socialLinks.map((social) => (
								<a
									key={social.name}
									href={social.url}
									aria-label={social.name}
									target="_blank"
									rel="noreferrer"
									className="
                    w-10 h-10 rounded-xl flex items-center justify-center
                    bg-slate-200/70 dark:bg-white/10
                    text-slate-700 dark:text-slate-300
                    hover:bg-teal-600 hover:text-white
                    transition-all duration-300
                  "
								>
									<social.icon className="w-5 h-5" />
								</a>
							))}
						</div>
					</div>

					{/* Navigation */}
					<div>
						<h3 className="text-lg font-semibold mb-4">Navigation</h3>
						<ul className="space-y-3">
							{navigationLinks.map((link) => (
								<li key={link.path}>
									<Link
										to={link.path}
										className="text-sm text-slate-600 dark:text-slate-400 hover:text-teal-600 transition"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Services */}
					<div>
						<h3 className="text-lg font-semibold mb-4">Services</h3>
						<ul className="space-y-3">
							{serviceLinks.map((link) => (
								<li key={link.path}>
									<Link
										to={link.path}
										className="text-sm text-slate-600 dark:text-slate-400 hover:text-teal-600 transition"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h3 className="text-lg font-semibold mb-4">Contact</h3>
						<ul className="space-y-4">
							<li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
								<Phone className="w-4 h-4 shrink-0" />
								<span className="break-words">+91 9771034916</span>
							</li>

							<li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
								<Mail className="w-4 h-4 shrink-0" />
								<span className="break-words">info@instamakaan.com</span>
							</li>

							<li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
								<MapPin className="w-5 h-5 mt-0.5 shrink-0" />
								<span className="leading-relaxed">
									Tower T2, Flat B809, Tech Zone 4, Plot 17, Amrapali Dream
									Valley,
									<br />
									Greater Noida, Uttar Pradesh 201318
								</span>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Bottom */}
			<div className="border-t border-slate-200 dark:border-white/10">
				<div className="container-custom py-6">
					<div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
						<p className="text-center sm:text-left">
							©️ 2025 InstaMakaan. All Rights Reserved.
						</p>

						<div className="flex flex-wrap justify-center sm:justify-end gap-3">
							<Link to="/privacy" className="hover:text-teal-600 transition">
								Privacy Policy
							</Link>
							<span className="opacity-50">|</span>
							<Link to="/terms" className="hover:text-teal-600 transition">
								Terms of Service
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};
