import React, { useEffect, useMemo, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import api from '@/lib/api';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
	Filter,
	LayoutGrid,
	List,
	X,
	ChevronDown,
	ArrowUpDown,
} from 'lucide-react';

const headlines = [
	'24/7 Service. 100% Verified. Total Sukoon.',
	'Your Home, Your Vibe, Our Responsibility.',
	'Welcome to a Managed Home. Renting, Redefined.',
];

const AllPropertiesPage = () => {
	const [properties, setProperties] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	// Filters
	const [propertyTypes, setPropertyTypes] = useState([]);
	const [beds, setBeds] = useState([]);
	const [furnishing, setFurnishing] = useState([]);
	const [managedOnly, setManagedOnly] = useState(false);
	const [priceRange, setPriceRange] = useState([0, 50000]);
	const [showFilters, setShowFilters] = useState(false);

	// UI
	const [headlineIndex, setHeadlineIndex] = useState(0);
	const [view, setView] = useState('grid');

	// ✅ Sorting
	const [sortBy, setSortBy] = useState(''); // price_low | price_high
	const [openSort, setOpenSort] = useState(false);

	// ✅ get rent safely (this fixes sorting/filtering)
	const getRent = (p) => {
		// priority order (jo tumhare backend me ho sakta hai)
		const val =
			p?.monthly_rent_amount ?? p?.monthly_rent ?? p?.rent ?? p?.price ?? 0;

		const num = Number(val);
		return Number.isFinite(num) ? num : 0;
	};

	useEffect(() => {
		api
			.get('/properties/')
			.then((res) => setProperties(res.data))
			.catch(() => setError('Failed to load properties'))
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		const i = setInterval(
			() => setHeadlineIndex((p) => (p + 1) % headlines.length),
			3000,
		);
		return () => clearInterval(i);
	}, []);

	// ✅ max rent
	const maxRent = useMemo(() => {
		const rents = properties.map(getRent).filter((n) => n > 0);
		return rents.length ? Math.max(...rents) : 50000;
	}, [properties]);

	useEffect(() => {
		setPriceRange([0, maxRent]);
	}, [maxRent]);

	// Helpers
	const toggleArray = (value, setFn) => {
		setFn((prev) =>
			prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
		);
	};

	const clearFilters = () => {
		setPropertyTypes([]);
		setBeds([]);
		setFurnishing([]);
		setManagedOnly(false);
		setPriceRange([0, maxRent]);
	};

	// ✅ FILTERED
	const filteredProperties = useMemo(() => {
		return properties.filter((p) => {
			if (propertyTypes.length && !propertyTypes.includes(p.property_type))
				return false;

			if (beds.length) {
				const bedValue = String(p.beds ?? '');
				if (!beds.map(String).includes(bedValue)) return false;
			}

			if (furnishing.length) {
				const f = String(p.furnishing ?? '').toLowerCase();
				if (!furnishing.map((x) => x.toLowerCase()).includes(f)) return false;
			}

			if (managedOnly && !p.is_managed) return false;

			// ✅ price filter apply only for rent/pre-occupied
			if (p.property_type !== 'buy') {
				const rent = getRent(p);
				if (rent > 0) {
					if (rent < priceRange[0] || rent > priceRange[1]) return false;
				}
			}

			return true;
		});
	}, [properties, propertyTypes, beds, furnishing, managedOnly, priceRange]);

	// ✅ SORTED FINAL LIST (THIS IS REQUIRED)
	const finalProperties = useMemo(() => {
		const list = [...filteredProperties];

		if (sortBy === 'price_low') {
			list.sort((a, b) => getRent(a) - getRent(b));
		}

		if (sortBy === 'price_high') {
			list.sort((a, b) => getRent(b) - getRent(a));
		}

		return list;
	}, [filteredProperties, sortBy]);

	return (
		<Layout>
			{/* HERO */}
			<div className="w-full bg-gradient-to-b from-blue-100 via-white to-white -mt-24 pt-24">
				<div className="container-custom py-20 text-center min-h-[140px] flex flex-col justify-center">
					<h1
						key={headlineIndex}
						className="text-3xl md:text-5xl font-semibold text-[#42949c] transition-all duration-700 ease-in-out leading-tight md:leading-snug tracking-tight"
					>
						{headlines[headlineIndex]}
					</h1>

					<p className="text-lg text-muted-foreground mt-2">
						Showing {finalProperties.length} properties
					</p>

					<div className="flex justify-center gap-2 mt-4">
						{headlines.map((_, i) => (
							<span
								key={i}
								className={cn(
									'h-2 rounded-full transition-all',
									i === headlineIndex ? 'w-6 bg-[#42949c]' : 'w-2 bg-blue-300',
								)}
							/>
						))}
					</div>
				</div>
			</div>

			{/* CONTENT */}
			<div className="container-custom pb-10 pt-0">
				{/* TOP BAR */}
				<div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
					{/* view */}
					<div className="flex gap-2">
						<button
							onClick={() => setView('grid')}
							className={cn(
								'p-2 rounded-xl border bg-white shadow-sm hover:shadow-md transition',
								view === 'grid' && 'bg-blue-600 text-white border-blue-600',
							)}
						>
							<LayoutGrid size={18} />
						</button>

						<button
							onClick={() => setView('list')}
							className={cn(
								'p-2 rounded-xl border bg-white shadow-sm hover:shadow-md transition',
								view === 'list' && 'bg-blue-600 text-white border-blue-600',
							)}
						>
							<List size={18} />
						</button>
					</div>

					{/* sort */}
					<div className="relative">
						<button
							onClick={() => setOpenSort((p) => !p)}
							className="px-4 py-2 rounded-full border bg-white shadow-sm hover:shadow-md transition text-sm flex items-center gap-2"
						>
							<ArrowUpDown className="w-4 h-4 text-slate-500" />
							Sort
							<ChevronDown
								className={cn('w-4 h-4 transition', openSort && 'rotate-180')}
							/>
						</button>

						{openSort && (
							<div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border z-50 overflow-hidden">
								<button
									onClick={() => {
										setSortBy('price_low');
										setOpenSort(false);
									}}
									className={cn(
										'w-full text-left px-4 py-3 hover:bg-slate-50 text-sm',
										sortBy === 'price_low' && 'bg-slate-50 font-semibold',
									)}
								>
									Price: Low to High
								</button>

								<button
									onClick={() => {
										setSortBy('price_high');
										setOpenSort(false);
									}}
									className={cn(
										'w-full text-left px-4 py-3 hover:bg-slate-50 text-sm',
										sortBy === 'price_high' && 'bg-slate-50 font-semibold',
									)}
								>
									Price: High to Low
								</button>

								<button
									onClick={() => {
										setSortBy('');
										setOpenSort(false);
									}}
									className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm text-slate-600"
								>
									Clear Sort
								</button>
							</div>
						)}
					</div>

					{/* mobile filter */}
					<Button
						variant="outline"
						className="lg:hidden rounded-full"
						onClick={() => setShowFilters(true)}
					>
						<Filter className="w-4 h-4 mr-2" /> Filters
					</Button>
				</div>

				<div className="grid lg:grid-cols-[320px_1fr] gap-8">
					{/* FILTERS */}
					<aside
						className={cn(
							'bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] space-y-7 sticky top-24 h-fit border border-slate-200/60',
							showFilters
								? 'fixed inset-0 z-50 overflow-y-auto lg:static lg:inset-auto'
								: 'hidden lg:block',
						)}
					>
						{/* mobile header */}
						<div className="flex items-center justify-between lg:hidden">
							<h3 className="text-lg font-bold">Filters</h3>
							<button
								onClick={() => setShowFilters(false)}
								className="p-2 rounded-xl border bg-white shadow-sm"
							>
								<X className="w-4 h-4" />
							</button>
						</div>

						{/* Property type */}
						<div className="space-y-3">
							<h4 className="font-semibold text-slate-900">Property Type</h4>

							<div className="space-y-2">
								{['rent', 'pre-occupied', 'buy'].map((type) => (
									<label
										key={type}
										className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-50 transition cursor-pointer"
									>
										<Checkbox
											checked={propertyTypes.includes(type)}
											onCheckedChange={() =>
												toggleArray(type, setPropertyTypes)
											}
										/>
										<span className="capitalize text-sm font-medium text-slate-700">
											{type}
										</span>
									</label>
								))}
							</div>
						</div>

						{/* Beds */}
						<div className="space-y-3">
							<h4 className="font-semibold text-slate-900">Beds</h4>
							<div className="space-y-2">
								{['1', '2', '3', '4', '5+'].map((b) => (
									<label
										key={b}
										className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-50 transition cursor-pointer"
									>
										<Checkbox
											checked={beds.includes(b)}
											onCheckedChange={() => toggleArray(b, setBeds)}
										/>
										<span className="text-sm font-medium text-slate-700">
											{b}
										</span>
									</label>
								))}
							</div>
						</div>

						{/* Furnishing */}
						<div className="space-y-3">
							<h4 className="font-semibold text-slate-900">Furnishing</h4>
							<div className="space-y-2">
								{['Furnished', 'Semi-Furnished', 'Unfurnished'].map((f) => (
									<label
										key={f}
										className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-50 transition cursor-pointer"
									>
										<Checkbox
											checked={furnishing.includes(f)}
											onCheckedChange={() => toggleArray(f, setFurnishing)}
										/>
										<span className="text-sm font-medium text-slate-700">
											{f}
										</span>
									</label>
								))}
							</div>
						</div>

						{/* Managed */}
						<div className="space-y-3">
							<h4 className="font-semibold text-slate-900">Managed</h4>
							<label className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-slate-50 transition cursor-pointer">
								<Checkbox
									checked={managedOnly}
									onCheckedChange={() => setManagedOnly((p) => !p)}
								/>
								<span className="text-sm font-medium text-slate-700">
									Show Managed Homes Only
								</span>
							</label>
						</div>

						{/* Price */}
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<h4 className="font-semibold text-slate-900">Monthly Rent</h4>
								<span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
									₹{priceRange[0].toLocaleString()} - ₹
									{priceRange[1].toLocaleString()}
								</span>
							</div>

							<div className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm">
								<Slider
									min={0}
									max={maxRent}
									step={500}
									value={priceRange}
									onValueChange={setPriceRange}
								/>
							</div>
						</div>

						{/* Actions */}
						<div className="flex gap-3 pt-2">
							<Button
								variant="outline"
								className="w-full rounded-2xl"
								onClick={clearFilters}
							>
								Clear
							</Button>

							<Button
								variant="teal"
								className="w-full rounded-2xl lg:hidden"
								onClick={() => setShowFilters(false)}
							>
								Apply
							</Button>
						</div>
					</aside>

					{/* PROPERTIES */}
					<div>
						{loading && <p>Loading...</p>}
						{error && <p className="text-red-500">{error}</p>}

						<div
							className={cn(
								view === 'grid'
									? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-6'
									: 'space-y-6',
							)}
						>
							{finalProperties.map((property, i) => (
								<div
									key={property.id ?? i}
									className="animate-slideUp"
									style={{ animationDelay: `${i * 80}ms` }}
								>
									<PropertyCard property={property} />
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default AllPropertiesPage;
