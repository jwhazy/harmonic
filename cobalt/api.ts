import type { CobaltRequest, CobaltResponse, CobaltServerInfo } from "./types";

/**
 * Client for interacting with a Cobalt API instance.
 *
 * IMPORTANT: Public instances (e.g. api.cobalt.tools) enforce bot protection.
 * Host your own or request access before using in production.
 */
export class Cobalt {
	private baseUrl: string;
	private apiKey?: string;
	private bearerToken?: string;

	/**
	 * Create a new Cobalt API client.
	 *
	 * @param baseUrl - The base URL of your Cobalt instance (no trailing slash).
	 * @param apiKey - Optional API key for `Api-Key` authentication.
	 *
	 * @example
	 * ```ts
	 * const client = new Cobalt("https://my.cobalt.instance", "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee");
	 * ```
	 */
	constructor(baseUrl: string, apiKey?: string) {
		this.baseUrl = baseUrl.replace(/\/$/, "");
		this.apiKey = apiKey;
	}

	/**
	 * Build the HTTP headers for each request.
	 *
	 * Always includes:
	 * - `Accept: application/json`
	 * - `Content-Type: application/json`
	 *
	 * If an API key was provided at construction, uses:
	 * `Authorization: Api-Key <apiKey>`
	 *
	 * Otherwise, if a bearer token has been set, uses:
	 * `Authorization: Bearer <token>`
	 *
	 * @internal
	 */
	private getHeaders(): HeadersInit {
		const headers: HeadersInit = {
			Accept: "application/json",
			"Content-Type": "application/json",
		};

		if (this.apiKey) {
			headers.Authorization = `Api-Key ${this.apiKey}`;
		} else if (this.bearerToken) {
			headers.Authorization = `Bearer ${this.bearerToken}`;
		}

		return headers;
	}

	/**
	 * Set a Bearer token for subsequent requests.
	 *
	 * Use this after obtaining a JWT from `generateToken()`, if your instance
	 * requires Turnstile-based Bearer authentication:
	 * `Authorization: Bearer <token>`
	 *
	 * @param token - JWT token string
	 */
	setBearerToken(token: string) {
		this.bearerToken = token;
	}

	/**
	 * Submit a media download request to the Cobalt processing endpoint.
	 *
	 * POST `/`
	 * Required headers:
	 *   - `Accept: application/json`
	 *   - `Content-Type: application/json`
	 *
	 * @param request - {@link CobaltRequest} specifying URL, quality, format, etc.
	 * @returns A {@link CobaltResponse} object.
	 *   - `status`: one of `tunnel`, `redirect`, `picker`, `local-processing`, `error`
	 *   - On `tunnel`/`redirect`: contains `url` and `filename`
	 *   - On `local-processing`: see audio/output objects
	 *   - On `picker`: array of media items
	 *   - On `error`: `{ code: string, context?: object }`
	 *
	 * @throws If the network request itself fails.
	 *
	 * @example
	 * ```ts
	 * const resp = await client.processUrl({ url: "https://youtube.com/..." });
	 * if (resp.status === "redirect") {
	 *   window.location.href = resp.url;
	 * }
	 * ```
	 */
	async processUrl(request: CobaltRequest): Promise<CobaltResponse> {
		const response = await fetch(`${this.baseUrl}/`, {
			method: "POST",
			headers: this.getHeaders(),
			body: JSON.stringify(request),
		});
		return response.json();
	}

	/**
	 * Retrieve basic information about the Cobalt instance.
	 *
	 * GET `/`
	 * Returns JSON with:
	 * - `cobalt`: `{ version, url, startTime, turnstileSitekey?, services[] }`
	 * - `git`: `{ commit, branch, remote }`
	 *
	 * @returns A {@link CobaltServerInfo} object
	 * @throws If the HTTP status is not OK (e.g. 404, 500).
	 *
	 * @example
	 * ```ts
	 * const info = await client.getServerInfo();
	 * console.log(info.cobalt.version, info.git.commit);
	 * ```
	 */
	async getServerInfo(): Promise<CobaltServerInfo> {
		const response = await fetch(`${this.baseUrl}/`, {
			method: "GET",
			headers: this.getHeaders(),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return response.json();
	}

	/**
	 * Generate a short-lived JWT Bearer token by solving a Turnstile challenge.
	 *
	 * POST `/session`
	 * Header: `cf-turnstile-response: <turnstileResponse>`
	 *
	 * @param turnstileResponse - The client-side Turnstile challenge token.
	 * @returns An object `{ token: string; exp: number }`, where `exp` is
	 *   the lifetime in seconds since epoch.
	 *
	 * @throws If authentication fails or the instance returns an error status.
	 *
	 * @example
	 * ```ts
	 * const { token, exp } = await client.generateToken(turnstileToken);
	 * client.setBearerToken(token);
	 * ```
	 */
	async generateToken(
		turnstileResponse: string,
	): Promise<{ token: string; exp: number }> {
		const response = await fetch(`${this.baseUrl}/session`, {
			method: "POST",
			headers: {
				...this.getHeaders(),
				"cf-turnstile-response": turnstileResponse,
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return response.json();
	}
}
