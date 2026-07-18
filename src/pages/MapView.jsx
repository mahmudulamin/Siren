import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { AlertTriangle, Navigation, RefreshCw, Users, WifiOff } from 'lucide-react';
import L from 'leaflet';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Loader from '../components/Loader';
import Button from '../components/Button';
import { getZonePredictions } from '../services/adminService';
import { useLiveRequests } from '../hooks/useLiveRequests';
import { DEFAULT_MAP_CENTER } from '../utils/config';
import { getSeverityColor, formatDate } from '../utils/helpers';
import { buildLiveZones, getZoneColor, resolveRequestCoordinates } from '../utils/liveMap';
import { getAllVolunteers } from '../services/volunteerService';
import { useAuth } from '../context/useAuth';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/**
 * Custom marker icons based on severity
 */
const getMarkerIcon = (severity) => {
  const colors = {
    critical: '#dc2626',
    high: '#f59e0b',
    medium: '#3b82f6',
    low: '#22c55e'
  };
  
  const color = colors[severity] || colors.medium;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-center;
      ">
        <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
          <path d="M12 2L2 22h20L12 2z"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const volunteerMarkerIcon = L.divIcon({
  className: 'volunteer-marker',
  html: '<div style="background:#7c3aed;color:white;width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;font-weight:700">V</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

/**
 * Component to recenter map
 */
const RecenterButton = ({ center }) => {
  const map = useMap();
  
  const handleRecenter = () => {
    map.setView([center.lat, center.lng], center.zoom);
  };
  
  return (
    <button
      onClick={handleRecenter}
      className="absolute bottom-6 right-6 z-[1000] bg-white p-3 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
      title="Recenter map"
    >
      <Navigation className="h-5 w-5 text-primary-600" />
    </button>
  );
};

/**
 * Live Map View Page
 */
const MapView = () => {
  const { user } = useAuth();
  const { requests, loading, offline, lastUpdated, refresh } = useLiveRequests();
  const [baseZones, setBaseZones] = useState([]);
  const [zonesLoading, setZonesLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [mapCenter] = useState(DEFAULT_MAP_CENTER);
  const [volunteers, setVolunteers] = useState([]);

  const loadZones = useCallback(async () => {
    try {
      const response = await getZonePredictions();
      setBaseZones(response.zones || []);
    } catch (error) {
      console.error('Error loading AI zones:', error);
    } finally {
      setZonesLoading(false);
    }
  }, []);

  const loadVolunteerLocations = useCallback(async () => {
    if (user?.role !== 'official') return;
    try {
      const response = await getAllVolunteers({ limit: 100 });
      setVolunteers(response.volunteers || []);
    } catch (error) {
      console.error('Error loading volunteer locations:', error);
    }
  }, [user?.role]);

  useEffect(() => {
    loadZones();
    loadVolunteerLocations();
    const timer = window.setInterval(loadZones, 30000);
    const volunteerTimer = window.setInterval(loadVolunteerLocations, 15000);
    window.addEventListener('online', loadZones);
    return () => {
      window.clearInterval(timer);
      window.clearInterval(volunteerTimer);
      window.removeEventListener('online', loadZones);
    };
  }, [loadZones, loadVolunteerLocations]);

  const mappedRequests = useMemo(() => requests.map((request) => ({
    ...request,
    mapCoordinates: resolveRequestCoordinates(request)
  })), [requests]);
  const visibleRequests = mappedRequests.filter((request) => request.mapCoordinates);
  const unmappedRequests = mappedRequests.filter((request) => !request.mapCoordinates);
  const liveZones = useMemo(
    () => buildLiveZones(baseZones, requests),
    [baseZones, requests]
  );

  const handleRefresh = () => {
    refresh();
    loadZones();
    loadVolunteerLocations();
  };
  
  if (loading && zonesLoading) {
    return <Loader fullScreen text="Loading map..." />;
  }
  
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Disaster Map</h1>
          <p className="text-gray-600 mt-2">AI situation zones and emergency requests refresh automatically every 15 seconds</p>
          <p className="text-xs text-gray-500 mt-1">
            {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : 'Updating live data...'}
            {offline && <span className="ml-2 text-warning-700">• showing device-cached reports</span>}
          </p>
        </div>
        <Button size="sm" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh now
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card padding={false} className="overflow-hidden">
            <div className="h-[600px] relative">
              <MapContainer
                center={[mapCenter.lat, mapCenter.lng]}
                zoom={mapCenter.zoom}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {liveZones.map((zone) => (
                  <Circle
                    key={zone.id}
                    center={[zone.coordinates.lat, zone.coordinates.lng]}
                    radius={zone.liveRequestZone ? 5000 : 12000}
                    pathOptions={{
                      color: getZoneColor(zone.severity),
                      fillColor: getZoneColor(zone.severity),
                      fillOpacity: 0.24,
                      weight: 2
                    }}
                    eventHandlers={{ click: () => setSelectedZone(zone) }}
                  >
                    <Popup>
                      <div className="p-2 min-w-[200px]">
                        <h3 className="font-semibold text-gray-900">{zone.name}</h3>
                        <p className="text-sm mt-1">Situation: {zone.severity.toUpperCase()}</p>
                        <p className="text-sm">Risk score: {zone.riskScore}/100</p>
                        <p className="text-xs text-gray-600 mt-2">{zone.prediction}</p>
                      </div>
                    </Popup>
                  </Circle>
                ))}

                {visibleRequests.map(request => (
                    <React.Fragment key={request.id}>
                    <Marker
                      position={[request.mapCoordinates.lat, request.mapCoordinates.lng]}
                      icon={getMarkerIcon(request.severity)}
                      eventHandlers={{
                        click: () => setSelectedRequest(request)
                      }}
                    >
                      <Popup>
                        <div className="p-2 min-w-[200px]">
                          <h3 className="font-semibold text-gray-900 mb-2">{request.emergencyType}</h3>
                          <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                          <div className="flex gap-2 mb-2">
                            <Badge variant={getSeverityColor(request.severity)} size="sm">
                              {request.severity}
                            </Badge>
                            <Badge variant="info" size="sm">
                              {request.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">{request.address}</p>
                          {request.mapCoordinates.approximate && (
                            <p className="text-xs text-warning-700 mt-1">Approximate district location</p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                    </React.Fragment>
                ))}

                {volunteers
                  .filter((volunteer) => Number.isFinite(volunteer.location?.lat) && Number.isFinite(volunteer.location?.lng))
                  .map((volunteer) => (
                    <Marker key={`volunteer-${volunteer.id}`} position={[volunteer.location.lat, volunteer.location.lng]} icon={volunteerMarkerIcon}>
                      <Popup>
                        <div className="p-2 min-w-[190px]">
                          <h3 className="font-semibold text-gray-900">{volunteer.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{volunteer.operationalStatus || 'available'}</p>
                          <p className="text-xs text-gray-500 mt-2">{volunteer.phone}</p>
                          <p className="text-xs text-gray-500">GPS shared: {formatDate(volunteer.lastLocationAt)}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                
                <RecenterButton center={mapCenter} />
              </MapContainer>
            </div>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-4">
          <Card title="Map Legend">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Request markers</p>
            <div className="space-y-3 mb-5">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-danger-600 mr-3"></div>
                <span className="text-sm text-gray-700">Critical</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-warning-600 mr-3"></div>
                <span className="text-sm text-gray-700">High</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-primary-600 mr-3"></div>
                <span className="text-sm text-gray-700">Medium</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-success-600 mr-3"></div>
                <span className="text-sm text-gray-700">Low</span>
              </div>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">AI situation zones</p>
            <div className="space-y-3">
              <div className="flex items-center"><div className="w-7 h-4 rounded bg-red-500/30 border-2 border-red-600 mr-3"></div><span className="text-sm text-gray-700">Critical</span></div>
              <div className="flex items-center"><div className="w-7 h-4 rounded bg-amber-500/30 border-2 border-amber-500 mr-3"></div><span className="text-sm text-gray-700">Moderate</span></div>
              <div className="flex items-center"><div className="w-7 h-4 rounded bg-green-500/30 border-2 border-green-600 mr-3"></div><span className="text-sm text-gray-700">Safe</span></div>
            </div>
            {user?.role === 'official' && (
              <div className="flex items-center mt-5 pt-4 border-t border-gray-200">
                <div className="w-4 h-4 rounded-full bg-violet-600 mr-3"></div>
                <span className="text-sm text-gray-700">Volunteer GPS</span>
              </div>
            )}
          </Card>
          
          <Card title="Statistics">
            <div className="space-y-3">
              <div>
                <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
                <p className="text-sm text-gray-600">Total Requests</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-danger-600">
                  {requests.filter(r => r.severity === 'critical').length}
                </p>
                <p className="text-sm text-gray-600">Critical Cases</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success-600">
                  {requests.filter(r => r.status === 'completed').length}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-warning-600">{liveZones.length}</p>
                <p className="text-sm text-gray-600">AI Situation Zones</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-700">{unmappedRequests.length}</p>
                <p className="text-sm text-gray-600">Reports Without Mappable Location</p>
              </div>
              {user?.role === 'official' && (
                <div>
                  <p className="text-2xl font-bold text-violet-700">{volunteers.filter((volunteer) => Number.isFinite(volunteer.location?.lat) && Number.isFinite(volunteer.location?.lng)).length}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1"><Users className="h-4 w-4" />Volunteer GPS Markers</p>
                </div>
              )}
            </div>
          </Card>

          {unmappedRequests.length > 0 && (
            <Card title="Location Needed">
              <div className="flex items-start text-sm text-gray-600">
                <WifiOff className="h-5 w-5 mr-2 mt-0.5 text-warning-600 shrink-0" />
                <p>{unmappedRequests.length} report(s) need GPS, manual coordinates, or a recognised district name before a marker can be placed.</p>
              </div>
            </Card>
          )}

          {selectedZone && (
            <Card title="Selected AI Zone">
              <h3 className="font-semibold text-gray-900">{selectedZone.name}</h3>
              <p className="text-sm text-gray-600 mt-2">{selectedZone.prediction}</p>
              <p className="text-sm font-semibold mt-3" style={{ color: getZoneColor(selectedZone.severity) }}>
                {selectedZone.severity.toUpperCase()} • Risk {selectedZone.riskScore}/100
              </p>
              <p className="text-xs text-gray-500 mt-2">Active reports in zone: {selectedZone.requestCount || 0}</p>
            </Card>
          )}
          
          {selectedRequest && (
            <Card title="Selected Request">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{selectedRequest.emergencyType}</h3>
                <div className="flex gap-2 mb-3">
                  <Badge variant={getSeverityColor(selectedRequest.severity)} size="sm">
                    {selectedRequest.severity}
                  </Badge>
                  <Badge variant="info" size="sm">
                    {selectedRequest.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{selectedRequest.description}</p>
                <div className="text-sm text-gray-500 space-y-1">
                  <p><strong>Location:</strong> {selectedRequest.address}</p>
                  {selectedRequest.phone && <p><strong>Contact:</strong> {selectedRequest.phone}</p>}
                  <p><strong>Submitted:</strong> {formatDate(selectedRequest.createdAt)}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;
