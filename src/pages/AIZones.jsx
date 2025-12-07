import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { AlertTriangle, TrendingUp, Shield } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import { getZonePredictions } from '../services/adminService';
import { DEFAULT_MAP_CENTER } from '../utils/config';
import 'leaflet/dist/leaflet.css';

/**
 * AI Zone Prediction Page
 */
const AIZones = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState(null);
  
  useEffect(() => {
    loadZones();
  }, []);
  
  const loadZones = async () => {
    try {
      const response = await getZonePredictions();
      setZones(response.zones || []);
    } catch (error) {
      console.error('Error loading zones:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getZoneColor = (severity) => {
    const colors = {
      critical: '#dc2626',
      moderate: '#f59e0b',
      safe: '#22c55e'
    };
    return colors[severity] || colors.safe;
  };
  
  const getZoneBadgeVariant = (severity) => {
    const variants = {
      critical: 'danger',
      moderate: 'warning',
      safe: 'success'
    };
    return variants[severity] || 'info';
  };
  
  const getSeverityIcon = (severity) => {
    if (severity === 'critical') return AlertTriangle;
    if (severity === 'moderate') return TrendingUp;
    return Shield;
  };
  
  const criticalZones = zones.filter(z => z.severity === 'critical');
  const moderateZones = zones.filter(z => z.severity === 'moderate');
  const safeZones = zones.filter(z => z.severity === 'safe');
  
  if (loading) {
    return <Loader fullScreen text="Loading AI predictions..." />;
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">AI Zone Predictions</h1>
        <p className="text-gray-600 mt-2">Machine learning-powered disaster severity assessment</p>
      </div>
      
      {criticalZones.length > 0 && (
        <Alert
          type="error"
          title="Critical Zones Detected"
          message={`${criticalZones.length} zone(s) require immediate attention and evacuation planning.`}
          className="mb-6"
        />
      )}
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Critical Zones</p>
              <p className="text-3xl font-bold text-danger-600">{criticalZones.length}</p>
            </div>
            <div className="p-3 bg-danger-100 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-danger-600" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Moderate Zones</p>
              <p className="text-3xl font-bold text-warning-600">{moderateZones.length}</p>
            </div>
            <div className="p-3 bg-warning-100 rounded-lg">
              <TrendingUp className="h-8 w-8 text-warning-600" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Safe Zones</p>
              <p className="text-3xl font-bold text-success-600">{safeZones.length}</p>
            </div>
            <div className="p-3 bg-success-100 rounded-lg">
              <Shield className="h-8 w-8 text-success-600" />
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card padding={false} className="overflow-hidden">
            <div className="h-[600px]">
              <MapContainer
                center={[DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng]}
                zoom={DEFAULT_MAP_CENTER.zoom}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {zones.map(zone => (
                  <Circle
                    key={zone.id}
                    center={[zone.coordinates.lat, zone.coordinates.lng]}
                    radius={2000} // 2km radius
                    pathOptions={{
                      color: getZoneColor(zone.severity),
                      fillColor: getZoneColor(zone.severity),
                      fillOpacity: 0.3
                    }}
                    eventHandlers={{
                      click: () => setSelectedZone(zone)
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold text-gray-900 mb-2">{zone.name}</h3>
                        <Badge variant={getZoneBadgeVariant(zone.severity)} size="sm">
                          {zone.severity.toUpperCase()}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-2">Risk Score: {zone.riskScore}/100</p>
                        <p className="text-sm text-gray-600">Population: {zone.affectedPopulation.toLocaleString()}</p>
                      </div>
                    </Popup>
                  </Circle>
                ))}
              </MapContainer>
            </div>
          </Card>
        </div>
        
        {/* Zone List */}
        <div className="space-y-4">
          {selectedZone ? (
            <Card title="Zone Details">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{selectedZone.name}</h3>
                  <p className="text-sm text-gray-600">{selectedZone.district}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">Severity Level</p>
                  <Badge variant={getZoneBadgeVariant(selectedZone.severity)}>
                    {selectedZone.severity.toUpperCase()}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">Risk Score</p>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-3 mr-3">
                      <div
                        className={`h-3 rounded-full ${
                          selectedZone.severity === 'critical' ? 'bg-danger-600' :
                          selectedZone.severity === 'moderate' ? 'bg-warning-600' :
                          'bg-success-600'
                        }`}
                        style={{ width: `${selectedZone.riskScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold">{selectedZone.riskScore}/100</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">Affected Population</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedZone.affectedPopulation.toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">AI Prediction</p>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {selectedZone.prediction}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">Recommendations</p>
                  <ul className="space-y-2">
                    {selectedZone.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-gray-900 flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Last updated: {new Date(selectedZone.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <p className="text-center text-gray-500 py-8">
                Click on a zone on the map to view details
              </p>
            </Card>
          )}
          
          <Card title="All Zones">
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {zones.map(zone => {
                const Icon = getSeverityIcon(zone.severity);
                return (
                  <div
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedZone?.id === zone.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <Icon className={`h-5 w-5 mr-2 ${
                          zone.severity === 'critical' ? 'text-danger-600' :
                          zone.severity === 'moderate' ? 'text-warning-600' :
                          'text-success-600'
                        }`} />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{zone.name}</p>
                          <p className="text-xs text-gray-500">{zone.district}</p>
                        </div>
                      </div>
                      <Badge variant={getZoneBadgeVariant(zone.severity)} size="sm">
                        {zone.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <span>Risk: {zone.riskScore}/100</span>
                      <span className="mx-2">•</span>
                      <span>{zone.affectedPopulation.toLocaleString()} affected</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIZones;
