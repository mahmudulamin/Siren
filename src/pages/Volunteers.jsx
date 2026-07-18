import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ClipboardList,
  Clock3,
  LocateFixed,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import StatsCard from '../components/StatsCard';
import { assignVolunteer, getAllVolunteers } from '../services/volunteerService';
import { getAllRequests } from '../services/requestService';
import { formatDate, getSeverityColor, getStatusColor } from '../utils/helpers';

const STATUS_LABELS = {
  available: 'Available',
  assigned: 'Assigned',
  en_route: 'On the way',
  on_scene: 'On scene',
  unavailable: 'Unavailable'
};

const isActiveRequest = (request) => !['completed', 'cancelled'].includes(request.status);

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [assigning, setAssigning] = useState(false);

  const loadData = useCallback(async (quiet = false) => {
    if (!quiet) setRefreshing(true);
    try {
      const [volunteerData, requestData] = await Promise.all([
        getAllVolunteers({ limit: 100 }),
        getAllRequests({ limit: 100 })
      ]);
      setVolunteers(volunteerData.volunteers || []);
      setRequests(requestData.requests || []);
      setLastUpdated(new Date());
    } catch (error) {
      toast.error(error.response?.data?.message || 'Volunteer monitoring data could not be loaded');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData(true);
    const timer = window.setInterval(() => loadData(true), 15000);
    return () => window.clearInterval(timer);
  }, [loadData]);

  const assignmentByVolunteer = useMemo(() => {
    const assignments = new Map();
    requests.filter(isActiveRequest).forEach((request) => {
      const volunteerId = request.assignedVolunteer?.volunteerId;
      if (volunteerId) assignments.set(String(volunteerId), request);
    });
    return assignments;
  }, [requests]);

  const filteredVolunteers = useMemo(() => volunteers.filter((volunteer) => {
    const status = volunteer.operationalStatus || (volunteer.availability ? 'available' : 'unavailable');
    if (statusFilter && status !== statusFilter) return false;
    if (!search) return true;
    const haystack = [volunteer.name, volunteer.email, volunteer.phone, ...(volunteer.skills || [])]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(search.toLowerCase());
  }), [volunteers, search, statusFilter]);

  const unassignedRequests = useMemo(() => requests
    .filter((request) => request.status === 'pending' && !request.assignedVolunteer?.volunteerId)
    .sort((first, second) => {
      const rank = { critical: 4, high: 3, medium: 2, low: 1 };
      return (rank[second.severity] || 0) - (rank[first.severity] || 0) ||
        new Date(first.createdAt) - new Date(second.createdAt);
    }), [requests]);

  const selectedRequest = unassignedRequests.find((request) => request.id === selectedRequestId);

  const openAssignment = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setSelectedRequestId('');
  };

  const closeAssignment = () => {
    if (assigning) return;
    setSelectedVolunteer(null);
    setSelectedRequestId('');
  };

  const handleAssignment = async () => {
    if (!selectedVolunteer || !selectedRequestId) {
      toast.error('Assign করার জন্য একটি emergency request নির্বাচন করুন');
      return;
    }

    setAssigning(true);
    try {
      await assignVolunteer(selectedRequestId, selectedVolunteer.id);
      toast.success(`${selectedVolunteer.name}-কে কাজটি assign করা হয়েছে`);
      setSelectedVolunteer(null);
      setSelectedRequestId('');
      await loadData(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'কাজ assign করা যায়নি');
    } finally {
      setAssigning(false);
    }
  };

  const activeCount = volunteers.filter((volunteer) =>
    ['assigned', 'en_route', 'on_scene'].includes(volunteer.operationalStatus)
  ).length;
  const availableCount = volunteers.filter((volunteer) => volunteer.availability).length;
  const locationCount = volunteers.filter((volunteer) =>
    Number.isFinite(volunteer.location?.lat) && Number.isFinite(volunteer.location?.lng)
  ).length;

  if (loading) return <Loader fullScreen text="Loading volunteer monitoring..." />;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Volunteer Monitoring</h1>
          <p className="text-gray-600 mt-2">Track availability, assigned location, field status and latest GPS update.</p>
          <p className="text-xs text-gray-500 mt-1">
            Auto-refresh every 15 seconds{lastUpdated ? ` • Updated ${lastUpdated.toLocaleTimeString()}` : ''}
          </p>
        </div>
        <Button icon={RefreshCw} onClick={() => loadData()} loading={refreshing}>Refresh now</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <StatsCard title="Registered" value={volunteers.length} icon={Users} color="primary" />
        <StatsCard title="Available" value={availableCount} icon={Activity} color="success" />
        <StatsCard title="On Mission" value={activeCount} icon={MapPin} color="warning" />
        <StatsCard title="GPS Shared" value={locationCount} icon={LocateFixed} color="info" />
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input icon={Search} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, phone, email or skill..." />
          <Select
            name="statusFilter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            placeholder="All field statuses"
            options={Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))}
          />
        </div>
      </Card>

      {filteredVolunteers.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="font-medium">No volunteer matches this filter</p>
            <p className="text-sm mt-2">New volunteer accounts will appear here automatically.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredVolunteers.map((volunteer) => {
            const assignment = assignmentByVolunteer.get(volunteer.id);
            const status = volunteer.operationalStatus || (volunteer.availability ? 'available' : 'unavailable');
            const hasLocation = Number.isFinite(volunteer.location?.lat) && Number.isFinite(volunteer.location?.lng);
            return (
              <Card key={volunteer.id}>
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{volunteer.name}</h2>
                    <p className="text-sm text-gray-500">{volunteer.email}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={volunteer.availability ? 'success' : 'warning'}>
                      {volunteer.availability ? 'AVAILABLE' : 'BUSY'}
                    </Badge>
                    <Badge variant={status === 'on_scene' ? 'danger' : status === 'available' ? 'success' : 'info'}>
                      {STATUS_LABELS[status] || status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                  <p className="flex items-center gap-2 text-gray-700"><Phone className="h-4 w-4 text-gray-400" />{volunteer.phone}</p>
                  <p className="flex items-center gap-2 text-gray-700"><Clock3 className="h-4 w-4 text-gray-400" />{volunteer.tasksCompleted || 0} tasks completed</p>
                </div>

                {volunteer.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {volunteer.skills.map((skill) => <Badge key={skill} variant="gray">{skill}</Badge>)}
                  </div>
                )}

                <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Current assignment</p>
                  {assignment ? (
                    <>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant={getSeverityColor(assignment.severity)}>{assignment.severity.toUpperCase()}</Badge>
                        <Badge variant={getStatusColor(assignment.status)}>{assignment.status.replace('_', ' ').toUpperCase()}</Badge>
                      </div>
                      <p className="font-semibold text-gray-900">{assignment.emergencyType}</p>
                      <p className="text-sm text-gray-700 flex items-start gap-2 mt-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" />{assignment.address}</p>
                      <p className="text-xs text-gray-500 mt-2">Assigned {formatDate(assignment.assignedVolunteer?.assignedAt)}</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">No active emergency assignment</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-sm text-gray-600">
                    {hasLocation ? (
                      <>
                        <p className="font-medium text-gray-800">Last GPS: {volunteer.location.lat.toFixed(5)}, {volunteer.location.lng.toFixed(5)}</p>
                        <p className="text-xs mt-1">Shared {volunteer.lastLocationAt ? formatDate(volunteer.lastLocationAt) : 'recently'}</p>
                      </>
                    ) : <p>No GPS location shared yet</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {volunteer.availability && !assignment && (
                      <Button size="sm" icon={ClipboardList} onClick={() => openAssignment(volunteer)}>
                        Assign Work
                      </Button>
                    )}
                    {hasLocation && (
                      <a
                        href={`https://www.google.com/maps?q=${volunteer.location.lat},${volunteer.location.lng}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button size="sm" variant="ghost" icon={LocateFixed}>Open GPS</Button>
                      </a>
                    )}
                    <Link to="/map"><Button size="sm" variant="outline" icon={MapPin}>Live Map</Button></Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={Boolean(selectedVolunteer)}
        onClose={closeAssignment}
        title="Volunteer-কে কাজ দিন"
        size="lg"
        closeOnOverlay={!assigning}
        footer={
          <>
            <Button variant="secondary" onClick={closeAssignment} disabled={assigning}>Cancel</Button>
            <Button icon={ClipboardList} onClick={handleAssignment} loading={assigning} disabled={!selectedRequestId || assigning}>
              Confirm Assignment
            </Button>
          </>
        }
      >
        {selectedVolunteer && (
          <div className="space-y-5">
            <div className="rounded-lg border border-primary-200 bg-primary-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">Selected volunteer</p>
              <p className="font-semibold text-gray-900 mt-1">{selectedVolunteer.name}</p>
              <p className="text-sm text-gray-600">{selectedVolunteer.phone} • {selectedVolunteer.email}</p>
            </div>

            {unassignedRequests.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                <p className="font-medium text-gray-900">কোনো unassigned pending request নেই</p>
                <p className="text-sm text-gray-600 mt-2">নতুন victim request এলে এখানে automatically দেখা যাবে।</p>
              </div>
            ) : (
              <>
                <Select
                  label="যে emergency request-এ পাঠাবেন"
                  name="requestId"
                  value={selectedRequestId}
                  onChange={(event) => setSelectedRequestId(event.target.value)}
                  placeholder="একটি pending request নির্বাচন করুন"
                  options={unassignedRequests.map((request) => ({
                    value: request.id,
                    label: `${request.severity.toUpperCase()} • ${request.emergencyType} • ${request.address}`
                  }))}
                  required
                />

                {selectedRequest && (
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant={getSeverityColor(selectedRequest.severity)}>{selectedRequest.severity.toUpperCase()}</Badge>
                      <Badge variant="warning">PENDING</Badge>
                    </div>
                    <p className="font-semibold text-gray-900">{selectedRequest.emergencyType}</p>
                    <p className="text-sm text-gray-700 mt-2">{selectedRequest.description}</p>
                    <p className="text-sm text-gray-600 flex items-start gap-2 mt-3"><MapPin className="h-4 w-4 mt-0.5 shrink-0" />{selectedRequest.address}</p>
                    <p className="text-sm text-gray-600 mt-2"><strong>Victim phone:</strong> {selectedRequest.phone}</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Volunteers;
