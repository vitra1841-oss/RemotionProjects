import {
	AbsoluteFill,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

export const ProblemScene = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scale = spring({
		frame,
		fps,
	});

	return (
		<AbsoluteFill className="bg-zinc-950 flex items-center justify-center">
			<div
				className="bg-zinc-900 p-10 rounded-3xl text-white"
				style={{
					transform: `scale(${scale})`,
				}}
			>
				<div className="text-5xl font-bold">
					RAM is slow
				</div>

				<div className="text-2xl text-zinc-400 mt-4">
					CPU must wait for memory
				</div>
			</div>
		</AbsoluteFill>
	);
};