import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { AlertTriangle, Navigation } from 'lucide-react';
import L from 'leaflet';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Loader from '../components/Loader';
import Button from '../components/Button';
import { getAllRequests } from '../services/requestService';
import { DEFAULT_MAP_CENTER } from '../utils/config';
import { getSeverityColor, formatDate } from '../utils/helpers';
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
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [mapCenter] = useState(DEFAULT_MAP_CENTER);
  
  useEffect(() => {
    loadRequests();
  }, []);
  
  const loadRequests = async () => {
    try {
      const response = await getAllRequests();
      setRequests(response.requests || []);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <Loader fullScreen text="Loading map..." />;
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Live Disaster Map</h1>
        <p className="text-gray-600 mt-2">Real-time view of all emergency requests</p>
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
                
                {requests.map(request => (
                  request.coordinates && (
                    <Marker
                      key={request.id}
                      position={[request.coordinates.lat, request.coordinates.lng]}
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
                        </div>
                      </Popup>
                    </Marker>
                  )
                ))}
                
                <RecenterButton center={mapCenter} />
              </MapContainer>
            </div>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-4">
          <Card title="Legend">
            <div className="space-y-3">
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
            </div>
          </Card>
          
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
                  <p><strong>Contact:</strong> {selectedRequest.phone}</p>
                  <p><strong>Submitted:</strong> {formatDate(selectedRequest.createdAt)}</p>
                </div>
                <Button size="sm" className="mt-4" fullWidth>
                  View Details
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;
