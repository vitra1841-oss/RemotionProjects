import {
	AbsoluteFill,
	useCurrentFrame,
} from "remotion";

export const DiagramScene = () => {
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill className="bg-zinc-950 flex items-center justify-center gap-20">

			<div
				className="w-48 h-48 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-4xl"
				style={{
					transform: `translateX(${Math.min(
						frame * 4,
						150
					)}px)`,
				}}
			>
				CPU
			</div>

			<div className="text-white text-6xl">
				→
			</div>

			<div className="w-48 h-48 bg-green-500 rounded-2xl flex items-center justify-center text-white text-4xl">
				RAM
			</div>

		</AbsoluteFill>
	);
};