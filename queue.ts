import type { AudioResource } from "@discordjs/voice";
import type { Client } from "discord.js";
import type { QueueItem } from "./utils/types";

export let queue: QueueItem[] = [];

export function clear() {
	queue = [];
}

export function add(
	resource: AudioResource,
	url: string,
	requestedBy: string,
	title: string,
	author: string,
) {
	queue.push({ resource, url, requestedBy, title, author });
}

export function playNext(client: Client) {
	const next = queue[0];

	if (!next) {
		return;
	}

	client.player.play(next.resource);
	return next.url;
}
