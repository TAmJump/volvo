// TRACE//VEHICLE — Volvo API relay (Cloudflare Worker)
// ブラウザから api.volvocars.com へ直接アクセスすると CORS で遮断されるため、
// 読み取り専用（GET）の許可済みパスだけを中継する。トークンは保存・ログ出力しない。

const UPSTREAM = 'https://api.volvocars.com';
const VIN = '[A-HJ-NPR-Z0-9]{17}';
const ALLOWED_PATHS = [
  new RegExp(`^/connected-vehicle/v2/vehicles$`),
  new RegExp(`^/connected-vehicle/v2/vehicles/${VIN}$`),
  new RegExp(`^/connected-vehicle/v2/vehicles/${VIN}/(doors|windows|odometer|fuel|engine-status|diagnostics|statistics|tyres|warnings|brakes)$`),
  new RegExp(`^/location/v1/vehicles/${VIN}/location$`),
];

function allowedOrigins(env) {
  return (env.ALLOWED_ORIGINS || 'https://tamjump.github.io').split(',').map(s => s.trim()).filter(Boolean);
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, vcc-api-key, accept',
    'Access-Control-Max-Age': '600',
    'Vary': 'Origin',
  };
}

function json(status, body, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...(origin ? corsHeaders(origin) : {}) },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const okOrigin = allowedOrigins(env).includes(origin) ? origin : null;
    const url = new URL(request.url);

    if (url.pathname === '/health') return json(200, { ok: true, relay: 'volvo', write_methods: false }, okOrigin);
    if (!okOrigin) return json(403, { error: 'origin not allowed' });
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(okOrigin) });
    if (request.method !== 'GET') return json(405, { error: 'read-only relay' }, okOrigin);
    if (!ALLOWED_PATHS.some(re => re.test(url.pathname))) return json(404, { error: 'path not allowed' }, okOrigin);

    const auth = request.headers.get('authorization');
    const key = request.headers.get('vcc-api-key') || env.VCC_API_KEY;
    if (!auth || !key) return json(400, { error: 'authorization and vcc-api-key required' }, okOrigin);

    const upstream = await fetch(UPSTREAM + url.pathname, {
      method: 'GET',
      headers: { authorization: auth, 'vcc-api-key': key, accept: 'application/json' },
    });
    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: {
        'content-type': upstream.headers.get('content-type') || 'application/json',
        'cache-control': 'no-store',
        ...corsHeaders(okOrigin),
      },
    });
  },
};
