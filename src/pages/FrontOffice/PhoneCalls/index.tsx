import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../../contexts/Auth';
import phoneCallService from '../../../services/phoneCallService';
import Button from '../../../base-components/Button';
import Card from '../../../base-components/Card';
import Table from '../../../base-components/Table';
import Pagination from '../../../base-components/Pagination';
import { Dialog } from '../../../base-components/Headless';
import {
  FormInput,
  FormSelect,
  FormTextarea,
  FormLabel,
  FormCheck
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
  MessageSquare,
  X
} from 'lucide-react';

// Validation schema
const phoneCallSchema = yup.object({
  callerName: yup.string().required('Caller name is required'),
  callerPhone: yup.string().required('Phone number is required'),
  callerEmail: yup.string().email('Invalid email format'),
  callType: yup.string().required('Call type is required'),
  purpose: yup.string().required('Purpose is required'),
  notes: yup.string(),
  followUpRequired: yup.boolean(),
  followUpDate: yup.date().when('followUpRequired', {
    is: true,
    then: yup.date().required('Follow-up date is required when follow-up is needed'),
    otherwise: yup.date()
  }),
  priority: yup.string().required('Priority is required'),
  handledBy: yup.string().required('Handled by is required')
});

interface PhoneCall {
  _id: string;
  callerName: string;
  callerPhone: string;
  callerEmail?: string;
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
  const { user } = useAuth();
  const notify = useRef<NotificationElement>();
  
  // State management
  const [phoneCalls, setPhoneCalls] = useState<PhoneCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCall, setEditingCall] = useState<PhoneCall | null>(null);
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

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(phoneCallSchema),
    defaultValues: {
      callType: 'Incoming',
      priority: 'Medium',
      followUpRequired: false,
      handledBy: user?.firstname + ' ' + user?.lastname || ''
    }
  });

  const followUpRequired = watch('followUpRequired');

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
      notify.current?.showToast({
        title: 'Error',
        message: 'Failed to load phone calls',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (editingCall) {
        await phoneCallService.updatePhoneCall(editingCall._id, data);
        notify.current?.showToast({
          title: 'Success',
          message: 'Phone call updated successfully',
          type: 'success'
        });
      } else {
        await phoneCallService.createPhoneCall(data);
        notify.current?.showToast({
          title: 'Success',
          message: 'Phone call recorded successfully',
          type: 'success'
        });
      }
      
      setDialogOpen(false);
      setEditingCall(null);
      reset();
      loadPhoneCalls();
    } catch (error) {
      console.error('Error saving phone call:', error);
      notify.current?.showToast({
        title: 'Error',
        message: 'Failed to save phone call',
        type: 'error'
      });
    }
  };

  const handleEdit = (call: PhoneCall) => {
    setEditingCall(call);
    setValue('callerName', call.callerName);
    setValue('callerPhone', call.callerPhone);
    setValue('callerEmail', call.callerEmail || '');
    setValue('callType', call.callType);
    setValue('purpose', call.purpose);
    setValue('notes', call.notes || '');
    setValue('followUpRequired', call.followUpRequired);
    setValue('followUpDate', call.followUpDate || '');
    setValue('priority', call.priority);
    setValue('handledBy', call.handledBy);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!callToDelete) return;
    
    try {
      await phoneCallService.deletePhoneCall(callToDelete);
      notify.current?.showToast({
        title: 'Success',
        message: 'Phone call deleted successfully',
        type: 'success'
      });
      setDeleteDialog(false);
      setCallToDelete(null);
      loadPhoneCalls();
    } catch (error) {
      console.error('Error deleting phone call:', error);
      notify.current?.showToast({
        title: 'Error',
        message: 'Failed to delete phone call',
        type: 'error'
      });
    }
  };

  const handleCompleteFollowUp = async (callId: string) => {
    try {
      await phoneCallService.completeFollowUp(callId);
      notify.current?.showToast({
        title: 'Success',
        message: 'Follow-up marked as completed',
        type: 'success'
      });
      loadPhoneCalls();
    } catch (error) {
      console.error('Error completing follow-up:', error);
      notify.current?.showToast({
        title: 'Error',
        message: 'Failed to complete follow-up',
        type: 'error'
      });
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
        <Button
          onClick={() => {
            setEditingCall(null);
            reset();
            setDialogOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
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
                                variant="outline"
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
                            variant="outline"
                            onClick={() => handleEdit(call)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
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
                  <Pagination
                    currentPage={pagination.current_page}
                    totalPages={pagination.total_pages}
                    onPageChange={(page) => setPagination({ ...pagination, current_page: page })}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Add/Edit Phone Call Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <Dialog.Panel>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">
                {editingCall ? 'Edit Phone Call' : 'Add New Phone Call'}
              </h3>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormLabel htmlFor="callerName">Caller Name *</FormLabel>
                  <FormInput
                    id="callerName"
                    {...register('callerName')}
                    placeholder="Enter caller name"
                  />
                  {errors.callerName && (
                    <p className="text-red-500 text-sm mt-1">{errors.callerName.message}</p>
                  )}
                </div>

                <div>
                  <FormLabel htmlFor="callerPhone">Phone Number *</FormLabel>
                  <FormInput
                    id="callerPhone"
                    {...register('callerPhone')}
                    placeholder="Enter phone number"
                  />
                  {errors.callerPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.callerPhone.message}</p>
                  )}
                </div>

                <div>
                  <FormLabel htmlFor="callerEmail">Email</FormLabel>
                  <FormInput
                    id="callerEmail"
                    type="email"
                    {...register('callerEmail')}
                    placeholder="Enter email address"
                  />
                  {errors.callerEmail && (
                    <p className="text-red-500 text-sm mt-1">{errors.callerEmail.message}</p>
                  )}
                </div>

                <div>
                  <FormLabel htmlFor="callType">Call Type *</FormLabel>
                  <FormSelect id="callType" {...register('callType')}>
                    <option value="Incoming">Incoming</option>
                    <option value="Outgoing">Outgoing</option>
                    <option value="Missed">Missed</option>
                  </FormSelect>
                  {errors.callType && (
                    <p className="text-red-500 text-sm mt-1">{errors.callType.message}</p>
                  )}
                </div>

                <div>
                  <FormLabel htmlFor="priority">Priority *</FormLabel>
                  <FormSelect id="priority" {...register('priority')}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </FormSelect>
                  {errors.priority && (
                    <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>
                  )}
                </div>

                <div>
                  <FormLabel htmlFor="handledBy">Handled By *</FormLabel>
                  <FormInput
                    id="handledBy"
                    {...register('handledBy')}
                    placeholder="Enter handler name"
                  />
                  {errors.handledBy && (
                    <p className="text-red-500 text-sm mt-1">{errors.handledBy.message}</p>
                  )}
                </div>
              </div>

              <div>
                <FormLabel htmlFor="purpose">Purpose *</FormLabel>
                <FormInput
                  id="purpose"
                  {...register('purpose')}
                  placeholder="Enter call purpose"
                />
                {errors.purpose && (
                  <p className="text-red-500 text-sm mt-1">{errors.purpose.message}</p>
                )}
              </div>

              <div>
                <FormLabel htmlFor="notes">Notes</FormLabel>
                <FormTextarea
                  id="notes"
                  {...register('notes')}
                  placeholder="Enter additional notes"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-4">
                <FormCheck
                  id="followUpRequired"
                  {...register('followUpRequired')}
                  label="Follow-up Required"
                />
              </div>

              {followUpRequired && (
                <div>
                  <FormLabel htmlFor="followUpDate">Follow-up Date</FormLabel>
                  <FormInput
                    id="followUpDate"
                    type="date"
                    {...register('followUpDate')}
                  />
                  {errors.followUpDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.followUpDate.message}</p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCall ? 'Update' : 'Save'} Phone Call
                </Button>
              </div>
            </form>
          </div>
        </Dialog.Panel>
      </Dialog>

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
                variant="outline"
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