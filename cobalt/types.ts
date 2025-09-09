/**
 * Represents a request body for the Cobalt API POST `/` endpoint.
 */
export interface CobaltRequest {
	/** The source URL to process. This is the only required field. */
	url: string;

	/** Desired video resolution. Defaults to `1080`. */
	videoQuality?:
		| "144"
		| "240"
		| "360"
		| "480"
		| "720"
		| "1080"
		| "1440"
		| "2160"
		| "4320"
		| "max";

	/** Desired audio format. Defaults to `mp3`. */
	audioFormat?: "best" | "mp3" | "ogg" | "wav" | "opus";

	/** Audio bitrate in kbps. Defaults to `128`. */
	audioBitrate?: "320" | "256" | "128" | "96" | "64" | "8";

	/** Naming style for the output filename. Defaults to `basic`. */
	filenameStyle?: "classic" | "pretty" | "basic" | "nerdy";

	/** Determines what content to download. Defaults to `auto`. */
	downloadMode?: "auto" | "audio" | "mute";

	/** Preferred YouTube video codec. Defaults to `h264`. */
	youtubeVideoCodec?: "h264" | "av1" | "vp9";

	/** Language code for YouTube dubs (e.g. "en", "zh-CN"). */
	youtubeDubLang?: string;

	/** If true, all files will be tunneled even if unnecessary. Defaults to `false`. */
	alwaysProxy?: boolean;

	/** If true, disables embedding metadata like title, artist, etc. Defaults to `false`. */
	disableMetadata?: boolean;

	/** If true, downloads the full original audio used in a TikTok video. Defaults to `false`. */
	tiktokFullAudio?: boolean;

	/** If true, allows downloading H.265/HEVC videos from TikTok/Xiaohongshu. Defaults to `false`. */
	tiktokH265?: boolean;

	/** If true, converts Twitter videos marked as GIFs into actual GIFs. Defaults to `true`. */
	twitterGif?: boolean;

	/** If true, uses HLS formats for YouTube. Defaults to `false`. */
	youtubeHLS?: boolean;
}

/**
 * The response returned by the Cobalt API POST `/` endpoint.
 */
export interface CobaltResponse {
	/**
	 * Processing status of the request:
	 * - `tunnel`: File is being proxied or transcoded by Cobalt.
	 * - `redirect`: Cobalt will redirect to the final URL.
	 * - `picker`: Multiple media options available, user selection required.
	 * - `error`: An error occurred.
	 */
	status: "error" | "picker" | "redirect" | "tunnel";

	/** The tunnel or redirect URL for the processed media. Present for `tunnel` and `redirect`. */
	url?: string;

	/** Suggested filename for the processed file. */
	filename?: string;

	/** Background audio URL, only present in `picker` mode when available. */
	audio?: string;

	/** Suggested filename for the background audio in `picker` mode. */
	audioFilename?: string;

	/** List of media options when status is `picker`. */
	picker?: CobaltPickerItem[];

	/** Error information when status is `error`. */
	error?: CobaltError;
}

/**
 * Represents an individual media item in a `picker` response.
 */
export interface CobaltPickerItem {
	/** Media type: photo, video, or gif. */
	type: "photo" | "video" | "gif";

	/** URL to the media file. */
	url: string;

	/** Optional thumbnail URL. */
	thumb?: string;
}

/**
 * Represents an error object from a Cobalt API response.
 */
export interface CobaltError {
	/** Machine-readable error code. */
	code: string;

	/** Optional additional context for the error. */
	context?: {
		/** The origin service that caused the error, if applicable. */
		service?: string;

		/** A limit related to the error, such as maximum video duration or rate limit window. */
		limit?: number;
	};
}

/**
 * Information about a Cobalt instance, returned from GET `/`.
 */
export interface CobaltServerInfo {
	/** General metadata about the running instance. */
	cobalt: {
		/** Running version of the Cobalt server. */
		version: string;

		/** Base URL of the instance. */
		url: string;

		/** Instance uptime start time (Unix ms). */
		startTime: string;

		/** Max allowed media duration in seconds. */
		durationLimit: number;

		/** List of services supported by this instance (e.g. `youtube`, `twitter`). */
		services: string[];
	};

	/** Git metadata about the currently running Cobalt codebase. */
	git: {
		/** Current commit hash. */
		commit: string;

		/** Git branch name. */
		branch: string;

		/** Remote URL of the repository. */
		remote: string;
	};
}
