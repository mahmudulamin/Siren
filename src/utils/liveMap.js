const DISTRICT_CENTERS = [
  ['sunamganj', 25.0658, 91.3958],
  ['sylhet', 24.8949, 91.8687],
  ['feni', 23.0159, 91.3976],
  ['noakhali', 22.8696, 91.0995],
  ['cumilla', 23.4607, 91.1809],
  ['comilla', 23.4607, 91.1809],
  ['dhaka', 23.8103, 90.4125],
  ['chattogram', 22.3569, 91.7832],
  ['chittagong', 22.3569, 91.7832],
  ['cox\'s bazar', 21.4272, 92.0058],
  ['cox bazar', 21.4272, 92.0058],
  ['barishal', 22.701, 90.3535],
  ['barisal', 22.701, 90.3535],
  ['khulna', 22.8456, 89.5403],
  ['rajshahi', 24.3745, 88.6042],
  ['rangpur', 25.7439, 89.2752],
  ['mymensingh', 24.7471, 90.4203],
  ['gazipur', 23.9999, 90.4203],
  ['tangail', 24.2513, 89.9167],
  ['bogura', 24.8465, 89.3776],
  ['bogra', 24.8465, 89.3776],
  ['kurigram', 25.8072, 89.6295],
  ['gaibandha', 25.3288, 89.5282]
];

export const resolveRequestCoordinates = (request) => {
  const lat = Number(request?.coordinates?.lat);
  const lng = Number(request?.coordinates?.lng);

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return { lat, lng, approximate: false };
  }

  const address = String(request?.address || '').toLowerCase();
  const match = DISTRICT_CENTERS.find(([name]) => address.includes(name));
  return match
    ? { lat: match[1], lng: match[2], approximate: true }
    : null;
};

const toRadians = (degrees) => degrees * (Math.PI / 180);

const distanceKm = (first, second) => {
  const earthRadiusKm = 6371;
  const latDelta = toRadians(second.lat - first.lat);
  const lngDelta = toRadians(second.lng - first.lng);
  const a = Math.sin(latDelta / 2) ** 2 +
    Math.cos(toRadians(first.lat)) * Math.cos(toRadians(second.lat)) *
    Math.sin(lngDelta / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const REQUEST_RISK = { critical: 92, high: 74, medium: 52, low: 25 };

export const severityFromRisk = (score) => {
  if (score >= 75) return 'critical';
  if (score >= 40) return 'moderate';
  return 'safe';
};

/**
 * Combines configured/AI zones with current open victim requests. A request
 * within 50km raises that zone's score; requests outside known zones create a
 * live situation zone of their own.
 */
export const buildLiveZones = (baseZones = [], requests = []) => {
  const zones = baseZones
    .filter((zone) => Number.isFinite(Number(zone.coordinates?.lat)) && Number.isFinite(Number(zone.coordinates?.lng)))
    .map((zone) => ({
      ...zone,
      coordinates: { lat: Number(zone.coordinates.lat), lng: Number(zone.coordinates.lng) },
      riskScore: Number(zone.riskScore) || 0,
      requestCount: 0,
      requestIds: []
    }));

  requests
    .filter((request) => !['completed', 'cancelled'].includes(request.status))
    .forEach((request) => {
      const coordinates = resolveRequestCoordinates(request);
      if (!coordinates) return;

      let nearest = null;
      let nearestDistance = Infinity;
      zones.forEach((zone) => {
        const distance = distanceKm(coordinates, zone.coordinates);
        if (distance < nearestDistance) {
          nearest = zone;
          nearestDistance = distance;
        }
      });

      const requestRisk = REQUEST_RISK[request.severity] || REQUEST_RISK.medium;
      if (nearest && nearestDistance <= 50) {
        nearest.requestCount += 1;
        nearest.requestIds.push(request.id);
        nearest.riskScore = Math.min(100, Math.max(nearest.riskScore, requestRisk) + Math.min(8, nearest.requestCount - 1));
        nearest.severity = severityFromRisk(nearest.riskScore);
        nearest.prediction = `${nearest.requestCount} active emergency request(s) detected near ${nearest.name}.`;
        nearest.updatedAt = new Date().toISOString();
        return;
      }

      zones.push({
        id: `live-${request.id}`,
        name: request.address || 'Reported location',
        district: coordinates.approximate ? 'Approximate district location' : 'Victim reported location',
        severity: severityFromRisk(requestRisk),
        riskScore: requestRisk,
        coordinates,
        affectedPopulation: 1,
        prediction: `Live ${request.severity || 'medium'} emergency report awaiting response.`,
        recommendations: ['Verify the report', 'Alert nearby volunteers', 'Coordinate an official response'],
        updatedAt: request.updatedAt || request.createdAt || new Date().toISOString(),
        requestCount: 1,
        requestIds: [request.id],
        liveRequestZone: true
      });
    });

  return zones.map((zone) => ({
    ...zone,
    severity: severityFromRisk(Number(zone.riskScore) || 0)
  }));
};

export const getZoneColor = (severity) => ({
  critical: '#dc2626',
  moderate: '#f59e0b',
  safe: '#22c55e'
}[severity] || '#22c55e');
