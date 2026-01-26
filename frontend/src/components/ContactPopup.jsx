import React, { useState } from 'react';
import { X } from 'lucide-react';

const ContactPopup = ({ open, onClose }) => {
	const [propertyType, setPropertyType] = useState('rent');
	if (!open) return null;

	return (
		<div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
			<div className="relative w-[94%] max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
				{/* CLOSE */}
				<button
					onClick={onClose}
					className="absolute top-4 right-4 z-10 text-gray-400 hover:text-black"
				>
					<X size={22} />
				</button>

				{/* LEFT — VIDEO / VISUAL */}
				<div className="hidden md:flex relative">
					<video
						src="/videos/home-search.mp4" // optional (image bhi rakh sakta hai)
						autoPlay
						loop
						muted
						playsInline
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-black/40 flex items-end p-6">
						<h3 className="text-white text-lg font-semibold">
							Find homes that match your lifestyle
						</h3>
					</div>
				</div>

				{/* RIGHT — FORM */}
				<div className="p-8">
					<h2 className="text-2xl font-semibold mb-2">
						Struggling to find your perfect home?
					</h2>

					<p className="text-sm text-gray-500 mb-6">
						Share your details & our team will contact you
					</p>

					{/* PROPERTY TYPE */}
					<div className="flex gap-3 mb-6">
						{['rent', 'buy', 'pre-occupied'].map((type) => (
							<button
								key={type}
								onClick={() => setPropertyType(type)}
								className={`px-4 py-2 rounded-full text-sm border transition
									${
										propertyType === type
											? 'bg-[#2f7f7b] text-white border-[#2f7f7b]'
											: 'bg-white text-gray-600'
									}`}
							>
								{type === 'rent'
									? 'Rent'
									: type === 'buy'
										? 'Buy'
										: 'Pre-Occupied'}
							</button>
						))}
					</div>

					{/* INPUTS */}
					<div className="space-y-4">
						<input
							type="text"
							placeholder="Full Name"
							className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2f7f7b]"
						/>

						<input
							type="tel"
							placeholder="Contact Number"
							className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2f7f7b]"
						/>

						<input
							type="email"
							placeholder="Email (Optional)"
							className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2f7f7b]"
						/>

						<select className="w-full border rounded-xl px-4 py-3 text-gray-600">
							<option>Budget</option>
							<option>Under ₹15,000</option>
							<option>₹15,000 – ₹30,000</option>
							<option>₹30,000 – ₹50,000</option>
							<option>₹50,000+</option>
						</select>
					</div>

					<button
						className="
							mt-6 w-full
							bg-gradient-to-r from-[#2f7f7b] to-[#3fa39d]
							hover:opacity-90
							text-white py-3 rounded-full
							font-medium transition
						"
					>
						Continue
					</button>
				</div>
			</div>
		</div>
	);
};

export default ContactPopup;
