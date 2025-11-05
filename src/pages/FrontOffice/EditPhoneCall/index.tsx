import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../../contexts/Auth';
import phoneCallService from '../../../services/phoneCallService';
import Button from '../../../base-components/Button';
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
  ArrowLeft,
  Save,
  Edit
} from 'lucide-react';

// Validation schema
const phoneCallSchema = yup.object({
  callerName: yup.string().required('Caller name is required'),
  callerPhone: yup.string().required('Phone number is required'),
  callType: yup.string().required('Call type is required'),
  purpose: yup.string().required('Purpose is required'),
  notes: yup.string(),
  followUpRequired: yup.boolean(),
  followUpDate: yup.string().when('followUpRequired', {
    is: true,
    then: yup.string().required('Follow-up date is required when follow-up is needed'),
    otherwise: yup.string()
  }),
  priority: yup.string().required('Priority is required'),
  handledBy: yup.string().required('Handled by is required')
});

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

const EditPhoneCall: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const notify = useRef<NotificationElement>();
  const [loading, setLoading] = useState(false);
  const [phoneCall, setPhoneCall] = useState<PhoneCall | null>(null);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(phoneCallSchema),
    defaultValues: {
      callerName: '',
      callerPhone: '',
      callType: 'Incoming',
      purpose: '',
      notes: '',
      followUpRequired: false,
      followUpDate: '',
      priority: 'Medium',
      handledBy: ''
    }
  });

  const followUpRequired = watch('followUpRequired');

  useEffect(() => {
    // Get phone call data from location state
    if (location.state?.phoneCall) {
      setPhoneCall(location.state.phoneCall);
      populateForm(location.state.phoneCall);
    } else {
      // If no phone call data, redirect back to phone calls
      navigate('/home/phonecalls');
    }
  }, [location.state, navigate]);

  const populateForm = (phoneCall: PhoneCall) => {
    setValue('callerName', phoneCall.callerName);
    setValue('callerPhone', phoneCall.callerPhone);
    setValue('callType', phoneCall.callType);
    setValue('purpose', phoneCall.purpose);
    setValue('notes', phoneCall.notes || '');
    setValue('followUpRequired', phoneCall.followUpRequired);
    // Fix date format - ensure it's in YYYY-MM-DD format
    const followUpDate = phoneCall.followUpDate ? 
      new Date(phoneCall.followUpDate).toISOString().split('T')[0] : '';
    setValue('followUpDate', followUpDate);
    setValue('priority', phoneCall.priority);
    setValue('handledBy', phoneCall.handledBy);
    
    // Trigger validation after setting all values
    setTimeout(() => {
      trigger();
    }, 100);
  };

  const onSubmit = async (data: any) => {
    if (!phoneCall) return;

    try {
      setLoading(true);
      await phoneCallService.updatePhoneCall(phoneCall._id, data);
      notify.current?.showToast();
      
      // Navigate back to phone calls list
      setTimeout(() => {
        navigate('/home/phonecalls');
      }, 1500);
    } catch (error: any) {
      console.error('Error updating phone call:', error);
      notify.current?.showToast();
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/home/phonecalls');
  };

  if (!phoneCall) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingIcon icon="oval" className="w-8 h-8" />
          <p className="mt-4 text-gray-600">Loading phone call details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Notification getRef={(el) => { notify.current = el; }} />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleGoBack}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Phone Calls
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Phone Call</h1>
                <p className="text-gray-600">Update phone call information</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Current Information */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Caller Name</label>
                  <p className="text-gray-900 font-medium">{phoneCall.callerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <p className="text-gray-900 font-medium">{phoneCall.callerPhone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Call Type</label>
                  <p className="text-gray-900 font-medium">{phoneCall.callType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    phoneCall.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : phoneCall.status === 'Completed'
                      ? 'bg-blue-100 text-blue-800'
                      : phoneCall.status === 'Follow-up Required'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {phoneCall.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Call Date</label>
                  <p className="text-gray-900 font-medium">
                    {new Date(phoneCall.callDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    phoneCall.priority === 'Urgent' 
                      ? 'bg-red-100 text-red-800' 
                      : phoneCall.priority === 'High'
                      ? 'bg-orange-100 text-orange-800'
                      : phoneCall.priority === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {phoneCall.priority}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Update Phone Call</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormLabel htmlFor="callerName">Caller Name *</FormLabel>
                    <FormInput
                      id="callerName"
                      type="text"
                      placeholder="Enter caller name"
                      {...register('callerName')}
                    />
                    {errors.callerName && (
                      <div className="mt-1 text-red-500 text-sm">{String(errors.callerName.message)}</div>
                    )}
                  </div>
                  
                  <div>
                    <FormLabel htmlFor="callerPhone">Phone Number *</FormLabel>
                    <FormInput
                      id="callerPhone"
                      type="tel"
                      placeholder="Enter phone number"
                      {...register('callerPhone')}
                    />
                    {errors.callerPhone && (
                      <div className="mt-1 text-red-500 text-sm">{String(errors.callerPhone.message)}</div>
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
                      <div className="mt-1 text-red-500 text-sm">{String(errors.callType.message)}</div>
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
                      <div className="mt-1 text-red-500 text-sm">{String(errors.priority.message)}</div>
                    )}
                  </div>
                  
                  <div>
                    <FormLabel htmlFor="handledBy">Handled By *</FormLabel>
                    <FormInput
                      id="handledBy"
                      type="text"
                      placeholder="Enter handler name"
                      {...register('handledBy')}
                    />
                    {errors.handledBy && (
                      <div className="mt-1 text-red-500 text-sm">{String(errors.handledBy.message)}</div>
                    )}
                  </div>
                  
                  <div>
                    <FormLabel htmlFor="purpose">Purpose *</FormLabel>
                    <FormInput
                      id="purpose"
                      type="text"
                      placeholder="Enter call purpose"
                      {...register('purpose')}
                    />
                    {errors.purpose && (
                      <div className="mt-1 text-red-500 text-sm">{String(errors.purpose.message)}</div>
                    )}
                  </div>
                </div>
                
                <div>
                  <FormLabel htmlFor="notes">Notes</FormLabel>
                  <FormTextarea
                    id="notes"
                    placeholder="Enter additional notes"
                    rows={4}
                    {...register('notes')}
                  />
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-4">Follow-up Information</h3>
                  
                  <div className="space-y-4">
                    <FormCheck
                      id="followUpRequired"
                      {...register('followUpRequired')}
                      label="Follow-up Required"
                    />
                    
                    {followUpRequired && (
                      <div>
                        <FormLabel htmlFor="followUpDate">Follow-up Date *</FormLabel>
                        <FormInput
                          id="followUpDate"
                          type="date"
                          {...register('followUpDate')}
                        />
                        {errors.followUpDate && (
                          <div className="mt-1 text-red-500 text-sm">{String(errors.followUpDate.message)}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={handleGoBack}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <LoadingIcon icon="oval" className="w-4 h-4" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4" />
                        Update Phone Call
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPhoneCall;
