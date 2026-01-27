import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { User, Phone } from 'lucide-react';
import {
	MapPin,
	ChevronLeft,
	ChevronRight,
	IndianRupee,
	Wallet,
	BadgeCheck,
	CalendarDays,
	CheckCircle,
	Home,
	Sofa,
	Bed,
	Lightbulb,
	Fan,
	Wifi,
	ShieldCheck,
	Car,
	ChefHat,
	Plug,
} from 'lucide-react';

/* ---------- SAFE NUMBER PARSER ---------- */
const toNumber = (val) => {
	if (!val) return 0;
	if (typeof val === 'number') return val;
	return Number(val.toString().replace(/[^\d]/g, '')) || 0;
};

/* ---------- ICON MAP ---------- */
const iconMap = {
	Lift: <Home size={14} />,
	Parking: <Car size={14} />,
	'24x7 Security': <ShieldCheck size={14} />,
	Security: <ShieldCheck size={14} />,
	Wifi: <Wifi size={14} />,
	Light: <Lightbulb size={14} />,
	Fan: <Fan size={14} />,
	Sofa: <Sofa size={14} />,
	Bed: <Bed size={14} />,
	Fridge: <ChefHat size={14} />,
	Microwave: <ChefHat size={14} />,
	'RO Water Purifier': <ChefHat size={14} />,
	'Gas Pipeline': <Plug size={14} />,
	AC: <Plug size={14} />,
	TV: <Plug size={14} />,
};

/* ---------- AMENITY COLOR MAP ---------- */
const amenityBgMap = {
	House: 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800',
	'Living Room':
		'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
	Kitchen:
		'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
	Bedroom:
		'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
};

/* ---------- AMENITIES PARSER (ULTRA SAFE FIX) ---------- */
const parseAmenities = (amenitiesArray = []) => {
	const base = {
		House: [],
		'Living Room': [],
		Kitchen: [],
		Bedroom: [],
	};

	if (!Array.isArray(amenitiesArray) || amenitiesArray.length === 0) {
		return base;
	}

	let raw = amenitiesArray[0];

	// 🧨 CASE: amenities stored as STRING
	if (typeof raw === 'string') {
		try {
			// 🔧 Fix invalid JSON (single quotes + unquoted keys)
			raw = raw
				.replace(/'/g, '"') // single → double quotes
				.replace(/(\w+)\s*:/g, '"$1":'); // House: → "House":

			raw = JSON.parse(raw);
		} catch (err) {
			console.error('Amenity parse failed:', err);
			return base;
		}
	}

	if (!Array.isArray(raw)) return base;

	raw.forEach((block) => {
		if (typeof block === 'object' && block !== null) {
			Object.entries(block).forEach(([section, items]) => {
				const cleanSection = section.trim();

				if (base[cleanSection] && Array.isArray(items)) {
					base[cleanSection] = items;
				}
			});
		}
	});

	return base;
};
const PropertyDetailPage = () => {
	const { id } = useParams();
	const [property, setProperty] = useState(null);
	const [related, setRelated] = useState([]);
	const [index, setIndex] = useState(0);
    
  const [visitName, setVisitName] = useState('');
  const [visitPhone, setVisitPhone] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [whatsappOptIn, setWhatsappOptIn] = useState(false);
  const [visitLoading, setVisitLoading] = useState(false);

	useEffect(() => {
		const load = async () => {
			const res = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/api/properties/${id}`,
			);
			const data = await res.json();
			setProperty(data);

			const listRes = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/api/properties`,
			);
			const list = await listRes.json();
			setRelated(list.filter((p) => p.id !== data.id).slice(0, 2));
		};
		load();
	}, [id]);
    
	const submitInquiry = async () => {
    if (!visitName || !visitPhone || !visitDate) {
      alert('Please fill all fields');
      return;
    }

    setVisitLoading(true);
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: visitName,
          phone: visitPhone,
          listing_id: property.id,
          whatsapp_opt_in: whatsappOptIn,
          inquiry_type: 'TENANT',
          source_page: window.location.pathname,
        }),
      });

      alert('Visit scheduled successfully');
      setVisitName('');
      setVisitPhone('');
      setVisitDate('');
      setWhatsappOptIn(false);
    } catch {
      alert('Failed to submit inquiry');
    } finally {
      setVisitLoading(false);
    }
  };
  
	if (!property) {
		return (
			<Layout>
				<div className="min-h-[60vh] flex items-center justify-center">
					Loading...
				</div>
			</Layout>
		);
	}
	// ---------- RENT CALCULATION (FIXED LOGIC) ----------
	const monthlyRent = toNumber(property.price);

	// 2 months deposit
	const securityDeposit = monthlyRent * 2;

	// 15 days = half month
	const oneTimeFees = monthlyRent / 2;

	// total payable
	const totalPayable = monthlyRent + securityDeposit + oneTimeFees;

	const images =
		Array.isArray(property.images) && property.images.length > 0
			? property.images
			: ['https://via.placeholder.com/1200x600'];

	const amenities = parseAmenities(property.amenities);

	return (
		<Layout>
			<div className="container-custom py-10 grid lg:grid-cols-3 gap-10">
				{/* LEFT */}
				<div className="lg:col-span-2 space-y-10">
					{/* TITLE */}
					<div>
						<h1 className="text-3xl font-bold">{property.title}</h1>
						<p className="flex items-center mt-1 text-gray-500 dark:text-gray-400">
							<MapPin className="w-4 h-4 mr-1 text-teal-600" />
							{property.location}
						</p>
					</div>

					{/* GALLERY */}
					{/* ADVANCED GALLERY */}
					<div className="space-y-4">
						{/* MAIN IMAGE */}
						<div className="relative h-[420px] rounded-2xl overflow-hidden shadow group">
							<img
								src={images[index]}
								className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
								alt="Property"
							/>

							{/* LEFT ARROW */}
							<button
								onClick={() =>
									setIndex(index === 0 ? images.length - 1 : index - 1)
								}
								className="absolute left-4 top-1/2 -translate-y-1/2 
			bg-white/80 backdrop-blur p-2 rounded-full shadow 
			hover:scale-110 transition"
							>
								<ChevronLeft />
							</button>

							{/* RIGHT ARROW */}
							<button
								onClick={() => setIndex((index + 1) % images.length)}
								className="absolute right-4 top-1/2 -translate-y-1/2 
			bg-white/80 backdrop-blur p-2 rounded-full shadow 
			hover:scale-110 transition"
							>
								<ChevronRight />
							</button>
						</div>

						{/* THUMBNAILS (MAX 3, SAFE) */}
						<div className="grid grid-cols-3 gap-4">
							{images.slice(0, 3).map((img, i) => (
								<button
									key={i}
									onClick={() => setIndex(i)}
									className={`relative h-40 rounded-xl overflow-hidden border-2 
				${index === i ? 'border-amber-500' : 'border-transparent'}
				hover:scale-[1.03] transition`}
								>
									<img
										src={img}
										className="w-full h-full object-cover"
										alt="Thumbnail"
									/>

									{/* OVERLAY FOR EXTRA IMAGES */}
									{i === 2 && images.length > 3 && (
										<div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-semibold">
											+{images.length - 3}
										</div>
									)}
								</button>
							))}
						</div>
					</div>

					{/* PROPERTY DESCRIPTION */}
					<h2 className="text-2xl font-bold">Description</h2>

					<div className="bg-white dark:bg-neutral-900 rounded-2xl shadow p-6">
						<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
							{property.description || 'No description available.'}
						</p>
					</div>
					{/* AMENITIES */}
					<h2 className="text-2xl font-bold">Amenities</h2>

					<div className="grid md:grid-cols-2 gap-6">
						{Object.entries(amenities).map(([section, items]) => (
							<div
								key={section}
								className={`rounded-xl p-5 border ${amenityBgMap[section]}`}
							>
								<h3 className="font-semibold mb-4">{section}</h3>

								{items.length === 0 ? (
									<p className="text-sm text-gray-400">No amenities added</p>
								) : (
									<div className="grid grid-cols-2 gap-3 text-sm">
										{items.map((item, i) => (
											<div key={i} className="flex items-center gap-2">
												{iconMap[item] || <CheckCircle size={14} />}
												{item}
											</div>
										))}
									</div>
								)}
							</div>
						))}
					</div>

					{/* RENT DETAILS / PRICE BREAKUP */}
					<h2 className="text-2xl font-bold mt-12">Rent Details</h2>

					<div className="bg-white dark:bg-neutral-900 rounded-2xl shadow p-6 space-y-6">
						<div className="flex justify-between">
							<p className="font-medium">Monthly rent</p>
							<p className="font-semibold">₹ {property.price}</p>
						</div>

						<div className="flex justify-between">
							<p className="font-medium">Security deposit</p>
							<p className="font-semibold">₹ {property.deposit || 0}</p>
						</div>

						<div className="flex justify-between">
							<p className="font-medium">One-time fees</p>
							<p className="font-semibold">₹ {property.brokerage || 0}</p>
						</div>

						<hr className="border-gray-200 dark:border-neutral-700" />

						<div className="flex justify-between text-teal-600 dark:text-teal-400">
							<p className="font-semibold text-lg">Total payable amount</p>
							<p className="font-bold text-xl">
								₹{' '}
								{toNumber(property.price) +
									toNumber(property.deposit) +
									toNumber(property.brokerage)}
							</p>
						</div>
					</div>
				</div>
				{/* RIGHT SIDEBAR */}
				<div className="sticky top-24 self-start">
					<div className="space-y-8">
						{/* SCHEDULE VISIT CARD */}
						<div
							className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-3xl 
			shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden border border-gray-100 dark:border-neutral-800"
						>
							<div className="p-6 border-b dark:border-neutral-800">
								<h3 className="font-semibold text-lg mb-5 flex items-center gap-2">
									<CalendarDays className="text-amber-500" />
									Schedule Your Visit
								</h3>

								{/* NAME */}
								<div className="relative mb-4">
									<input
										className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 
						dark:border-neutral-700 dark:bg-neutral-800 
						focus:ring-2 focus:ring-amber-400 outline-none transition"
										placeholder="Your Name"
										value={visitName}
                                        onChange={(e) => setVisitName(e.target.value)}
									/>
									<User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
								</div>

								{/* PHONE */}
								<div className="relative mb-4">
									<input
										className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 
						dark:border-neutral-700 dark:bg-neutral-800 
						focus:ring-2 focus:ring-amber-400 outline-none transition"
										placeholder="Phone Number"
										value={visitPhone}
                                        onChange={(e) => setVisitPhone(e.target.value)}
									/>
									<Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
								</div>

								{/* DATE */}
								<div className="relative mb-4">
									<input
										type="date"
										className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 
						dark:border-neutral-700 dark:bg-neutral-800 
						focus:ring-2 focus:ring-amber-400 outline-none transition"
						                value={visitDate}
                                        onChange={(e) => setVisitDate(e.target.value)}
									/>
									<CalendarDays className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
								</div>

								{/* WHATSAPP */}
								<label className="flex items-center justify-between text-sm mb-6">
									<span className="text-gray-600 dark:text-gray-400">
										Get updates over WhatsApp
									</span>
									<input
  type="checkbox"
  className="accent-green-500 scale-125"
  checked={whatsappOptIn}
  onChange={(e) => setWhatsappOptIn(e.target.checked)}
/>
								</label>

								<button
  onClick={submitInquiry}
  disabled={visitLoading}
  className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 
    text-black py-3 rounded-xl font-semibold shadow-md 
    hover:scale-[1.03] transition disabled:opacity-60"
>
  {visitLoading ? 'Submitting...' : 'Schedule a Visit'}
</button>

							</div>
						</div>

						{/* PEOPLE ALSO SEARCHED */}
						<div
							className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-3xl 
			shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] border border-gray-100 dark:border-neutral-800"
						>
							<div className="p-6">
								<h4 className="font-semibold mb-5">People also searched</h4>

								<div className="space-y-4">
									{related.map((p) => (
										<Link
											key={p.id}
											to={`/property/${p.id}`}
											className="block p-4 rounded-2xl bg-gray-50 
							dark:bg-neutral-800 hover:shadow-md 
							hover:-translate-y-1 transition"
										>
											<p className="font-medium">{p.title}</p>
											<p className="text-sm text-gray-500">{p.location}</p>
											<p className="text-amber-500 font-semibold mt-1">
												₹ {p.price}
											</p>
										</Link>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default PropertyDetailPage;
