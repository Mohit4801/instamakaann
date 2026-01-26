import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CustomIcon from '@/components/CustomIcon';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User, Sun, Moon, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
	{ name: 'Home', path: '/' },
	{ name: 'Partner With Us', path: '/partner' },
	{ name: 'FAQ', path: '/faq' },
];

const moreLinks = [
	{ name: 'Blog', path: '/blog' },
	{ name: 'About Us', path: '/about' },
	{ name: 'Refer & Earn', path: '/refer' },
];

export const Header = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [theme, setTheme] = useState('light');
	const [openMore, setOpenMore] = useState(false);
	const location = useLocation();

	useEffect(() => {
		const handleScroll = () => setIsScrolled(window.scrollY > 8);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	useEffect(() => {
		const savedTheme = localStorage.getItem('theme') || 'light';
		setTheme(savedTheme);
		document.documentElement.classList.toggle('dark', savedTheme === 'dark');
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		setTheme(newTheme);
		localStorage.setItem('theme', newTheme);
		document.documentElement.classList.toggle('dark', newTheme === 'dark');
	};

	const isActive = (path) => location.pathname === path;

	const toggleMore = () => {
		setOpenMore((prev) => !prev);
	};

	useEffect(() => {
		const handleClickOutside = (e) => {
			const target = e.target;
			if (!target.closest('.more-dropdown-container')) {
				setOpenMore(false);
			}
		};

		if (openMore) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [openMore]);
	useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.classList.add('menu-open-blur');
		} else {
			document.body.classList.remove('menu-open-blur');
		}

		return () => document.body.classList.remove('menu-open-blur');
	}, [isMobileMenuOpen]);

	return (
		<header
			className={cn(
				'fixed top-0 left-0 right-0 z-[9999] transition-all duration-300',
				'overflow-visible',
				isScrolled
					? 'bg-white/90 dark:bg-[#0b1220]/90 backdrop-blur-xl shadow-sm'
					: 'bg-white/80 dark:bg-[#0b1220]/75 backdrop-blur-lg',
			)}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-14 w-full">
					{/* LOGO */}
					<Link to="/" className="flex items-center gap-2 mr-3 shrink-0">
						<CustomIcon src="/images/orglogo.png" className="h-8 w-8" />
						<div className="leading-tight">
							<div className="text-sm font-bold text-slate-900 dark:text-teal-400">
								Insta
							</div>
							<div className="text-sm font-bold text-slate-900 dark:text-yellow-400 -mt-1">
								Makaan
							</div>
						</div>
					</Link>

					{/* LEFT NAV (DESKTOP) */}
					<nav className="hidden lg:flex items-center gap-8 xl:gap-10">
						{navLinks.map((link) => (
							<Link
								key={link.path}
								to={link.path}
								className={cn(
									'text-sm font-medium transition-colors',
									isActive(link.path)
										? 'text-teal-600 dark:text-teal-400'
										: 'text-slate-700 dark:text-slate-300 hover:text-teal-600',
								)}
							>
								{link.name}
							</Link>
						))}

						{/* MORE */}
						<div className="relative more-dropdown-container z-[9999]">
							<button
								type="button"
								onClick={toggleMore}
								className="flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-teal-600"
							>
								More
								<ChevronDown
									className={cn(
										'w-4 h-4 transition-transform',
										openMore && 'rotate-180',
									)}
								/>
							</button>

							{openMore && (
								<div className="absolute top-full mt-2 w-40 rounded-xl bg-white dark:bg-[#0b1220] border shadow-lg overflow-hidden z-[99999]">
									{moreLinks.map((l) => (
										<Link
											key={l.path}
											to={l.path}
											onClick={() => setOpenMore(false)}
											className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10"
										>
											{l.name}
										</Link>
									))}
								</div>
							)}
						</div>
					</nav>

					{/* RIGHT ACTIONS (DESKTOP) */}
					<div className="hidden lg:flex items-center gap-3 lg:gap-4 xl:gap-5">
						<Button variant="teal" size="sm" asChild>
							<Link to="/contact">Contact Us</Link>
						</Button>

						<button
							type="button"
							onClick={toggleTheme}
							className="w-9 h-9 flex items-center justify-center rounded-full border dark:border-white/20"
						>
							{theme === 'light' ? (
								<Moon className="w-4 h-4" />
							) : (
								<Sun className="w-4 h-4" />
							)}
						</button>

						<Link
							to="/auth/login"
							className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border dark:border-white/20"
						>
							<User className="w-4 h-4" />
							Login
						</Link>
					</div>

					{/* ✅ MOBILE MENU */}
					<div className="lg:hidden flex items-center justify-end shrink-0">
						<Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
							<SheetTrigger asChild>
								<button
									type="button"
									className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur"
								>
									<Menu className="w-5 h-5 text-slate-900 dark:text-white" />
								</button>
							</SheetTrigger>

							<SheetContent
								side="right"
								className="w-[320px] p-0 dark:bg-[#0b1220] bg-white overflow-hidden h-[100dvh] max-h-[100dvh] z-[10000]"
								onInteractOutside={() => setIsMobileMenuOpen(false)}
								onEscapeKeyDown={() => setIsMobileMenuOpen(false)}
							>
								{/* ✅ FULL SCROLL AREA */}
								<div className="h-full overflow-y-auto overscroll-contain">
									{/* Header inside menu */}
									<div className="p-5 border-b border-slate-200/60 dark:border-white/10 bg-gradient-to-b from-teal-50/60 to-white dark:from-white/5 dark:to-transparent sticky top-0 z-10">
										<div className="flex items-center justify-between">
											<Link
												to="/"
												onClick={() => setIsMobileMenuOpen(false)}
												className="flex items-center gap-2"
											>
												<CustomIcon
													src="/images/orglogo.png"
													className="h-8 w-8"
												/>
												<div className="leading-tight">
													<div className="text-sm font-bold text-slate-900 dark:text-teal-400">
														Insta
													</div>
													<div className="text-sm font-bold text-slate-900 dark:text-yellow-400 -mt-1">
														Makaan
													</div>
												</div>
											</Link>
										</div>
									</div>

									{/* Links */}
									<div className="p-5 space-y-3">
										<p className="text-xs tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
											NAVIGATION
										</p>

										{[...navLinks, ...moreLinks].map((link) => (
											<Link
												key={link.path}
												to={link.path}
												onClick={() => setIsMobileMenuOpen(false)}
												className={cn(
													'block px-4 py-3 rounded-2xl text-sm font-medium transition',
													isActive(link.path)
														? 'bg-teal-600 text-white shadow'
														: 'bg-slate-100/70 dark:bg-white/5 text-slate-800 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-white/10',
												)}
											>
												{link.name}
											</Link>
										))}

										{/* Theme Toggle */}
										<button
											type="button"
											onClick={toggleTheme}
											className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border dark:border-white/10 bg-white/60 dark:bg-white/5"
										>
											{theme === 'light' ? (
												<Moon className="w-4 h-4" />
											) : (
												<Sun className="w-4 h-4" />
											)}
											{theme === 'light' ? 'Dark Mode' : 'Light Mode'}
										</button>

										{/* Actions */}
										<div className="pt-2 space-y-3 pb-8">
											<Link
												to="/contact"
												onClick={() => setIsMobileMenuOpen(false)}
												className="block w-full text-center px-4 py-3 rounded-2xl bg-teal-600 text-white font-semibold shadow"
											>
												Contact Us
											</Link>

											<Link
												to="/auth/login"
												onClick={() => setIsMobileMenuOpen(false)}
												className="block w-full text-center px-4 py-3 rounded-2xl border dark:border-white/10 bg-white/60 dark:bg-white/5 font-semibold"
											>
												Login
											</Link>
										</div>
									</div>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>
		</header>
	);
};
