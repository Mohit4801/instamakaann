import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import ContactPopup from './ContactPopup';

const FloatingContactButton = () => {
	const [open, setOpen] = useState(false);

	return (
		<>
			{/* FLOATING BUTTON */}
			<button
				onClick={() => setOpen(true)} // 👈 ONLY THIS
				className="
					fixed bottom-6 right-1/2 translate-x-1/2
					md:right-6 md:translate-x-0
					z-50
					flex items-center gap-3
					bg-[#2f7f7b] hover:bg-[#256c69]
					text-white
					px-6 py-3
					rounded-full
					shadow-xl
					transition-all
				"
			>
				{/* <Phone className="w-5 h-5" /> */}
				<img
					src="/images/support.png"
					alt="Support"
					className="w-5 h-5 object-contain"
				/>
				<span className="font-medium">Find Your Perfect Home</span>
			</button>

			{/* POPUP */}
			<ContactPopup open={open} onClose={() => setOpen(false)} />
		</>
	);
};

export default FloatingContactButton;
