import { $ } from "bun";
import path from "node:path";
import { createReadStream, existsSync } from "node:fs";
import type { Readable } from "node:stream";

export type SongInfo = {
	title: string;
	author: string;
	videoId: string;
	filePath?: string;
};

export async function getSongInfo(url: string): Promise<SongInfo> {
	const infoJson = await $`yt-dlp --dump-json --no-download ${url}`.json();

	const title = infoJson.title || "Unknown";
	const author = infoJson.uploader || infoJson.channel || "Unknown";
	const videoId = infoJson.id;

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

export function createStreamFromFile(filePath: string): Readable {
	return createReadStream(filePath);
}
