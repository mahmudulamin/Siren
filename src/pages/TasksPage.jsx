import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, Play, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Textarea from '../components/Textarea';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import StatsCard from '../components/StatsCard';
import { getVolunteerTasks, acceptTask, updateTaskStatus } from '../services/volunteerService';
import { getStatusColor, formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

/**
 * Volunteer Task Manager Page
 */
const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateNotes, setUpdateNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  
  useEffect(() => {
    loadTasks();
  }, []);
  
  const loadTasks = async () => {
    try {
      const response = await getVolunteerTasks(user?.id || 'v1');
      setTasks(response.tasks || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAcceptTask = async (taskId) => {
    try {
      await acceptTask(taskId);
      toast.success('Task accepted successfully!');
      loadTasks();
    } catch (error) {
      toast.error('Failed to accept task');
    }
  };
  
  const handleUpdateStatus = async (newStatus) => {
    if (!selectedTask) return;
    
    setUpdating(true);
    try {
      await updateTaskStatus(selectedTask.id, newStatus, updateNotes);
      toast.success('Task status updated successfully!');
      setShowUpdateModal(false);
      setUpdateNotes('');
      loadTasks();
    } catch (error) {
      toast.error('Failed to update task status');
    } finally {
      setUpdating(false);
    }
  };
  
  const openUpdateModal = (task) => {
    setSelectedTask(task);
    setUpdateNotes(task.notes || '');
    setShowUpdateModal(true);
  };
  
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    active: tasks.filter(t => t.status === 'in_progress' || t.status === 'accepted').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };
  
  if (loading) {
    return <Loader fullScreen text="Loading tasks..." />;
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
        <p className="text-gray-600 mt-2">Manage your assigned emergency response tasks</p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Tasks"
          value={stats.total}
          icon={MapPin}
          color="primary"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          color="warning"
        />
        <StatsCard
          title="Active"
          value={stats.active}
          icon={Play}
          color="info"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle}
          color="success"
        />
      </div>
      
      {/* Tasks by Status */}
      <div className="space-y-6">
        {/* Pending Tasks */}
        {stats.pending > 0 && (
          <Card title="Pending Tasks" subtitle="Tasks waiting for your acceptance">
            <div className="space-y-4">
              {tasks.filter(t => t.status === 'pending').map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onAccept={handleAcceptTask}
                  onUpdate={openUpdateModal}
                />
              ))}
            </div>
          </Card>
        )}
        
        {/* Active Tasks */}
        {stats.active > 0 && (
          <Card title="Active Tasks" subtitle="Tasks currently in progress">
            <div className="space-y-4">
              {tasks.filter(t => t.status === 'accepted' || t.status === 'in_progress').map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdate={openUpdateModal}
                />
              ))}
            </div>
          </Card>
        )}
        
        {/* Completed Tasks */}
        {stats.completed > 0 && (
          <Card title="Completed Tasks" subtitle="Successfully finished tasks">
            <div className="space-y-4">
              {tasks.filter(t => t.status === 'completed').map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                />
              ))}
            </div>
          </Card>
        )}
        
        {tasks.length === 0 && (
          <Card>
            <div className="text-center py-12 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No tasks assigned yet</p>
              <p className="text-sm mt-2">Check back soon for new assignments</p>
            </div>
          </Card>
        )}
      </div>
      
      {/* Update Modal */}
      {selectedTask && (
        <Modal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          title="Update Task Status"
          size="md"
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => setShowUpdateModal(false)}
              >
                Cancel
              </Button>
              {selectedTask.status === 'accepted' && (
                <Button
                  onClick={() => handleUpdateStatus('in_progress')}
                  loading={updating}
                >
                  Mark In Progress
                </Button>
              )}
              {selectedTask.status === 'in_progress' && (
                <Button
                  variant="success"
                  onClick={() => handleUpdateStatus('completed')}
                  loading={updating}
                >
                  Mark Completed
                </Button>
              )}
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">{selectedTask.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{selectedTask.description}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Status</p>
              <Badge variant={getStatusColor(selectedTask.status)}>
                {selectedTask.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            
            <Textarea
              label="Progress Notes"
              value={updateNotes}
              onChange={(e) => setUpdateNotes(e.target.value)}
              placeholder="Add notes about your progress, challenges, or completion details..."
              rows={4}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

/**
 * Individual Task Card Component
 */
const TaskCard = ({ task, onAccept, onUpdate }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
            <Badge variant={getStatusColor(task.status)} size="sm">
              {task.status.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge
              variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'info'}
              size="sm"
            >
              {task.priority.toUpperCase()} PRIORITY
            </Badge>
          </div>
          <p className="text-gray-600 mb-3">{task.description}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Location</p>
          <div className="flex items-start">
            <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
            <p className="text-sm text-gray-900">{task.location}</p>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 mb-1">Assigned</p>
          <p className="text-sm text-gray-900">{formatDate(task.assignedAt)}</p>
        </div>
        
        {task.acceptedAt && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Accepted</p>
            <p className="text-sm text-gray-900">{formatDate(task.acceptedAt)}</p>
          </div>
        )}
        
        {task.completedAt && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Completed</p>
            <p className="text-sm text-gray-900">{formatDate(task.completedAt)}</p>
          </div>
        )}
      </div>
      
      {task.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Notes</p>
          <p className="text-sm text-gray-900">{task.notes}</p>
        </div>
      )}
      
      <div className="flex gap-3">
        {task.status === 'pending' && onAccept && (
          <Button
            size="sm"
            onClick={() => onAccept(task.id)}
          >
            Accept Task
          </Button>
        )}
        
        {(task.status === 'accepted' || task.status === 'in_progress') && onUpdate && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdate(task)}
          >
            Update Status
          </Button>
        )}
        
        {task.coordinates && (
          <Button
            size="sm"
            variant="ghost"
            icon={MapPin}
            onClick={() => {
              window.open(
                `https://www.google.com/maps?q=${task.coordinates.lat},${task.coordinates.lng}`,
                '_blank'
              );
            }}
          >
            View on Map
          </Button>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
