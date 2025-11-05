import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/Auth';
import phoneCallService from '../../../services/phoneCallService';
import Button from '../../../base-components/Button';
import Card from '../../../base-components/Card';
import Table from '../../../base-components/Table';
import { Dialog } from '../../../base-components/Headless';
import {
  FormSelect
} from '../../../base-components/Form';
import Notification, { NotificationElement } from '../../../base-components/Notification';
import LoadingIcon from '../../../base-components/LoadingIcon';
import { 
  Phone, 
  PhoneMissed, 
  PhoneForwarded, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  MessageSquare
} from 'lucide-react';

interface PhoneCall {
  _id: string;
  callerName: string;
  callerPhone: string;
  callType: 'Incoming' | 'Outgoing' | 'Missed';
  callDate: string;
  callTime?: string;
  duration?: number;
  purpose: string;
  notes?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  followUpNotes?: string;
  followUpCompleted: boolean;
  status: 'Active' | 'Completed' | 'Follow-up Required' | 'Resolved';
  relatedTo?: {
    type: 'Student' | 'Parent' | 'Teacher' | 'General' | 'Other';
    referenceId?: string;
    referenceName?: string;
  };
  handledBy: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  tags?: string[];
}

const PhoneCalls: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const notify = useRef<NotificationElement>();
  
  // State management
  const [phoneCalls, setPhoneCalls] = useState<PhoneCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [callToDelete, setCallToDelete] = useState<string | null>(null);
  
  // Pagination and filtering
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    total_pages: 1,
    per_page: 10
  });
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    callType: '',
    status: '',
    priority: '',
    followUpRequired: ''
  });

  // Load phone calls on component mount and when filters change
  useEffect(() => {
    loadPhoneCalls();
  }, [pagination.current_page, search, filters]);

  const loadPhoneCalls = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current_page,
        limit: pagination.per_page,
        search,
        ...filters
      };
      
      const response = await phoneCallService.getPhoneCalls(params);
      setPhoneCalls(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading phone calls:', error);
      notify.current?.showToast();
    } finally {
      setLoading(false);
    }
  };

  // Navigation functions
  const handleAddPhoneCall = () => {
    navigate('/home/phonecalls/add');
  };

  const handleEditPhoneCall = (phoneCall: PhoneCall) => {
    navigate('/home/phonecalls/edit', {
      state: { phoneCall }
    });
  };

  const handleDelete = async () => {
    if (!callToDelete) return;
    
    try {
      await phoneCallService.deletePhoneCall(callToDelete);
      notify.current?.showToast();
      setDeleteDialog(false);
      setCallToDelete(null);
      loadPhoneCalls();
    } catch (error) {
      console.error('Error deleting phone call:', error);
      notify.current?.showToast();
    }
  };

  const handleCompleteFollowUp = async (callId: string) => {
    try {
      await phoneCallService.completeFollowUp(callId);
      notify.current?.showToast();
      loadPhoneCalls();
    } catch (error) {
      console.error('Error completing follow-up:', error);
      notify.current?.showToast();
    }
  };

  const getCallIcon = (type: string) => {
    switch (type) {
      case 'Incoming':
        return <Phone className="h-4 w-4 text-green-500" />;
      case 'Outgoing':
        return <PhoneForwarded className="h-4 w-4 text-blue-500" />;
      case 'Missed':
        return <PhoneMissed className="h-4 w-4 text-red-500" />;
      default:
        return <Phone className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <Notification getRef={(el) => { notify.current = el; }} />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Phone Call Log</h1>
          <p className="text-muted-foreground">Manage and track phone calls</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap">
        <Button
          variant="primary"
          className="mr-2 mb-2"
          onClick={handleAddPhoneCall}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Phone Call
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search calls..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <FormSelect
              value={filters.callType}
              onChange={(e) => setFilters({ ...filters, callType: e.target.value })}
            >
              <option value="">All Call Types</option>
              <option value="Incoming">Incoming</option>
              <option value="Outgoing">Outgoing</option>
              <option value="Missed">Missed</option>
            </FormSelect>

            <FormSelect
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Follow-up Required">Follow-up Required</option>
              <option value="Resolved">Resolved</option>
            </FormSelect>

            <FormSelect
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </FormSelect>

            <FormSelect
              value={filters.followUpRequired}
              onChange={(e) => setFilters({ ...filters, followUpRequired: e.target.value })}
            >
              <option value="">All Follow-ups</option>
              <option value="true">Follow-up Required</option>
              <option value="false">No Follow-up</option>
            </FormSelect>
          </div>
        </div>
      </Card>

      {/* Phone Calls Table */}
      <Card>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingIcon icon="oval" color="primary" className="w-8 h-8" />
            </div>
          ) : (
            <>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Caller</Table.Th>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Date & Time</Table.Th>
                    <Table.Th>Purpose</Table.Th>
                    <Table.Th>Priority</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Follow-up</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {phoneCalls.map((call) => (
                    <Table.Tr key={call._id}>
                      <Table.Td>
                        <div>
                          <div className="font-medium">{call.callerName}</div>
                          <div className="text-sm text-gray-500">{call.callerPhone}</div>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <div className="flex items-center gap-2">
                          {getCallIcon(call.callType)}
                          <span>{call.callType}</span>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{formatDate(call.callDate)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(call.callDate)}</span>
                          </div>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <div className="max-w-xs truncate" title={call.purpose}>
                          {call.purpose}
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(call.priority)}`}>
                          {call.priority}
                        </span>
                      </Table.Td>
                      <Table.Td>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          call.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                          call.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          call.status === 'Follow-up Required' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {call.status}
                        </span>
                      </Table.Td>
                      <Table.Td>
                        {call.followUpRequired ? (
                          <div className="flex items-center gap-2">
                            {call.followUpCompleted ? (
                              <span className="text-green-600 text-sm">Completed</span>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline-success"
                                onClick={() => handleCompleteFollowUp(call._id)}
                                className="text-xs"
                              >
                                Complete
                              </Button>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => handleEditPhoneCall(call)}
                            className="mr-1"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => {
                              setCallToDelete(call._id);
                              setDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>

              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} results
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setPagination(prev => ({ ...prev, current_page: Math.max(1, prev.current_page - 1) }))}
                        disabled={pagination.current_page === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-gray-700">
                        Page {pagination.current_page} of {pagination.total_pages}
                      </span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setPagination(prev => ({ ...prev, current_page: Math.min(prev.total_pages, prev.current_page + 1) }))}
                        disabled={pagination.current_page === pagination.total_pages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <Dialog.Panel>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this phone call? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline-secondary"
                onClick={() => setDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default PhoneCalls;