const WHOAMI_HEADERS = [
	"user-agent",
	"accept",
	"accept-language",
	"cf-connecting-ip",
	"cf-ipcountry",
	"cf-ray",
	"x-forwarded-proto",
];

type Handler = (request: Request, env: Env) => Response | Promise<Response>;

const ROUTES: Record<string, Record<string, Handler>> = {
	"/": { GET: handleRoot },
	"/whoami": { GET: handleWhoami },
	"/echo": { POST: handleEcho },
	"/boom": { GET: () => { throw new Error("Boom!"); } }
};

const KV_PREFIX = "/kv/";
const KV_HANDLERS: Record<string, Handler> = { GET: handleKvGet, PUT: handleKvPut };

export default {
	async fetch(request, env): Promise<Response> {
		console.log(request.method, request.url);

		const { pathname } = new URL(request.url);
		const handlers = pathname.length > KV_PREFIX.length && pathname.startsWith(KV_PREFIX)
			? KV_HANDLERS
			: ROUTES[pathname];
		if (!handlers) {
			return Response.json({ error: "Not Found" }, { status: 404 });
		}

		// A known path with a wrong method returns 405, not 404, so the client
		// can tell "this path exists" from "this path does not exist".
		const handler = handlers[request.method];
		if (!handler) {
			return Response.json(
				{ error: "Method Not Allowed" },
				{ status: 405, headers: { Allow: Object.keys(handlers).join(", ") } },
			);
		}

		return handler(request, env);
	},
} satisfies ExportedHandler<Env>;

function handleRoot(): Response {
	return new Response("Hello from 01-workers-intro\n");
}

function handleWhoami(request: Request): Response {
	const headers = Object.fromEntries(
		WHOAMI_HEADERS.flatMap((name) => {
			const value = request.headers.get(name);
			return value === null ? [] : [[name, value]];
		}),
	);

	// Pick fields instead of returning request.cf as a whole: the whole object
	// has postal code, latitude/longitude, and TLS handshake secrets
	// (tlsExportedAuthenticator), which should not end up in PR evidence.
	// Missing fields become null so JSON keeps the key; undefined would drop it.
	const cf = request.cf;
	return Response.json({
		cf: {
			colo: cf?.colo ?? null,
			country: cf?.country ?? null,
			city: cf?.city ?? null,
			asn: cf?.asn ?? null,
			asOrganization: cf?.asOrganization ?? null,
			httpProtocol: cf?.httpProtocol ?? null,
			tlsVersion: cf?.tlsVersion ?? null,
		},
		headers,
	});
}

async function handleEcho(request: Request): Promise<Response> {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return Response.json({ error: "Body must be valid JSON" }, { status: 400 });
	}
	return Response.json(body);
}

function kvKey(request: Request): string {
	return decodeURIComponent(new URL(request.url).pathname.slice(KV_PREFIX.length));
}

async function handleKvGet(request: Request, env: Env): Promise<Response> {
	const value = await env.KV.get(kvKey(request));
	if (value === null) {
		return Response.json({ error: "Not Found" }, { status: 404 });
	}
	return new Response(value);
}

async function handleKvPut(request: Request, env: Env): Promise<Response> {
	await env.KV.put(kvKey(request), await request.text());
	return new Response(null, { status: 204 });
}
