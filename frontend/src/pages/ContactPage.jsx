import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Phone,
	Mail,
	MapPin,
	Clock,
	Send,
	CheckCircle2,
	Loader2,
	ShieldCheck,
	Zap,
	Headphones,
	ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const contactInfo = [
	{
		icon: Phone,
		title: 'Phone',
		value: '+91 9771034916',
		link: 'tel:+919771034916',
	},
	{
		icon: Mail,
		title: 'Email',
		value: 'info@instamakaan.com',
		link: 'mailto:info@instamakaan.com',
	},
	{
		icon: MapPin,
		title: 'Office',
		value:
			'Tower T2, Flat B809, Tech Zone 4, Plot 17, Amrapali Dream Valley Greater Noida, Uttar Pradesh 201310',
		link: null,
	},
	{
		icon: Clock,
		title: 'Hours',
		value: 'Mon-Sat: 9AM - 7PM',
		link: null,
	},
];

const trustBadges = [
	{
		icon: ShieldCheck,
		title: '100% Verified Help',
		desc: 'Trusted support team',
	},
	{
		icon: Headphones,
		title: '24/7 Support',
		desc: 'We’re here anytime',
	},
	{
		icon: Zap,
		title: 'Fast Response',
		desc: 'Quick resolution',
	},
];

const faqs = [
	{
		q: 'How soon will I get a response?',
		a: 'Our team typically responds within a few hours during working hours. For urgent requests, we prioritize faster replies.',
	},
	{
		q: 'Can I visit your office directly?',
		a: 'Yes, you can visit our office during working hours. We recommend booking a quick call before visiting.',
	},
	{
		q: 'Do you help property owners and tenants both?',
		a: 'Yes! We work with both owners and tenants for renting, pre-occupied, and buying support.',
	},
];

const ContactPage = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		subject: '',
		message: '',
	});
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [openFaq, setOpenFaq] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);

		try {
			const response = await fetch(`${BACKEND_URL}/api/inquiries`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: formData.name,
					email: formData.email,
					phone: formData.phone,
					subject: formData.subject,
					message: formData.message,
					inquiry_type: 'general',
				}),
			});

			if (response.ok) {
				setIsSubmitted(true);
				toast.success(
					'Message sent successfully! We will get back to you soon.',
				);
			} else {
				throw new Error('Failed to submit');
			}
		} catch (error) {
			console.error('Error submitting form:', error);
			toast.error('Failed to send message. Please try again.');
		} finally {
			setSubmitting(false);
		}
	};

	const handleChange = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<Layout>
			{/* ✅ PREMIUM HERO HEADER */}
			<section className="relative overflow-hidden py-12 md:py-16 -mt-8">
				<div className="absolute inset-0 -z-10 bg-gradient-to-br from-teal-50 via-white to-yellow-50 dark:from-[#0b1220] dark:via-[#0b1220] dark:to-[#102536]" />
				<div className="absolute -top-24 -left-24 w-80 h-80 bg-teal-400/20 blur-3xl rounded-full -z-10" />
				<div className="absolute -bottom-24 -right-24 w-80 h-80 bg-yellow-400/20 blur-3xl rounded-full -z-10" />

				<div className="container-custom text-center">
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-3">
						Get in Touch
					</h1>
					<p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
						Have questions? We&apos;re here to help. Reach out to our team for
						any inquiries.
					</p>

					{/* ✅ TRUST BADGES */}
					<div className="mt-7 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
						{trustBadges.map((b) => (
							<div
								key={b.title}
								className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 shadow-sm backdrop-blur"
							>
								<div className="w-10 h-10 rounded-xl bg-teal-600/10 flex items-center justify-center">
									<b.icon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
								</div>
								<div className="text-left leading-tight">
									<p className="text-sm font-semibold text-foreground">
										{b.title}
									</p>
									<p className="text-xs text-muted-foreground">{b.desc}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ✅ CONTACT SECTION */}
			<section className="py-10 md:py-16">
				<div className="container-custom overflow-visible">
					<div className="grid lg:grid-cols-3 gap-8 items-start">
						{/* ✅ LEFT: Sticky Contact Info + Map */}
						<div className="lg:col-span-1">
							<div className="space-y-6">
								<div>
									<h2 className="text-xl font-semibold text-foreground mb-4">
										Contact Information
									</h2>

									<div className="space-y-4">
										{contactInfo.map((info) => (
											<Card
												key={info.title}
												className="bg-card border-0 shadow-card overflow-hidden rounded-3xl"
											>
												<CardContent className="p-4">
													{info.link ? (
														<a
															href={info.link}
															className="flex items-start gap-4 group"
														>
															<div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors shrink-0">
																<info.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
															</div>

															<div className="min-w-0">
																<p className="text-sm text-muted-foreground">
																	{info.title}
																</p>
																<p className="font-medium text-foreground group-hover:text-primary transition-colors break-words">
																	{info.value}
																</p>
															</div>
														</a>
													) : (
														<div className="flex items-start gap-4">
															<div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
																<info.icon className="w-5 h-5 text-primary" />
															</div>

															<div className="min-w-0">
																<p className="text-sm text-muted-foreground">
																	{info.title}
																</p>
																<p className="font-medium text-foreground break-words">
																	{info.value}
																</p>
															</div>
														</div>
													)}
												</CardContent>
											</Card>
										))}
									</div>
								</div>

								{/* ✅ MAP */}
								<Card className="bg-card border-0 shadow-card overflow-hidden rounded-3xl">
									<div className="relative aspect-[4/3]">
										<iframe
											title="InstaMakaan Office Location"
											src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.965149459954!2d77.4344158!3d28.600822299999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cef29ba0e1a4f%3A0x63538614dd1688af!2sNX%20One%20Avenue.!5e0!3m2!1sen!2sin!4v1769437555186!5m2!1sen!2sin"
											className="absolute inset-0 w-full h-full border-0"
											allowFullScreen=""
											loading="lazy"
											referrerPolicy="no-referrer-when-downgrade"
										/>
									</div>
								</Card>
							</div>
						</div>

						{/* ✅ RIGHT: Sticky on Desktop */}
						<div className="lg:col-span-2 lg:sticky lg:top-24 h-fit">
							<Card className="bg-card border-0 shadow-elevated overflow-hidden rounded-3xl">
								<CardContent className="p-6 md:p-10 relative">
									<div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-teal-50/40 to-yellow-50/30 dark:from-[#0b1220] dark:via-[#0f1f2e] dark:to-[#0b1220]" />

									{isSubmitted ? (
										<div className="text-center py-12">
											<div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
												<CheckCircle2 className="w-8 h-8 text-success" />
											</div>
											<h3 className="text-xl font-semibold text-foreground mb-2">
												Message Sent Successfully!
											</h3>
											<p className="text-muted-foreground mb-6">
												Thank you for reaching out. We&apos;ll get back to you
												within 24 hours.
											</p>
											<Button
												variant="outline"
												onClick={() => {
													setIsSubmitted(false);
													setFormData({
														name: '',
														email: '',
														phone: '',
														subject: '',
														message: '',
													});
												}}
											>
												Send Another Message
											</Button>
										</div>
									) : (
										<>
											<h2 className="text-2xl font-bold text-foreground mb-2">
												Send us a Message
											</h2>
											<p className="text-muted-foreground mb-8">
												Fill the form and our team will contact you shortly.
											</p>

											<form onSubmit={handleSubmit} className="space-y-6">
												<div className="grid sm:grid-cols-2 gap-4">
													<div>
														<label className="text-sm font-medium text-foreground mb-2 block">
															Name *
														</label>
														<Input
															placeholder="Your name"
															value={formData.name}
															onChange={(e) =>
																handleChange('name', e.target.value)
															}
															required
														/>
													</div>
													<div>
														<label className="text-sm font-medium text-foreground mb-2 block">
															Email *
														</label>
														<Input
															type="email"
															placeholder="your@email.com"
															value={formData.email}
															onChange={(e) =>
																handleChange('email', e.target.value)
															}
															required
														/>
													</div>
												</div>

												<div className="grid sm:grid-cols-2 gap-4">
													<div>
														<label className="text-sm font-medium text-foreground mb-2 block">
															Phone
														</label>
														<Input
															type="tel"
															placeholder="+91 XXXXX XXXXX"
															value={formData.phone}
															onChange={(e) =>
																handleChange('phone', e.target.value)
															}
														/>
													</div>
													<div>
														<label className="text-sm font-medium text-foreground mb-2 block">
															Subject *
														</label>
														<Select
															value={formData.subject}
															onValueChange={(value) =>
																handleChange('subject', value)
															}
														>
															<SelectTrigger>
																<SelectValue placeholder="Select a subject" />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="general">
																	General Inquiry
																</SelectItem>
																<SelectItem value="property">
																	Property Inquiry
																</SelectItem>
																<SelectItem value="owner">
																	For Property Owners
																</SelectItem>
																<SelectItem value="tenant">
																	For Tenants
																</SelectItem>
																<SelectItem value="partnership">
																	Partnership
																</SelectItem>
																<SelectItem value="support">Support</SelectItem>
															</SelectContent>
														</Select>
													</div>
												</div>

												<div>
													<label className="text-sm font-medium text-foreground mb-2 block">
														Message *
													</label>
													<Textarea
														placeholder="Tell us how we can help you..."
														rows={6}
														value={formData.message}
														onChange={(e) =>
															handleChange('message', e.target.value)
														}
														required
													/>
												</div>

												<Button
													type="submit"
													variant="teal"
													size="lg"
													className="w-full sm:w-auto"
													disabled={submitting}
												>
													{submitting ? (
														<Loader2 className="w-4 h-4 mr-2 animate-spin" />
													) : (
														<Send className="w-4 h-4 mr-2" />
													)}
													Send Message
												</Button>
											</form>
										</>
									)}
								</CardContent>
							</Card>

							{/* ✅ MINI FAQ SECTION */}
							<div className="mt-10">
								<h2 className="text-2xl font-bold text-foreground mb-4">
									Quick FAQs
								</h2>
								<p className="text-muted-foreground mb-6 max-w-2xl">
									Some common questions our users ask before reaching out.
								</p>

								<div className="space-y-3">
									{faqs.map((item, i) => {
										const isOpen = openFaq === i;
										return (
											<Card
												key={item.q}
												className="bg-card border-0 shadow-card rounded-3xl overflow-hidden"
											>
												<button
													type="button"
													onClick={() => setOpenFaq(isOpen ? null : i)}
													className="w-full text-left"
												>
													<CardContent className="p-5 flex items-center justify-between gap-4">
														<p className="font-semibold text-foreground">
															{item.q}
														</p>
														<ChevronDown
															className={`w-5 h-5 transition-transform ${
																isOpen ? 'rotate-180' : ''
															}`}
														/>
													</CardContent>
												</button>

												{isOpen && (
													<div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
														{item.a}
													</div>
												)}
											</Card>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</Layout>
	);
};

export default ContactPage;
