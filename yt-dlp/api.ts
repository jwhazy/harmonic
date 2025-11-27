import { existsSync } from "node:fs";
import path from "node:path";
import { $ } from "bun";

export type SongInfo = {
	title: string;
	author: string;
	videoId: string;
	filePath?: string;
};

export async function getSongInfo(url: string): Promise<SongInfo> {
	// TO-DO: type this
	const json = await $`yt-dlp --dump-json --no-download ${url}`.json();

	const title = json.title || "Unknown";
	const author = json.uploader || json.channel || "Unknown";
	const videoId = json.id;

	const filePath = path.join(process.cwd(), "audios", `${videoId}.mp3`);

	return {
		title,
		author,
		videoId,
		filePath: existsSync(filePath) ? filePath : undefined,
	};
}

export async function downloadAudio(
	videoId: string,
	url: string,
	outputDir: string,
): Promise<string> {
	const outputTemplate = path.join(outputDir, "%(id)s.%(ext)s");
	await $`yt-dlp -x --extractor-args "youtube:player_js_version=actual" --audio-format mp3 -o ${outputTemplate} ${url}`;

	return path.join(outputDir, `${videoId}.mp3`);
}
