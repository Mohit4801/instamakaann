import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import FloatingContactButton from '@/components/FloatingContactButton';

export const Layout = ({ children }) => {
	return (
		<div className="min-h-screen flex flex-col overflow-x-hidden">
			<Header />
			<main className="flex-1 pt-16 md:pt-20">{children}</main>
			<FloatingContactButton />
			<Footer />
		</div>
	);
};
