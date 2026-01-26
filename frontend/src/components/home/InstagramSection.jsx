import React from 'react';
import { Button } from '@/components/ui/button';
import { Instagram, Play } from 'lucide-react';

const instagramPosts = [
	{
		id: 1,
		postUrl:
			'https://www.instagram.com/reel/DTf0gCZAWLu/?igsh=bGFpbzJnaWR3MGc2',
		thumbnail:
			'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=600&fit=crop',
		hasVideo: true,
	},
	{
		id: 2,
		postUrl:
			'https://www.instagram.com/reel/DTdIxC4AYyj/?igsh=NjMzdHdoNTNkdWxp',
		thumbnail:
			'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=600&fit=crop',
		hasVideo: false,
	},
	{
		id: 3,
		postUrl:
			'https://www.instagram.com/reel/DTVINEyASeL/?igsh=MTZiM3o3bjVsNTY2cA==',
		thumbnail:
			'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&h=600&fit=crop',
		hasVideo: true,
	},
	{
		id: 4,
		postUrl: 'https://www.instagram.com/p/DTRiimeE_i-/?igsh=dW52aXFsdm05dWdi',
		thumbnail:
			'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=600&fit=crop',
		hasVideo: false,
	},
];

export const InstagramSection = () => {
	return (
		<section
			className="
        pt-16 pb-6
        md:pt-20 md:pb-8
        bg-white dark:bg-neutral-950
      "
		>
			<div className="container-custom">
				{/* HEADER */}
				<div className="text-center mb-10 md:mb-12">
					<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
						VISIT OUR INSTAGRAM
					</h2>
					<p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
						Follow our journey, see behind-the-scenes content, and explore our
						latest properties.
					</p>
				</div>

				{/* GRID */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
					{instagramPosts.map((post, i) => (
						<a
							key={post.id}
							href={post.postUrl}
							target="_blank"
							rel="noopener noreferrer"
							style={{ animationDelay: `${i * 120}ms` }}
							className="
                group relative aspect-square rounded-xl overflow-hidden
                bg-gray-100 dark:bg-neutral-900
                shadow-md
                transition-all duration-500
                hover:scale-[1.04]
                hover:shadow-xl
              "
						>
							<img
								src={post.thumbnail}
								alt="Instagram post"
								className="
                  w-full h-full object-cover
                  transition-transform duration-500
                  group-hover:scale-110
                "
							/>

							{/* Overlay */}
							<div
								className="
                  absolute inset-0
                  bg-black/0 group-hover:bg-black/40
                  transition-colors duration-300
                  flex items-center justify-center
                "
							>
								{/* Video Badge */}
								{post.hasVideo && (
									<div className="absolute top-2 right-2 w-7 h-7 rounded-md bg-black/70 flex items-center justify-center">
										<Play
											className="w-3.5 h-3.5 text-white"
											fill="currentColor"
										/>
									</div>
								)}

								{/* Instagram Icon */}
								<Instagram
									className="
                    w-8 h-8 text-white
                    opacity-0 group-hover:opacity-100
                    scale-75 group-hover:scale-100
                    transition-all duration-300
                  "
								/>
							</div>
						</a>
					))}
				</div>

				{/* CTA */}
				<div className="text-center mt-8">
					<Button variant="yellow" size="lg" asChild>
						<a
							href="https://instagram.com/instamakaan"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center"
						>
							<Instagram className="w-5 h-5 mr-2" />
							Follow us on Instagram @InstaMakaan
						</a>
					</Button>
				</div>
			</div>
		</section>
	);
};
