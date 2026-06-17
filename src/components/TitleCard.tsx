import React from 'react';
import {
	AbsoluteFill,
	spring,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
} from 'remotion';
import { fontFamilies } from '../Root';

interface TitleCardProps {
	title?: string;
	subtitle?: string;
}

export const TitleCard: React.FC<TitleCardProps> = ({
	title = 'Bộ nhớ đệm CPU',
	subtitle = 'Tại sao phân cấp bộ nhớ quan trọng',
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const titleSpring = spring({
		frame,
		fps,
		config: {
			damping: 12,
		},
	});

	const subtitleOpacity = interpolate(frame, [fps * 0.5, fps * 1.5], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill className="bg-zinc-950 flex items-center justify-center text-white">
			<div className="flex flex-col items-center">
				<h1
					className="text-9xl font-extrabold tracking-tighter"
					style={{
						transform: `scale(${titleSpring})`,
						fontFamily: fontFamilies.fraunces,
					}}
				>
					{title}
				</h1>
				<div
					className="h-1 bg-blue-500 mt-4 mb-6"
					style={{
						width: interpolate(titleSpring, [0, 1], [0, 200]),
					}}
				/>
				<p
					className="text-4xl text-zinc-400 font-light tracking-wide"
					style={{
						opacity: subtitleOpacity,
						transform: `translateY(${interpolate(
							subtitleOpacity,
							[0, 1],
							[20, 0]
						)}px)`,
						fontFamily: fontFamilies.spaceGrotesk,
					}}
				>
					{subtitle}
				</p>
			</div>
		</AbsoluteFill>
	);
};
