import type { CobaltRequest, CobaltResponse, CobaltServerInfo } from "./types";

export class Cobalt {
	private baseUrl: string;
	private apiKey?: string;
	private bearerToken?: string;

	constructor(baseUrl: string, apiKey?: string) {
		this.baseUrl = baseUrl.replace(/\/$/, "");
		this.apiKey = apiKey;
	}

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
	 * Set a bearer token for authentication
	 */
	setBearerToken(token: string) {
		this.bearerToken = token;
	}

	/**
	 * Process a URL for downloading media
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
	 * Get server information
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
	 * Generate a JWT token using Turnstile challenge
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
