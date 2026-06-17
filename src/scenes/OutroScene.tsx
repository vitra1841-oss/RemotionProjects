import {AbsoluteFill} from "remotion";

export const OutroScene = () => {
	return (
		<AbsoluteFill className="bg-zinc-950 flex items-center justify-center">
			<div className="text-center">
				<h1 className="text-8xl text-white font-bold">
					CPU Cache
				</h1>

				<p className="text-3xl text-zinc-400 mt-6">
					A small memory that saves time
				</p>
			</div>
		</AbsoluteFill>
	);
};