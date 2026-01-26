import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ---------- AUTOCOMPLETE (TEMP STATIC) ---------- */
const suggestionsList = [
	'Sector 62 Noida',
	'Sector 137 Noida',
	'Alpha 1 Greater Noida',
	'Pari Chowk',
	'Knowledge Park',
	'Noida Extension',
];

/* ---------- DROPDOWN ---------- */
const Dropdown = ({ icon: Icon, label, value, setValue, options }) => {
	const [open, setOpen] = useState(false);
	const ref = useRef(null);

	useEffect(() => {
		const handler = (e) => {
			if (ref.current && !ref.current.contains(e.target)) setOpen(false);
		};
		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, []);

	return (
		<div ref={ref} className="relative w-full sm:w-auto">
			<button
				type="button"
				onClick={() => setOpen(!open)}
				className="w-full h-12 sm:h-11 px-3 flex items-center justify-between rounded-xl border bg-white dark:bg-[#0b1220] text-sm"
			>
				<div className="flex items-center gap-2 min-w-0">
					{Icon && <Icon className="w-4 h-4 text-slate-400 shrink-0" />}
					<span
						className={`truncate ${
							value ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'
						}`}
					>
						{value || label}
					</span>
				</div>
				<ChevronDown
					className={`w-4 h-4 shrink-0 transition-transform ${
						open ? 'rotate-180' : ''
					}`}
				/>
			</button>

			{open && (
				<div className="absolute left-0 right-0 mt-2 z-50 bg-white dark:bg-[#0b1220] border rounded-xl shadow max-h-[180px] overflow-y-auto mb-6">
					{options.map((o) => (
						<div
							key={o}
							onClick={() => {
								setValue(o);
								setOpen(false);
							}}
							className="px-4 py-3 text-sm hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
						>
							{o}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

/* ---------- HERO SECTION ---------- */
export const HeroSection = () => {
	const navigate = useNavigate();

	const [activeTab, setActiveTab] = useState('rent');
	const [city, setCity] = useState('Noida');
	const [searchText, setSearchText] = useState('');
	const [showAuto, setShowAuto] = useState(false);

	const [bhk, setBhk] = useState('');
	const [budget, setBudget] = useState('');
	const [homeType, setHomeType] = useState('');
	const [unitType, setUnitType] = useState('');
	const [moveIn, setMoveIn] = useState('');

	const bgImages = {
		rent: '/images/hero-rent.jpg',
		buy: '/images/hero-buy.jpg',
		pre: '/images/hero-pre.jpg',
	};

	const resetFilters = () => {
		setBhk('');
		setBudget('');
		setHomeType('');
		setUnitType('');
		setMoveIn('');
	};

	useEffect(() => {
		resetFilters();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeTab]);

	const handleSearch = async () => {
		const params = new URLSearchParams({
			tab: activeTab,
			city,
			search: searchText,
			bhk,
			budget,
			homeType,
			unitType,
			moveIn,
		});

		navigate(`/search?${params.toString()}`);

		try {
			await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/api/properties?${params.toString()}`,
			);
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<section className="relative min-h-[90vh] sm:min-h-screen overflow-hidden -mt-8 sm:-mt-6">
			{/* BG IMAGE */}
			<div
				className="absolute inset-0 bg-cover bg-center scale-105"
				style={{ backgroundImage: `url('${bgImages[activeTab]}')` }}
			/>

			{/* OVERLAY */}
			<div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white/80 dark:from-[#0b1220]/90 dark:via-[#0b1220]/85 dark:to-[#0b1220]/95" />

			{/* TABS */}
			<div className="absolute top-24 sm:top-36 left-1/2 -translate-x-1/2 z-20 w-full px-4">
				<div className="flex justify-center">
					<div className="flex bg-white/90 dark:bg-[#0b1220]/80 rounded-full p-1 mb-6 sm:mb-8 w-full max-w-[360px] sm:max-w-none sm:w-auto">
						{['rent', 'pre', 'buy'].map((tab) => (
							<button
								type="button"
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`flex-1 sm:flex-none px-5 py-2 rounded-full text-sm transition ${
									activeTab === tab
										? 'bg-teal-600 text-white'
										: 'text-slate-700 dark:text-slate-200'
								}`}
							>
								{tab === 'rent'
									? 'Rent'
									: tab === 'pre'
										? 'Pre-Occupied'
										: 'Buy'}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* HERO TEXT */}
			<div className="relative z-10 text-center w-full max-w-6xl mx-auto px-4 pt-48 sm:pt-60">
				<h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-teal-500 dark:text-white">
					{activeTab === 'rent' && (
						<>
							Find Your Rental{' '}
							<span className="text-yellow-500 dark:text-teal-400 font-bold">
								Sukoon.
							</span>
						</>
					)}

					{activeTab === 'buy' && (
						<span className="inline-block">
							Discover Your Future{' '}
							<span className="text-yellow-500 dark:text-yellow-500 font-bold">
								Property.
							</span>
						</span>
					)}

					{activeTab === 'pre' && (
						<>
							Managed Homes for{' '}
							<span className="text-yellow-500 dark:text-yellow-400 font-bold">
								Living.
							</span>
						</>
					)}
				</h1>

				<p
					className="
            mt-3 sm:mt-6
            text-lg sm:text-xl md:text-2xl
            leading-relaxed
            text-black-600 dark:text-slate-300
            max-w-3xl mx-auto
          "
				>
					{activeTab === 'rent' &&
						'Calm, friendly, aspirational living spaces for your comfort.'}
					{activeTab === 'buy' &&
						'Verified listings and expert guidance for buyers.'}
					{activeTab === 'pre' &&
						'Premium pre-occupied homes with full service.'}
				</p>
			</div>

			{/* SEARCH BAR */}
			<div className="relative z-10 mt-8 sm:mt-10 w-full max-w-6xl mx-auto px-4">
				<div className="bg-white/90 dark:bg-[#0b1220]/85 rounded-2xl shadow-2xl p-4 flex flex-col md:flex-row gap-3">
					<Dropdown
						icon={MapPin}
						label="City"
						value={city}
						setValue={setCity}
						options={['Noida', 'Greater Noida', 'Noida Extension', 'Ghaziabad']}
					/>

					{/* SEARCH */}
					<div className="relative flex-1">
						<input
							value={searchText}
							onChange={(e) => {
								setSearchText(e.target.value);
								setShowAuto(true);
							}}
							onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
							placeholder="Search locality / society / landmark"
							className="w-full h-11 px-4 rounded-xl border text-sm bg-white dark:bg-[#0b1220] text-slate-900 dark:text-slate-100 border-slate-300/50 dark:border-white/10"
						/>

						{showAuto && searchText && (
							<div className="absolute left-0 right-0 mt-1 z-50 bg-white dark:bg-[#0b1220] border rounded-xl shadow-xl">
								{suggestionsList
									.filter((s) =>
										s.toLowerCase().includes(searchText.toLowerCase()),
									)
									.slice(0, 5)
									.map((s) => (
										<div
											key={s}
											onClick={() => {
												setSearchText(s);
												setShowAuto(false);
											}}
											className="px-4 py-2 text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10"
										>
											{s}
										</div>
									))}
							</div>
						)}
					</div>

					{/* DESKTOP FILTERS */}
					<div className="hidden md:flex gap-3">
						{activeTab === 'rent' && (
							<>
								<Dropdown
									label="Home Type"
									value={homeType}
									setValue={setHomeType}
									options={['Full House', 'Flatmates', 'PG / Hostel']}
								/>
								<Dropdown
									label="BHK"
									value={bhk}
									setValue={setBhk}
									options={['1RK', '1BHK', '2BHK', '3BHK', '4BHK+']}
								/>
							</>
						)}

						{activeTab === 'buy' && (
							<>
								<Dropdown
									label="Budget"
									value={budget}
									setValue={setBudget}
									options={['<30L', '30–50L', '50–80L', '80L–1.2Cr', '1.2Cr+']}
								/>
								<Dropdown
									label="BHK"
									value={bhk}
									setValue={setBhk}
									options={['1', '2', '3', '4+']}
								/>
							</>
						)}

						{activeTab === 'pre' && (
							<>
								<Dropdown
									label="Unit Type"
									value={unitType}
									setValue={setUnitType}
									options={['Private Room', 'Shared Room', 'Entire Flat']}
								/>
								<Dropdown
									label="Move-in"
									value={moveIn}
									setValue={setMoveIn}
									options={['Immediate', 'This Week', 'This Month']}
								/>
							</>
						)}
					</div>

					<button
						onClick={handleSearch}
						className="h-11 px-8 bg-teal-600 text-white rounded-xl flex items-center justify-center gap-2"
					>
						<Search className="w-4 h-4" />
						Search
					</button>

					{/* ✅ MOBILE FILTERS (2 in 1 row) */}
					<div className="md:hidden">
						{activeTab === 'rent' && (
							<div className="grid grid-cols-2 gap-3 mt-3">
								<Dropdown
									label="Home Type"
									value={homeType}
									setValue={setHomeType}
									options={['Full House', 'Flatmates', 'PG / Hostel']}
								/>
								<Dropdown
									label="BHK"
									value={bhk}
									setValue={setBhk}
									options={['1RK', '1BHK', '2BHK', '3BHK', '4BHK+']}
								/>
							</div>
						)}

						{activeTab === 'buy' && (
							<div className="grid grid-cols-2 gap-3 mt-3">
								<Dropdown
									label="Budget"
									value={budget}
									setValue={setBudget}
									options={['<30L', '30–50L', '50–80L', '80L–1.2Cr', '1.2Cr+']}
								/>
								<Dropdown
									label="BHK"
									value={bhk}
									setValue={setBhk}
									options={['1', '2', '3', '4+']}
								/>
							</div>
						)}

						{activeTab === 'pre' && (
							<div className="grid grid-cols-2 gap-3 mt-3">
								<Dropdown
									label="Unit Type"
									value={unitType}
									setValue={setUnitType}
									options={['Private Room', 'Shared Room', 'Entire Flat']}
								/>
								<Dropdown
									label="Move-in"
									value={moveIn}
									setValue={setMoveIn}
									options={['Immediate', 'This Week', 'This Month']}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
};
