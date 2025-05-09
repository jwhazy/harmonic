import type { AudioResource } from "@discordjs/voice";
import type { Client } from "discord.js";

type QueueItem = {
	resource: AudioResource;
	url: string;
};

export const queue: QueueItem[] = [];

export function add(resource: AudioResource, url: string) {
	queue.push({ resource, url });
}

export function playNext(client: Client) {
	const next = queue[0];

	if (next) {
		client.player.play(next.resource);
		return next.url;
	}

	return;
}
