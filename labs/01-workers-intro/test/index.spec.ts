import { SELF } from "cloudflare:test";
import { describe, it, expect } from "vitest";

describe("GET /", () => {
	it("returns text", async () => {
		const response = await SELF.fetch("https://example.com/");
		expect(response.status).toBe(200);
		expect(await response.text()).toBe("Hello from 01-workers-intro\n");
	});
});

describe("GET /whoami", () => {
	it("returns cf properties and selected headers as JSON", async () => {
		const response = await SELF.fetch("https://example.com/whoami", {
			headers: { "User-Agent": "vitest", Cookie: "secret=1" },
		});
		expect(response.status).toBe(200);
		expect(response.headers.get("Content-Type")).toContain("application/json");

		const body = await response.json<{ cf: object; headers: Record<string, string> }>();
		expect(Object.keys(body.cf)).toEqual(
			expect.arrayContaining(["colo", "country", "asn"]),
		);
		expect(body.cf).not.toHaveProperty("tlsExportedAuthenticator");
		expect(body.headers["user-agent"]).toBe("vitest");
		expect(body.headers).not.toHaveProperty("cookie");
	});
});

describe("POST /echo", () => {
	it("returns the JSON body as is", async () => {
		const payload = { message: "hello", items: [1, 2, 3] };
		const response = await SELF.fetch("https://example.com/echo", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual(payload);
	});

	it("returns 400 when the body is not JSON", async () => {
		const response = await SELF.fetch("https://example.com/echo", {
			method: "POST",
			body: "not json",
		});
		expect(response.status).toBe(400);
	});
});

describe("other requests", () => {
	it("returns 404 for an unknown path", async () => {
		const response = await SELF.fetch("https://example.com/unknown");
		expect(response.status).toBe(404);
	});

	it("returns 405 with Allow for a known path and a wrong method", async () => {
		const response = await SELF.fetch("https://example.com/echo");
		expect(response.status).toBe(405);
		expect(response.headers.get("Allow")).toBe("POST");
	});
});
