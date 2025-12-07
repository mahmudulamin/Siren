import React, { useEffect, useState } from 'react';
import { Search, Filter, Eye } from 'lucide-react';
import Card from '../components/Card';
import Table from '../components/Table';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import { getAllRequests } from '../services/requestService';
import { getStatusColor, getSeverityColor, formatDate, formatPhone } from '../utils/helpers';
import { EMERGENCY_TYPES, REQUEST_STATUS, SEVERITY_LEVELS } from '../utils/config';

/**
 * Requests List Page
 */
const RequestsList = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    severity: '',
    emergencyType: ''
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  useEffect(() => {
    loadRequests();
  }, []);
  
  useEffect(() => {
    applyFilters();
  }, [requests, searchTerm, filters]);
  
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
  
  const applyFilters = () => {
    let filtered = [...requests];
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(req =>
        req.victimName.toLowerCase().includes(term) ||
        req.address.toLowerCase().includes(term) ||
        req.emergencyType.toLowerCase().includes(term) ||
        req.description.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(req => req.status === filters.status);
    }
    
    // Apply severity filter
    if (filters.severity) {
      filtered = filtered.filter(req => req.severity === filters.severity);
    }
    
    // Apply emergency type filter
    if (filters.emergencyType) {
      filtered = filtered.filter(req => req.emergencyType === filters.emergencyType);
    }
    
    setFilteredRequests(filtered);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const clearFilters = () => {
    setFilters({
      status: '',
      severity: '',
      emergencyType: ''
    });
    setSearchTerm('');
  };
  
  const viewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };
  
  const columns = [
    {
      header: 'Request ID',
      accessor: 'id',
      render: (row) => <span className="font-mono text-sm">#{row.id.substring(0, 8)}</span>
    },
    {
      header: 'Victim',
      accessor: 'victimName',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.victimName}</p>
          <p className="text-sm text-gray-500">{formatPhone(row.phone)}</p>
        </div>
      )
    },
    {
      header: 'Emergency Type',
      accessor: 'emergencyType'
    },
    {
      header: 'Location',
      accessor: 'address',
      render: (row) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-900 truncate">{row.address}</p>
        </div>
      )
    },
    {
      header: 'Severity',
      accessor: 'severity',
      render: (row) => (
        <Badge variant={getSeverityColor(row.severity)} size="sm">
          {row.severity.toUpperCase()}
        </Badge>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge variant={getStatusColor(row.status)} size="sm">
          {row.status.replace('_', ' ').toUpperCase()}
        </Badge>
      )
    },
    {
      header: 'Submitted',
      accessor: 'createdAt',
      render: (row) => (
        <span className="text-sm text-gray-600">{formatDate(row.createdAt)}</span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <Button
          size="sm"
          variant="outline"
          icon={Eye}
          onClick={() => viewDetails(row)}
        >
          View
        </Button>
      )
    }
  ];
  
  if (loading) {
    return <Loader fullScreen text="Loading requests..." />;
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">All Emergency Requests</h1>
        <p className="text-gray-600 mt-2">Browse and filter all submitted requests</p>
      </div>
      
      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="Search by name, location, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
          
          <Select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            placeholder="Filter by status"
            options={Object.values(REQUEST_STATUS).map(status => ({
              value: status,
              label: status.replace('_', ' ').toUpperCase()
            }))}
          />
          
          <Select
            name="severity"
            value={filters.severity}
            onChange={handleFilterChange}
            placeholder="Filter by severity"
            options={Object.values(SEVERITY_LEVELS).map(sev => ({
              value: sev,
              label: sev.toUpperCase()
            }))}
          />
          
          <Select
            name="emergencyType"
            value={filters.emergencyType}
            onChange={handleFilterChange}
            placeholder="Filter by type"
            options={EMERGENCY_TYPES}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredRequests.length} of {requests.length} requests
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </div>
      </Card>
      
      {/* Table */}
      <Card padding={false}>
        <Table
          columns={columns}
          data={filteredRequests}
          emptyMessage="No requests found"
        />
      </Card>
      
      {/* Details Modal */}
      {selectedRequest && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Request Details"
          size="lg"
          footer={
            <>
              <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                Close
              </Button>
              <Button>
                Assign Volunteer
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Request ID</p>
                <p className="font-mono text-sm">#{selectedRequest.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <Badge variant={getStatusColor(selectedRequest.status)}>
                  {selectedRequest.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Victim Information</p>
              <p className="font-medium">{selectedRequest.victimName}</p>
              <p className="text-sm text-gray-700">{formatPhone(selectedRequest.phone)}</p>
              {selectedRequest.email && <p className="text-sm text-gray-700">{selectedRequest.email}</p>}
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Emergency Type</p>
              <p className="font-medium">{selectedRequest.emergencyType}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Severity</p>
              <Badge variant={getSeverityColor(selectedRequest.severity)}>
                {selectedRequest.severity.toUpperCase()}
              </Badge>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Description</p>
              <p className="text-gray-900">{selectedRequest.description}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Location</p>
              <p className="text-gray-900">{selectedRequest.address}</p>
              {selectedRequest.coordinates && (
                <p className="text-sm text-gray-500 mt-1">
                  Coordinates: {selectedRequest.coordinates.lat.toFixed(6)}, {selectedRequest.coordinates.lng.toFixed(6)}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Submitted</p>
                <p className="text-sm">{formatDate(selectedRequest.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                <p className="text-sm">{formatDate(selectedRequest.updatedAt)}</p>
              </div>
            </div>
            
            {selectedRequest.photoUrl && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Photo Evidence</p>
                <img
                  src={selectedRequest.photoUrl}
                  alt="Evidence"
                  className="rounded-lg max-h-64 w-auto"
                />
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RequestsList;
