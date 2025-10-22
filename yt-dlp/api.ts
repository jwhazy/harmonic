import { $ } from "bun";
import path from "node:path";
import { createReadStream } from "node:fs";
import { Readable } from "node:stream";

export type VideoInfo = {
	title: string;
	author: string;
	filePath: string;
};

export async function downloadAudio(
	url: string,
	outputDir: string,
): Promise<VideoInfo> {
	const outputTemplate = path.join(outputDir, "%(id)s.%(ext)s");

	await $`yt-dlp -x --extractor-args "youtube:player_js_version=actual" --audio-format mp3 -o ${outputTemplate} ${url}`;

	const infoJson = await $`yt-dlp --dump-json --no-download ${url}`.json();

	const title = infoJson.title || "Unknown";
	const author = infoJson.uploader || infoJson.channel || "Unknown";
	const videoId = infoJson.id;

	const filePath = path.join(outputDir, `${videoId}.mp3`);

	return { title, author, filePath };
}

export function createStreamFromFile(filePath: string): Readable {
	return createReadStream(filePath);
}
