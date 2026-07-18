import { buildOfflineRequest, cacheRequest } from './offlineStore.js';

const RELAY_PREFIX = 'SIREN1.';
const VALID_SEVERITIES = ['low', 'medium', 'high', 'critical'];
const VALID_EMERGENCY_TYPES = [
  'Flood',
  'Medical Emergency',
  'Food/Water Shortage',
  'Shelter',
  'Rescue',
  'Other'
];

const encodeBase64Url = (value) => {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
};

const decodeBase64Url = (value) => {
  const base64 = value.replaceAll('-', '+').replaceAll('_', '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
};

const normalizeCoordinates = (coordinates) => {
  const lat = Number(coordinates?.lat);
  const lng = Number(coordinates?.lng);
  return Number.isFinite(lat) && Number.isFinite(lng) &&
    lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
    ? { lat, lng }
    : null;
};

const validateRelayPayload = (payload) => {
  if (!payload || payload.v !== 1) throw new Error('Unsupported SIREN relay code');
  if (!payload.c || String(payload.c).length > 120) throw new Error('Invalid report identifier');
  if (!payload.n || !payload.p || !payload.a || !payload.d) throw new Error('Relay report is missing required information');
  if (!VALID_EMERGENCY_TYPES.includes(payload.t)) throw new Error('Invalid emergency type');
  if (!VALID_SEVERITIES.includes(payload.s)) throw new Error('Invalid severity level');
  if (String(payload.n).length > 100 || String(payload.p).length > 30 ||
      String(payload.a).length > 500 || String(payload.d).length > 1500) {
    throw new Error('Relay report is too large');
  }
  return payload;
};

export const createRelayCode = (request) => {
  const clientRequestId = request.clientRequestId || String(request.id || '').replace(/^offline-/, '');
  if (!clientRequestId) throw new Error('Report does not have a relay identifier');

  return RELAY_PREFIX + encodeBase64Url({
    v: 1,
    c: clientRequestId,
    n: String(request.victimName || '').slice(0, 100),
    p: String(request.phone || '').slice(0, 30),
    e: String(request.email || '').slice(0, 150),
    a: String(request.address || '').slice(0, 500),
    g: normalizeCoordinates(request.coordinates),
    t: request.emergencyType,
    d: String(request.description || '').slice(0, 1500),
    s: request.severity,
    l: request.locationSource || 'address',
    x: request.createdAt || new Date().toISOString()
  });
};

export const parseRelayCode = (input) => {
  const text = String(input || '').trim();
  const prefixIndex = text.indexOf(RELAY_PREFIX);
  if (prefixIndex < 0) throw new Error('SIREN relay code পাওয়া যায়নি');

  const encoded = text.slice(prefixIndex + RELAY_PREFIX.length).split(/\s/)[0].trim();
  if (!encoded || encoded.length > 12000) throw new Error('Invalid SIREN relay code');

  const payload = validateRelayPayload(decodeBase64Url(encoded));
  return {
    clientRequestId: String(payload.c),
    victimName: String(payload.n),
    phone: String(payload.p),
    email: payload.e ? String(payload.e) : '',
    address: String(payload.a),
    coordinates: normalizeCoordinates(payload.g),
    emergencyType: payload.t,
    description: String(payload.d),
    severity: payload.s,
    locationSource: normalizeCoordinates(payload.g) ? (payload.l || 'manual') : 'address',
    createdAt: payload.x || new Date().toISOString()
  };
};

export const importRelayReport = (input) => {
  const report = parseRelayCode(input);
  const imported = buildOfflineRequest({
    id: `offline-${report.clientRequestId}`,
    ...report,
    relayReceivedAt: new Date().toISOString(),
    relaySource: 'nearby-responder'
  });
  cacheRequest(imported);
  return imported;
};

export const createRelayShareText = (request) => {
  const code = createRelayCode(request);
  return [
    'SIREN OFFLINE EMERGENCY REPORT',
    `Severity: ${String(request.severity || '').toUpperCase()}`,
    `Type: ${request.emergencyType}`,
    `Victim: ${request.victimName}`,
    `Phone: ${request.phone}`,
    `Address: ${request.address}`,
    `Details: ${String(request.description || '').slice(0, 500)}`,
    '',
    'Responder: SIREN app-এর Import Offline Report page-এ নিচের code paste করুন:',
    code
  ].join('\n');
};
